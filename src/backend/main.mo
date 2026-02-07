import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include authentication system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Null = ();
  type GameId = Text;
  type SaveStateId = Text;

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Entry metadata type for each game save
  public type EntryMetadata = {
    id : Text;
    title : Text;
    description : Text;
    timestamp : Int;
  };

  // Object containing metadata and binary save data
  public type GameSaveState = {
    metadata : EntryMetadata;
    binaryData : Blob;
  };

  // Store user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Store entries per user, and saves per user per game
  let userEntries = Map.empty<Principal, List.List<EntryMetadata>>();
  let userSaves = Map.empty<Principal, Map.Map<GameId, Map.Map<SaveStateId, GameSaveState>>>();

  module EntryMetadata {
    public func compareByTimestamp(metadataA : EntryMetadata, metadataB : EntryMetadata) : Order.Order {
      Int.compare(metadataA.timestamp, metadataB.timestamp);
    };
  };

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Add a new save state for a specific user & game
  public shared ({ caller }) func addEntry(gameId : GameId, saveId : SaveStateId, metadata : EntryMetadata, binaryData : Blob) : async Null {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save entries");
    };

    let newSave : GameSaveState = {
      metadata;
      binaryData;
    };

    // Update or create new game saves map for the user
    let userGameSaves = switch (userSaves.get(caller)) {
      case (null) {
        let newGameMap = Map.empty<GameId, Map.Map<SaveStateId, GameSaveState>>();
        newGameMap;
      };
      case (?existingGames) { existingGames };
    };

    // Update or create new save map for the game
    let gameSaves = switch (userGameSaves.get(gameId)) {
      case (null) {
        let newSaveMap = Map.empty<SaveStateId, GameSaveState>();
        newSaveMap;
      };
      case (?existingSaves) { existingSaves };
    };
    gameSaves.add(saveId, newSave);

    // Save back to user game saves map
    userGameSaves.add(gameId, gameSaves);
    userSaves.add(caller, userGameSaves);

    // Update user entries metadata
    let entriesList = switch (userEntries.get(caller)) {
      case (null) { List.empty<EntryMetadata>() };
      case (?existingList) { existingList };
    };
    entriesList.add(metadata);
    userEntries.add(caller, entriesList);
    ();
  };

  // Get all save state entries for current user, sorted by timestamp
  public query ({ caller }) func getAllEntriesByTimestamp() : async [EntryMetadata] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access entries");
    };
    switch (userEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        entries.toArray().sort(EntryMetadata.compareByTimestamp);
      };
    };
  };

  // Get all saves for a specific game
  public query ({ caller }) func getAllSavesForGame(gameId : GameId) : async [EntryMetadata] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saves");
    };
    switch (userSaves.get(caller)) {
      case (null) { Runtime.trap("No saves found for user") };
      case (?gameSaves) {
        switch (gameSaves.get(gameId)) {
          case (null) { Runtime.trap("No saves found for this game") };
          case (?saves) {
            saves.values().map<GameSaveState, EntryMetadata>(func(save) { save.metadata }).toArray();
          };
        };
      };
    };
  };

  // Get specific save state for a game
  public query ({ caller }) func getSaveForGame(gameId : GameId, saveId : SaveStateId) : async ?GameSaveState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saves");
    };
    switch (userSaves.get(caller)) {
      case (null) { null };
      case (?gameSaves) {
        switch (gameSaves.get(gameId)) {
          case (null) { null };
          case (?saves) {
            saves.get(saveId);
          };
        };
      };
    };
  };

  // Delete specific save state for a game
  public shared ({ caller }) func deleteSaveForGame(gameId : GameId, saveId : SaveStateId) : async Null {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete saves");
    };
    switch (userSaves.get(caller)) {
      case (null) {
        Runtime.trap("No saves found for user");
      };
      case (?gameSaves) {
        switch (gameSaves.get(gameId)) {
          case (null) {
            Runtime.trap("No saves found for this game");
          };
          case (?saves) {
            let existedBefore = saves.containsKey(saveId);
            gameSaves.add(gameId, saves);
            if (existedBefore) {
              ();
            } else {
              Runtime.trap("Save not found for deletion");
            };
          };
        };
      };
    };
  };

  // Get latest save state (if any) for a game
  public query ({ caller }) func getLatestSaveForGame(gameId : GameId) : async ?GameSaveState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access saves");
    };
    switch (userSaves.get(caller)) {
      case (null) { null };
      case (?gameSaves) {
        switch (gameSaves.get(gameId)) {
          case (null) { null };
          case (?saves) {
            switch (saves.size()) {
              case (0) { null };
              case (_) {
                let savesArray = saves.toArray();
                if (savesArray.size() > 0) {
                  ?savesArray[savesArray.size() - 1].1;
                } else {
                  null;
                };
              };
            };
          };
        };
      };
    };
  };
};
