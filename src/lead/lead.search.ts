import LeadResource from './lead.resource'
import {Bundle, ZObject} from 'zapier-platform-core'
import {leadsEndpoint, searchLeadsByCriteria} from './common'
import {ZapierItem} from '../types'
import {searchActionDetails} from '../utils/operations'
import {leadSearches} from './keys'
import {searchPrefixedField} from '../utils/fieldsHelpers'
import {searchByCriteria} from '../common/queries'

const searchSupportedFilters = ['first_name', 'last_name', 'organization_name', 'email']

const searchLeads = (actionName: string) =>
  searchLeadsByCriteria(searchActionDetails(actionName), searchSupportedFilters)


export const LeadSearch: ZapierItem = {
  key: leadSearches.leadSearchOrCreate,
  noun: 'Lead',
  display: {
    label: 'Find Lead',
    description: 'Finds a lead by ID, company name, name or email address.',
    important: true
  },
  operation: {
    resource: LeadResource.key,
    inputFields: [
      {
        key: searchPrefixedField('id'),
        label: 'Lead ID',
        required: false,
        type: 'integer'
      },
      {
        key: searchPrefixedField('organization_name'),
        label: 'Company Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('first_name'),
        label: 'First Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('last_name'),
        label: 'Last Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('email'),
        label: 'Email',
        required: false,
        type: 'string'
      }
    ],
    perform: searchLeads(leadSearches.leadSearchOrCreate)
  }
}

// Deprecated and hidden legacy layer which doesn't support searchOrCreate functionality
export const DeprecatedLeadSearch: ZapierItem = {
  key: 'lead_search',
  noun: 'Lead',
  display: {
    label: 'Find Lead (legacy)',
    description: 'Finds a lead by ID, company name, name or email address.',
    hidden: true
  },
  operation: {
    resource: LeadResource.key,
    inputFields: [
      {
        key: 'id',
        label: 'Lead ID',
        required: false,
        type: 'integer'
      },
      {
        key: 'organization_name',
        label: 'Company Name',
        required: false,
        type: 'string'
      },
      {
        key: 'first_name',
        label: 'First Name',
        required: false,
        type: 'string'
      },
      {
        key: 'last_name',
        label: 'Last Name',
        required: false,
        type: 'string'
      },
      {
        key: 'email',
        label: 'Email',
        required: false,
        type: 'string'
      }
    ],
    perform: async (z: ZObject, bundle: Bundle) => {
      return await searchByCriteria(
        leadsEndpoint,
        searchActionDetails('lead_search'),
        searchSupportedFilters
      )(z, bundle)
    }
  }
}
