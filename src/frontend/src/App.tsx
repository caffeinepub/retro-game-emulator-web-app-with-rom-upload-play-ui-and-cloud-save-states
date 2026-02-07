import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/Layout/AppShell';
import LibraryScreen from './screens/LibraryScreen';
import PlayScreen from './screens/PlayScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';

export type Screen = 'library' | 'play' | 'settings' | 'help';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('library');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const handleLaunchGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentScreen('play');
  };

  const handleBackToLibrary = () => {
    setCurrentScreen('library');
    setSelectedGameId(null);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppShell currentScreen={currentScreen} onNavigate={setCurrentScreen}>
        {currentScreen === 'library' && <LibraryScreen onLaunchGame={handleLaunchGame} />}
        {currentScreen === 'play' && (
          <PlayScreen gameId={selectedGameId} onBackToLibrary={handleBackToLibrary} />
        )}
        {currentScreen === 'settings' && <SettingsScreen />}
        {currentScreen === 'help' && <HelpScreen />}
      </AppShell>
      <ProfileSetupDialog />
      <Toaster />
    </ThemeProvider>
  );
}
