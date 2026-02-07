import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Null = null;
export type GameId = string;
export interface EntryMetadata {
    id: string;
    title: string;
    description: string;
    timestamp: bigint;
}
export interface GameSaveState {
    metadata: EntryMetadata;
    binaryData: Uint8Array;
}
export type SaveStateId = string;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEntry(gameId: GameId, saveId: SaveStateId, metadata: EntryMetadata, binaryData: Uint8Array): Promise<Null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteSaveForGame(gameId: GameId, saveId: SaveStateId): Promise<Null>;
    getAllEntriesByTimestamp(): Promise<Array<EntryMetadata>>;
    getAllSavesForGame(gameId: GameId): Promise<Array<EntryMetadata>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLatestSaveForGame(gameId: GameId): Promise<GameSaveState | null>;
    getSaveForGame(gameId: GameId, saveId: SaveStateId): Promise<GameSaveState | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
