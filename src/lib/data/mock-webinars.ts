export type WebinarStatus = 'live' | 'upcoming' | 'recorded';

export const CARD_GRADIENTS = [
  'from-rose-300 to-rose-100',
  'from-teal-400 to-teal-200',
  'from-violet-400 to-violet-200',
  'from-amber-400 to-amber-200',
  'from-sky-400 to-sky-200',
  'from-emerald-400 to-emerald-200',
  'from-fuchsia-400 to-fuchsia-200',
  'from-indigo-400 to-indigo-200',
  'from-cyan-400 to-cyan-200',
  'from-orange-400 to-orange-200',
  'from-lime-400 to-lime-200',
  'from-blue-400 to-blue-200',
] as const;

export function getCardGradient(id: string): string {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CARD_GRADIENTS[Math.abs(index) % CARD_GRADIENTS.length];
}
