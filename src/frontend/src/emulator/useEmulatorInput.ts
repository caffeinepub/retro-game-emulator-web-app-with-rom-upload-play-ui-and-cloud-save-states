import { useEffect } from 'react';
import { EmulatorCore } from './EmulatorCore';
import { getButtonForKey } from './inputMappings';

export function useEmulatorInput(emulator: EmulatorCore | null) {
  useEffect(() => {
    if (!emulator) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const button = getButtonForKey(e.key);
      if (button) {
        e.preventDefault();
        emulator.handleInput(button, true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const button = getButtonForKey(e.key);
      if (button) {
        e.preventDefault();
        emulator.handleInput(button, false);
      }
    };

    const handleCustomButton = (e: Event) => {
      const customEvent = e as CustomEvent<{ button: string; pressed: boolean }>;
      if (customEvent.detail) {
        emulator.handleInput(customEvent.detail.button, customEvent.detail.pressed);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('emulator-button', handleCustomButton);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('emulator-button', handleCustomButton);
    };
  }, [emulator]);

  return {
    pressButton: (button: string) => {
      if (emulator) {
        emulator.handleInput(button, true);
      }
    },
    releaseButton: (button: string) => {
      if (emulator) {
        emulator.handleInput(button, false);
      }
    },
  };
}
