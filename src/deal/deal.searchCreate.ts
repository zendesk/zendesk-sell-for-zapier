import {dealActions, dealSearches} from './keys'

export const DealSearchOrCreate = {
  key: dealSearches.dealSearchOrCreate,
  display: {
    label: 'Find or Create Deal',
    description: 'Finds a deal by Deal ID or name. Optionally, create one if none are found.',
  },
  search: dealSearches.dealSearchOrCreate,
  create: dealActions.createDealAction
}
