import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '../storage/settings';

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">Configure your emulator preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audio</CardTitle>
          <CardDescription>Control sound output</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="audio-enabled">Enable Audio</Label>
            <Switch
              id="audio-enabled"
              checked={settings.audioEnabled}
              onCheckedChange={(checked) => updateSettings({ audioEnabled: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="volume">Volume: {settings.volume}%</Label>
            <Slider
              id="volume"
              min={0}
              max={100}
              step={5}
              value={[settings.volume]}
              onValueChange={([value]) => updateSettings({ volume: value })}
              disabled={!settings.audioEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video</CardTitle>
          <CardDescription>Display and scaling options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scaling-mode">Scaling Mode</Label>
            <Select
              value={settings.scalingMode}
              onValueChange={(value: 'fit' | 'integer' | 'nearest') =>
                updateSettings({ scalingMode: value })
              }
            >
              <SelectTrigger id="scaling-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fit">Fit to Screen</SelectItem>
                <SelectItem value="integer">Integer Scaling</SelectItem>
                <SelectItem value="nearest">Nearest Neighbor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>Customize button mappings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Control remapping coming soon. Use default keyboard bindings for now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
