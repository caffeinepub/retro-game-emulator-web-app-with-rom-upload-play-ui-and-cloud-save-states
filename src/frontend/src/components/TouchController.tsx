import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function TouchController() {
  const [pressedButtons, setPressedButtons] = useState<Set<string>>(new Set());

  const handleTouchStart = (button: string) => {
    setPressedButtons((prev) => new Set(prev).add(button));
    // Dispatch custom event for emulator to listen to
    window.dispatchEvent(new CustomEvent('emulator-button', { detail: { button, pressed: true } }));
  };

  const handleTouchEnd = (button: string) => {
    setPressedButtons((prev) => {
      const next = new Set(prev);
      next.delete(button);
      return next;
    });
    // Dispatch custom event for emulator to listen to
    window.dispatchEvent(new CustomEvent('emulator-button', { detail: { button, pressed: false } }));
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center gap-8">
          {/* D-Pad */}
          <div className="relative w-32 h-32">
            <button
              onTouchStart={() => handleTouchStart('up')}
              onTouchEnd={() => handleTouchEnd('up')}
              onMouseDown={() => handleTouchStart('up')}
              onMouseUp={() => handleTouchEnd('up')}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-t-lg active:bg-primary/80"
            >
              ↑
            </button>
            <button
              onTouchStart={() => handleTouchStart('down')}
              onTouchEnd={() => handleTouchEnd('down')}
              onMouseDown={() => handleTouchStart('down')}
              onMouseUp={() => handleTouchEnd('down')}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-b-lg active:bg-primary/80"
            >
              ↓
            </button>
            <button
              onTouchStart={() => handleTouchStart('left')}
              onTouchEnd={() => handleTouchEnd('left')}
              onMouseDown={() => handleTouchStart('left')}
              onMouseUp={() => handleTouchEnd('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-l-lg active:bg-primary/80"
            >
              ←
            </button>
            <button
              onTouchStart={() => handleTouchStart('right')}
              onTouchEnd={() => handleTouchEnd('right')}
              onMouseDown={() => handleTouchStart('right')}
              onMouseUp={() => handleTouchEnd('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-r-lg active:bg-primary/80"
            >
              →
            </button>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 bg-muted rounded-full" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <button
                onTouchStart={() => handleTouchStart('b')}
                onTouchEnd={() => handleTouchEnd('b')}
                onMouseDown={() => handleTouchStart('b')}
                onMouseUp={() => handleTouchEnd('b')}
                className="w-14 h-14 bg-destructive rounded-full active:bg-destructive/80 font-bold text-destructive-foreground"
              >
                B
              </button>
              <button
                onTouchStart={() => handleTouchStart('a')}
                onTouchEnd={() => handleTouchEnd('a')}
                onMouseDown={() => handleTouchStart('a')}
                onMouseUp={() => handleTouchEnd('a')}
                className="w-14 h-14 bg-destructive rounded-full active:bg-destructive/80 font-bold text-destructive-foreground"
              >
                A
              </button>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onTouchStart={() => handleTouchStart('select')}
                onTouchEnd={() => handleTouchEnd('select')}
                onMouseDown={() => handleTouchStart('select')}
                onMouseUp={() => handleTouchEnd('select')}
                className="px-4 py-2 bg-secondary rounded active:bg-secondary/80 text-xs font-medium"
              >
                SELECT
              </button>
              <button
                onTouchStart={() => handleTouchStart('start')}
                onTouchEnd={() => handleTouchEnd('start')}
                onMouseDown={() => handleTouchStart('start')}
                onMouseUp={() => handleTouchEnd('start')}
                className="px-4 py-2 bg-secondary rounded active:bg-secondary/80 text-xs font-medium"
              >
                START
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
