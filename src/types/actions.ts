/** Shared return shape for auth server actions (login, register). */
export type AuthActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/** Shared return shape for admin form actions. */
export type AdminActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
