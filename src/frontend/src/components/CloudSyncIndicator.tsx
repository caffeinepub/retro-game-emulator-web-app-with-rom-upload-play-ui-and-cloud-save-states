import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Cloud, CloudOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function CloudSyncIndicator() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-sm">
            {isAuthenticated ? (
              <>
                <Cloud className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground hidden sm:inline">Cloud Sync</span>
              </>
            ) : (
              <>
                <CloudOff className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground hidden sm:inline">Local Only</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isAuthenticated
            ? 'Save states are synced to the cloud'
            : 'Save states are stored locally only. Login to enable cloud sync.'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
