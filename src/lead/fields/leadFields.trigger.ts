import {ZapierItem} from '../../types'
import {leadTriggers} from '../keys'
import {EntityType} from '../../utils/api'
import {extractFields} from '../../common/fields/fieldsFetcher'

/**
 * This trigger is responsible for populating dropdown with fields available for Leads
 * in other trigger like UpdatedLeadTrigger
 *
 * Used only internally in Dropdowns, don't expose this as trigger to users
 */
export const LeadFieldsDropdown: ZapierItem = {
  key: leadTriggers.leadFieldsDropdown,
  noun: 'Lead',

  display: {
    label: 'Lead Fields',
    description: 'Lead Fields',
    hidden: true
  },

  operation: {
    perform: extractFields(EntityType.Lead)
  }
}
