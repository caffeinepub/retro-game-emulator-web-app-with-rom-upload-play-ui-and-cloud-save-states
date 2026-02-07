import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { DEFAULT_KEY_BINDINGS } from '../emulator/inputMappings';

export default function HelpScreen() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Help & About</h2>
        <p className="text-muted-foreground">Learn how to use RetroPlay</p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>ROM Ownership Disclaimer</AlertTitle>
        <AlertDescription>
          You must legally own the games you load into this emulator. RetroPlay does not provide,
          host, or distribute ROM files. Downloading or using ROM files you do not own is illegal
          in most jurisdictions. Use this emulator only with games you have legally purchased or
          own the rights to use.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Loading ROMs</CardTitle>
          <CardDescription>How to play your games</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">From the Library</h4>
            <p className="text-sm text-muted-foreground">
              Click "Load New ROM" to select a ROM file from your device. The ROM will be stored
              locally in your browser and added to your library for quick access.
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">From the Play Screen</h4>
            <p className="text-sm text-muted-foreground">
              If no ROM is loaded, you can select one directly from the play screen. Once loaded,
              use the Start button to begin playing.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>Keyboard and touch input</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Keyboard Bindings</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(DEFAULT_KEY_BINDINGS).map(([key, button]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="font-mono font-medium">{key}</span>
                  <span className="text-muted-foreground">{button}</span>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Touch Controls</h4>
            <p className="text-sm text-muted-foreground">
              On mobile devices or tablets, you can enable on-screen touch controls from the play
              screen. Toggle them on/off using the "Show Touch Controls" button.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Save States</CardTitle>
          <CardDescription>Local vs Cloud Sync</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Local Mode (Not Signed In)</h4>
            <p className="text-sm text-muted-foreground">
              When you're not signed in, save states are stored locally in your browser. They will
              persist across sessions but are tied to this specific browser and device.
            </p>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Cloud Sync (Signed In)</h4>
            <p className="text-sm text-muted-foreground">
              When signed in with Internet Identity, your save states are automatically synced to
              the cloud. Access them from any device by signing in with the same identity.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About RetroPlay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            RetroPlay is a browser-based retro game emulator that lets you play classic games
            directly in your web browser. All emulation happens locally on your device.
          </p>
          <p>
            This application is built on the Internet Computer using Internet Identity for secure,
            decentralized authentication and cloud storage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
