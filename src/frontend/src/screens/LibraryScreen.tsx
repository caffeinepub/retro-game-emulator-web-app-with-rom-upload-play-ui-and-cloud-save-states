import { useState } from 'react';
import { useGetLibraryGames, useRemoveGameFromLibrary } from '../storage/romLibrary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface LibraryScreenProps {
  onLaunchGame: (gameId: string) => void;
}

export default function LibraryScreen({ onLaunchGame }: LibraryScreenProps) {
  const { data: games = [] } = useGetLibraryGames();
  const removeGame = useRemoveGameFromLibrary();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (gameId: string) => {
    setRemovingId(gameId);
    try {
      await removeGame.mutateAsync(gameId);
      toast.success('Game removed from library');
    } catch (error) {
      toast.error('Failed to remove game');
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Background */}
      <div
        className="relative rounded-lg overflow-hidden bg-card border border-border"
        style={{
          backgroundImage: 'url(/assets/generated/crt-background.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="relative px-8 py-12">
          <h2 className="text-3xl font-bold mb-2">Your Game Library</h2>
          <p className="text-muted-foreground mb-6">
            Load ROMs from your device and start playing classic games
          </p>
          <Button onClick={() => onLaunchGame('')} size="lg" className="gap-2">
            <Upload className="w-4 h-4" />
            Load New ROM
          </Button>
        </div>
      </div>

      {/* Games Grid */}
      {games.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No games in your library yet</p>
            <Button onClick={() => onLaunchGame('')} variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Load Your First ROM
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Card key={game.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">{game.title}</CardTitle>
                <CardDescription className="text-xs">
                  Last played: {formatDate(Number(game.timestamp))}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  onClick={() => onLaunchGame(game.id)}
                  className="flex-1 gap-2"
                  size="sm"
                >
                  <Play className="w-4 h-4" />
                  Play
                </Button>
                <Button
                  onClick={() => handleRemove(game.id)}
                  variant="outline"
                  size="sm"
                  disabled={removingId === game.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
