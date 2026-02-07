export const DEFAULT_KEY_BINDINGS: Record<string, string> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  z: 'a',
  x: 'b',
  Enter: 'start',
  Shift: 'select',
};

export function getButtonForKey(key: string): string | null {
  return DEFAULT_KEY_BINDINGS[key] || null;
}
