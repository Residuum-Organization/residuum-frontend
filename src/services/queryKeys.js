//controle de cache

export const queryKeys = {
  inventory: ["inventory"],
  currentUser: ["current-user"],
  discardHistory: ["discard-history"],
  pointsStatement: ["points-statement"],
  collectionPoints: (filters = {}) => ["collection-points", filters],
};
