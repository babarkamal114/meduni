import { render } from '@react-email/render';
import type { ReactElement } from 'react';

export async function renderEmail(component: ReactElement): Promise<string> {
  return render(component);
}
