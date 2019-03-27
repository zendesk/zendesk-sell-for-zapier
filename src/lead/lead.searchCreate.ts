import {leadActions, leadSearches} from './keys'

export const LeadSearchOrCreate = {
  key: leadSearches.leadSearchOrCreate,
  display: {
    label: 'Find or Create Lead',
    description: 'Finds a lead by ID, company name, name or email address. Optionally, create one if none are found.',
  },
  search: leadSearches.leadSearchOrCreate,
  create: leadActions.createLeadAction
}
