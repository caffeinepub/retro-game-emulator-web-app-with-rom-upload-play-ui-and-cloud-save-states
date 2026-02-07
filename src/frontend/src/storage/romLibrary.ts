import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface GameMetadata {
  id: string;
  title: string;
  timestamp: number;
  romData?: Uint8Array;
}

const DB_NAME = 'RetroPlayDB';
const DB_VERSION = 1;
const STORE_NAME = 'games';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function getAllGames(): Promise<GameMetadata[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getGame(id: string): Promise<GameMetadata | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function saveGame(game: GameMetadata): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(game);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteGame(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function useGetLibraryGames() {
  return useQuery<GameMetadata[]>({
    queryKey: ['libraryGames'],
    queryFn: getAllGames,
  });
}

export function useGetLibraryGame(id: string | null) {
  return useQuery<GameMetadata | null>({
    queryKey: ['libraryGame', id],
    queryFn: () => (id ? getGame(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

export function useSaveGameToLibrary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: saveGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryGames'] });
    },
  });
}

export function useRemoveGameFromLibrary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryGames'] });
    },
  });
}
