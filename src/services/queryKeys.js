//controle de cache

export const queryKeys = {
  inventory: ["inventory"],
  currentUser: ["current-user"],
  profile: ["profile"],
  discardHistory: ["discard-history"],
  pendingDiscards: ["pending-discards"],
  pointsStatement: ["points-statement"],
  raffles: ["raffles"],
  raffleDetails: (raffleId) => ["raffle-details", raffleId],
  myRaffleTickets: ["my-raffle-tickets"],
  vouchers: ["vouchers"],
  myVoucherRedemptions: ["my-voucher-redemptions"],
  campaigns: ["campaigns"],
  campaignSubscriptions: ["campaign-subscriptions"],
  collectionPointDashboard: ["collection-point-dashboard"],
  collectionPointRequestStatus: ["collection-point-request-status"],
  collectionPoints: (filters = {}) => ["collection-points", filters],
  pendingCollectionPoints: ["pending-collection-points"],
};
