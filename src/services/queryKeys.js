//controle de cache

export const queryKeys = {
  inventory: ["inventory"],
  currentUser: ["current-user"],
  discardHistory: ["discard-history"],
  collectionPoints: (filters = {}) => ["collection-points", filters],
};
