import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { EntryMetadata, GameSaveState, GameId, SaveStateId } from '../backend';

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<EntryMetadata[]>({
    queryKey: ['entries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntriesByTimestamp();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSavesForGame(gameId: GameId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<EntryMetadata[]>({
    queryKey: ['saves', gameId],
    queryFn: async () => {
      if (!actor || !gameId) return [];
      try {
        return await actor.getAllSavesForGame(gameId);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

export function useGetSaveForGame() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ gameId, saveId }: { gameId: GameId; saveId: SaveStateId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSaveForGame(gameId, saveId);
    },
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gameId,
      saveId,
      metadata,
      binaryData,
    }: {
      gameId: GameId;
      saveId: SaveStateId;
      metadata: EntryMetadata;
      binaryData: Uint8Array;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEntry(gameId, saveId, metadata, binaryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['saves'] });
    },
  });
}

export function useDeleteSaveForGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameId, saveId }: { gameId: GameId; saveId: SaveStateId }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSaveForGame(gameId, saveId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saves'] });
    },
  });
}
