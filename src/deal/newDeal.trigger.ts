import {Bundle, ZObject} from 'zapier-platform-core'
import {fetchDeals, fetchDealsTrigger} from './common'
import DealResource from './deal.resource'
import {ZapierItem} from '../types'
import {dropdownActionDetails} from '../utils/operations'
import {dealTriggers} from './keys'

export const NewDealTrigger: ZapierItem = {
  key: dealTriggers.newDealTrigger,
  noun: 'Deal',
  display: {
    label: 'New Deal',
    description: 'Triggers when a new deal is created.',
    important: true
  },
  operation: {
    resource: DealResource.key,
    perform: fetchDealsTrigger(dealTriggers.newDealTrigger, 'created_at', [])
  }
}

/**
 * Use those only in dropdowns, don't expose to users as triggers
 */
const listDealsWithoutFilters = async (z: ZObject, bundle: Bundle) =>
  await fetchDeals(dropdownActionDetails(dealTriggers.dealListDropdown))(z, bundle)


export const ListDealsDropdown: ZapierItem = {
  key: dealTriggers.dealListDropdown,
  noun: 'Deal',
  display: {
    label: 'New Deal',
    description: 'Triggers when a new deal is created.',
    hidden: true
  },
  operation: {
    resource: DealResource.key,
    perform: listDealsWithoutFilters
  }
}

