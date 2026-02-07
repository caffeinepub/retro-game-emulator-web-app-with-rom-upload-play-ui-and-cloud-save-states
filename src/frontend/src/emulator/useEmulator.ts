import { useRef, useState, useCallback, useEffect } from 'react';
import { EmulatorCore } from './EmulatorCore';
import { useEmulatorInput } from './useEmulatorInput';
import { useSettings } from '../storage/settings';

export function useEmulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emulatorRef = useRef<EmulatorCore | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();

  // Pass the emulator instance to the input hook
  useEmulatorInput(emulatorRef.current);

  useEffect(() => {
    if (canvasRef.current && !emulatorRef.current) {
      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
      emulatorRef.current = new EmulatorCore(canvasRef.current);
    }

    return () => {
      if (emulatorRef.current) {
        emulatorRef.current.cleanup();
        emulatorRef.current = null;
      }
    };
  }, []);

  const loadROM = useCallback(async (file: File) => {
    try {
      setError(null);
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      
      if (emulatorRef.current) {
        await emulatorRef.current.loadROM(data);
      }
    } catch (err) {
      setError('Failed to load ROM file');
      console.error(err);
    }
  }, []);

  const start = useCallback(() => {
    try {
      setError(null);
      if (emulatorRef.current) {
        emulatorRef.current.start();
        setIsRunning(true);
        setIsPaused(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start emulator');
    }
  }, []);

  const pause = useCallback(() => {
    if (emulatorRef.current) {
      emulatorRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (emulatorRef.current) {
      emulatorRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (emulatorRef.current) {
      emulatorRef.current.reset();
    }
  }, []);

  const exportState = useCallback((): Uint8Array | null => {
    if (emulatorRef.current) {
      return emulatorRef.current.exportState();
    }
    return null;
  }, []);

  const importState = useCallback((data: Uint8Array) => {
    if (emulatorRef.current) {
      emulatorRef.current.importState(data);
    }
  }, []);

  return {
    canvasRef,
    isRunning,
    isPaused,
    error,
    loadROM,
    start,
    pause,
    resume,
    reset,
    exportState,
    importState,
  };
}
