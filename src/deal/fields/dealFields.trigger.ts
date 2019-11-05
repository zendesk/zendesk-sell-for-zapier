import {ZapierItem} from '../../types'
import {dealTriggers} from '../keys'
import {EntityType} from '../../utils/api'
import {extractFields} from '../../common/fields/fieldsFetcher'

/**
 * This trigger is responsible for populating dropdown with fields available for Deal
 * in other trigger like DealUpdateTrigger
 *
 * Used only internally in Dropdowns, don't expose this as trigger to users
 */
export const DealFieldsDropdown: ZapierItem = {
  key: dealTriggers.dealFieldsDropdown,
  noun: 'Deal',

  display: {
    label: 'Deal Fields',
    description: 'Deal Fields',
    hidden: true
  },

  operation: {
    perform: extractFields(EntityType.Deal)
  }
}
