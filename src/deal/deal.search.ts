import {Bundle, ZObject} from 'zapier-platform-core'
import {dealsEndpoint, searchDealsByCriteria} from './common'
import DealResource from './deal.resource'
import {ZapierItem} from '../types'
import {searchActionDetails} from '../utils/operations'
import {dealSearches} from './keys'
import {searchPrefixedField} from '../utils/fieldsHelpers'
import {searchByCriteria} from '../common/queries'

const searchSupportedFilters = ['name']

const searchDeals = (actionName: string) => {
  return async (z: ZObject, bundle: Bundle) =>
    await searchDealsByCriteria(searchActionDetails(actionName), searchSupportedFilters)(z, bundle)
}

export const DealSearch: ZapierItem = {
  key: dealSearches.dealSearchOrCreate,
  noun: 'Deal',
  display: {
    label: 'Find Deal',
    description: 'Finds a deal by Deal ID or name.',
    important: true
  },
  operation: {
    resource: DealResource.key,
    inputFields: [
      {
        key: searchPrefixedField('id'),
        label: 'Deal ID',
        required: false,
        type: 'integer'
      },
      {
        key: searchPrefixedField('name'),
        label: 'Deal Name',
        required: false,
        type: 'string'
      }
    ],
    perform: searchDeals(dealSearches.dealSearchOrCreate)
  }
}

// Deprecated and hidden legacy layer which doesn't support searchOrCreate functionality
export const DeprecatedDealSearch: ZapierItem = {
  key: 'deal_search',
  noun: 'Deal',
  display: {
    label: 'Find Deal (legacy)',
    description: 'Finds a deal by Deal ID or name.',
    hidden: true,
  },
  operation: {
    resource: DealResource.key,
    inputFields: [
      {
        key: 'id',
        label: 'Deal ID',
        required: false,
        type: 'integer'
      },
      {
        key: 'name',
        label: 'Deal Name',
        required: false,
        type: 'string'
      }
    ],
    perform: async (z: ZObject, bundle: Bundle) => {
      return await searchByCriteria(
        dealsEndpoint,
        searchActionDetails('deal_search'),
        searchSupportedFilters
      )(z, bundle)
    }
  }
}

