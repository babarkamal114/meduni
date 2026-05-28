const ZOOM_TOKEN_URL = 'https://zoom.us/oauth/token';
const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2';

export class ZoomApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ZoomApiError';
    this.status = status;
  }
}

type ZoomTokenResponse = {
  access_token: string;
};

export type ZoomCreateWebinarInput = {
  topic: string;
  startTime: string;
  durationMinutes: number;
  agenda?: string;
};

export type ZoomCreateWebinarResult = {
  id: string;
  hostId: string;
  joinUrl: string | null;
  startUrl: string | null;
};

export type ZoomCreateMeetingInput = {
  topic: string;
  startTime: string;
  durationMinutes: number;
  agenda?: string;
};

export type ZoomCreateMeetingResult = {
  id: string;
  hostId: string;
  joinUrl: string | null;
  startUrl: string | null;
};

export type ZoomRegistrantInput = {
  webinarId: string;
  email: string;
  firstName: string;
  lastName?: string;
};

export type ZoomRegistrantResult = {
  registrantId: string;
  joinUrl: string;
};

function getZoomEnv() {
  const accountId = process.env.ZOOM_ACCOUNT_ID?.trim();
  const clientId = process.env.ZOOM_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOOM_CLIENT_SECRET?.trim();
  const hostUserId = process.env.ZOOM_HOST_USER_ID?.trim();

  if (!accountId || !clientId || !clientSecret || !hostUserId) {
    throw new Error('Zoom is not fully configured. Missing Zoom environment variables.');
  }

  return { accountId, clientId, clientSecret, hostUserId };
}

async function getZoomAccessToken(): Promise<string> {
  const { accountId, clientId, clientSecret } = getZoomEnv();
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenUrl = `${ZOOM_TOKEN_URL}?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new ZoomApiError(`Failed to authenticate with Zoom: ${body || response.statusText}`, response.status);
  }

  const json = (await response.json()) as ZoomTokenResponse;
  if (!json.access_token) {
    throw new Error('Zoom token response did not include access token.');
  }
  return json.access_token;
}

async function zoomRequest<T>(path: string, options: RequestInit): Promise<T> {
  const token = await getZoomAccessToken();
  const response = await fetch(`${ZOOM_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = data?.message || response.statusText || 'Zoom API request failed';
    throw new ZoomApiError(message, response.status);
  }

  return data as T;
}

function parseDurationMinutes(duration: string | null | undefined): number {
  if (!duration) return 90;
  const normalized = duration.toLowerCase().trim();

  const hourMatch = normalized.match(/(\d+(?:\.\d+)?)\s*h/);
  if (hourMatch) {
    const hours = Number.parseFloat(hourMatch[1]);
    if (!Number.isNaN(hours) && hours > 0) return Math.max(15, Math.round(hours * 60));
  }

  const minuteMatch = normalized.match(/(\d+)\s*m/);
  if (minuteMatch) {
    const minutes = Number.parseInt(minuteMatch[1], 10);
    if (!Number.isNaN(minutes) && minutes > 0) return Math.max(15, minutes);
  }

  const numberMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    const value = Number.parseFloat(numberMatch[1]);
    if (!Number.isNaN(value) && value > 0) {
      if (normalized.includes('hour')) return Math.max(15, Math.round(value * 60));
      return Math.max(15, Math.round(value));
    }
  }

  return 90;
}

export function toZoomDurationMinutes(duration: string | null | undefined): number {
  return parseDurationMinutes(duration);
}

export async function createZoomWebinar(input: ZoomCreateWebinarInput): Promise<ZoomCreateWebinarResult> {
  const { hostUserId } = getZoomEnv();
  const payload = {
    topic: input.topic,
    type: 5,
    start_time: input.startTime,
    duration: input.durationMinutes,
    timezone: 'UTC',
    agenda: input.agenda ?? undefined,
    settings: {
      approval_type: 0,
      registrants_email_notification: true,
      waiting_room: true,
    },
  };

  const data = await zoomRequest<{
    id: number | string;
    host_id: string;
    join_url?: string;
    start_url?: string;
  }>(`/users/${encodeURIComponent(hostUserId)}/webinars`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    id: String(data.id),
    hostId: data.host_id,
    joinUrl: data.join_url ?? null,
    startUrl: data.start_url ?? null,
  };
}

export async function createZoomMeeting(input: ZoomCreateMeetingInput): Promise<ZoomCreateMeetingResult> {
  const { hostUserId } = getZoomEnv();
  const payload = {
    topic: input.topic,
    type: 2,
    start_time: input.startTime,
    duration: input.durationMinutes,
    timezone: 'UTC',
    agenda: input.agenda ?? undefined,
    settings: {
      join_before_host: true,
      waiting_room: false,
      approval_type: 2,
    },
  };

  const data = await zoomRequest<{
    id: number | string;
    host_id: string;
    join_url?: string;
    start_url?: string;
  }>(`/users/${encodeURIComponent(hostUserId)}/meetings`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    id: String(data.id),
    hostId: data.host_id,
    joinUrl: data.join_url ?? null,
    startUrl: data.start_url ?? null,
  };
}

export async function createZoomRegistrant(input: ZoomRegistrantInput): Promise<ZoomRegistrantResult> {
  const data = await zoomRequest<{
    registrant_id: string;
    join_url: string;
  }>(`/webinars/${encodeURIComponent(input.webinarId)}/registrants`, {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName ?? '-',
    }),
  });

  return {
    registrantId: data.registrant_id,
    joinUrl: data.join_url,
  };
}
