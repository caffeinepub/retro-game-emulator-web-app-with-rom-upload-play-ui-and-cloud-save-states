import { useState, useEffect } from 'react';
import { useEmulator } from '../emulator/useEmulator';
import { useGetLibraryGame } from '../storage/romLibrary';
import { useSaveStates } from '../hooks/useSaveStates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, RotateCcw, Upload, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import TouchController from '../components/TouchController';
import { DEFAULT_KEY_BINDINGS } from '../emulator/inputMappings';

interface PlayScreenProps {
  gameId: string | null;
  onBackToLibrary: () => void;
}

export default function PlayScreen({ gameId, onBackToLibrary }: PlayScreenProps) {
  const [romFile, setRomFile] = useState<File | null>(null);
  const [showTouchControls, setShowTouchControls] = useState(false);
  const [saveName, setSaveName] = useState('');
  const { data: game } = useGetLibraryGame(gameId);
  const { saves, createSave, loadSave, deleteSave } = useSaveStates(gameId);
  
  const {
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
  } = useEmulator();

  useEffect(() => {
    if (game?.romData) {
      // Convert Uint8Array to regular array for Blob constructor
      const romDataArray = Array.from(game.romData);
      const blob = new Blob([new Uint8Array(romDataArray)]);
      const file = new File([blob], game.title, { type: 'application/octet-stream' });
      setRomFile(file);
      loadROM(file);
    }
  }, [game, loadROM]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRomFile(file);
      loadROM(file);
    }
  };

  const handleCreateSave = async () => {
    if (!saveName.trim()) {
      toast.error('Please enter a save name');
      return;
    }
    if (!gameId) {
      toast.error('No game loaded');
      return;
    }

    try {
      const stateData = exportState();
      if (!stateData) {
        toast.error('Failed to export save state');
        return;
      }
      await createSave(saveName.trim(), stateData);
      setSaveName('');
      toast.success('Save state created');
    } catch (error) {
      toast.error('Failed to create save state');
    }
  };

  const handleLoadSave = async (saveId: string) => {
    try {
      const stateData = await loadSave(saveId);
      if (stateData) {
        importState(stateData);
        toast.success('Save state loaded');
      }
    } catch (error) {
      toast.error('Failed to load save state');
    }
  };

  const handleDeleteSave = async (saveId: string) => {
    try {
      await deleteSave(saveId);
      toast.success('Save state deleted');
    } catch (error) {
      toast.error('Failed to delete save state');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBackToLibrary} variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Button>
        <h2 className="text-2xl font-bold">{game?.title || 'Play'}</h2>
        <div className="w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emulator Display */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
                {/* CRT TV Frame Overlay */}
                <img
                  src="/assets/generated/crt-tv-frame.dim_1600x900.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{ zIndex: 1 }}
                />
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80" style={{ zIndex: 2 }}>
                    <p className="text-destructive">{error}</p>
                  </div>
                )}
                {!romFile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80" style={{ zIndex: 2 }}>
                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground">No ROM loaded</p>
                      <Label htmlFor="rom-upload" className="cursor-pointer">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                          <Upload className="w-4 h-4" />
                          Select ROM File
                        </div>
                        <Input
                          id="rom-upload"
                          type="file"
                          accept=".nes,.gb,.gbc,.gba,.smc,.sfc"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {!isRunning ? (
                  <Button onClick={start} disabled={!romFile} className="gap-2">
                    <Play className="w-4 h-4" />
                    Start
                  </Button>
                ) : isPaused ? (
                  <Button onClick={resume} className="gap-2">
                    <Play className="w-4 h-4" />
                    Resume
                  </Button>
                ) : (
                  <Button onClick={pause} className="gap-2">
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                )}
                <Button onClick={reset} disabled={!isRunning} variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={() => setShowTouchControls(!showTouchControls)}
                  variant="outline"
                  className="ml-auto"
                >
                  {showTouchControls ? 'Hide' : 'Show'} Touch Controls
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Keyboard Bindings</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {Object.entries(DEFAULT_KEY_BINDINGS).map(([key, button]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-mono bg-muted px-2 py-0.5 rounded">{key}</span>
                      <span>{button}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {showTouchControls && <TouchController />}
        </div>

        {/* Save States */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Save States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="save-name">Save Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="save-name"
                    placeholder="Quick Save 1"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateSave();
                    }}
                  />
                  <Button onClick={handleCreateSave} disabled={!isRunning} size="icon">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Saved States</h4>
                {saves.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No save states yet</p>
                ) : (
                  <div className="space-y-2">
                    {saves.map((save) => (
                      <div
                        key={save.id}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{save.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(Number(save.timestamp)).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleLoadSave(save.id)}
                            size="sm"
                            variant="ghost"
                          >
                            Load
                          </Button>
                          <Button
                            onClick={() => handleDeleteSave(save.id)}
                            size="sm"
                            variant="ghost"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
