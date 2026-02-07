import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useGetAllSavesForGame, useAddEntry, useGetSaveForGame, useDeleteSaveForGame } from './useQueries';
import {
  getLocalSavesForGame,
  saveLocalSaveState,
  getLocalSaveState,
  deleteLocalSaveState,
} from '../storage/saveStates';
import type { EntryMetadata } from '../backend';

interface SaveState {
  id: string;
  title: string;
  timestamp: number;
}

export function useSaveStates(gameId: string | null) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [localSaves, setLocalSaves] = useState<SaveState[]>([]);
  
  const { data: cloudSaves = [] } = useGetAllSavesForGame(isAuthenticated ? gameId : null);
  const addEntry = useAddEntry();
  const getSave = useGetSaveForGame();
  const deleteSave = useDeleteSaveForGame();

  useEffect(() => {
    if (!isAuthenticated && gameId) {
      getLocalSavesForGame(gameId).then((saves) => {
        setLocalSaves(
          saves.map((s) => ({
            id: s.id,
            title: s.title,
            timestamp: s.timestamp,
          }))
        );
      });
    }
  }, [isAuthenticated, gameId]);

  const saves = isAuthenticated
    ? cloudSaves.map((s) => ({
        id: s.id,
        title: s.title,
        timestamp: Number(s.timestamp),
      }))
    : localSaves;

  const createSave = async (title: string, data: Uint8Array) => {
    const id = `save-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();

    if (isAuthenticated && gameId) {
      const metadata: EntryMetadata = {
        id,
        title,
        description: '',
        timestamp: BigInt(timestamp),
      };
      await addEntry.mutateAsync({ gameId, saveId: id, metadata, binaryData: data });
    } else if (gameId) {
      await saveLocalSaveState({
        id,
        gameId,
        title,
        timestamp,
        data,
      });
      setLocalSaves((prev) => [...prev, { id, title, timestamp }]);
    }
  };

  const loadSave = async (saveId: string): Promise<Uint8Array | null> => {
    if (isAuthenticated && gameId) {
      const result = await getSave.mutateAsync({ gameId, saveId });
      return result?.binaryData || null;
    } else {
      const save = await getLocalSaveState(saveId);
      return save?.data || null;
    }
  };

  const deleteSaveState = async (saveId: string) => {
    if (isAuthenticated && gameId) {
      await deleteSave.mutateAsync({ gameId, saveId });
    } else {
      await deleteLocalSaveState(saveId);
      setLocalSaves((prev) => prev.filter((s) => s.id !== saveId));
    }
  };

  return {
    saves,
    createSave,
    loadSave,
    deleteSave: deleteSaveState,
  };
}
