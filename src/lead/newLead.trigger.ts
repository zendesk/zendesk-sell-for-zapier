import {Bundle, ZObject} from 'zapier-platform-core'
import {createLeadName, fetchLeads, fetchLeadsTrigger} from './common'
import LeadResource from './lead.resource'
import {ZapierItem} from '../types'
import {dropdownActionDetails} from '../utils/operations'
import {leadTriggers} from './keys'

const leadWithExtractedName = (lead: any) => ({
  ...lead,
  name: createLeadName(lead)
})

const listLeadsWithoutFilters = async (z: ZObject, bundle: Bundle) => {
  const leads = await fetchLeads(dropdownActionDetails(leadTriggers.leadListDropdown))(z, bundle)
  return leads.map(lead => leadWithExtractedName(lead))
}

export const NewLeadTrigger: ZapierItem = {
  key: leadTriggers.newLeadTrigger,
  noun: 'Lead',
  display: {
    label: 'New Lead',
    description: 'Triggers when a new lead is created.',
    important: true
  },
  operation: {
    resource: LeadResource.key,
    perform: fetchLeadsTrigger(leadTriggers.newLeadTrigger, 'created_at', [])
  }
}

/**
 * Used only internally in DropDowns, don't expose this as trigger to users
 */
export const ListLeadsDropdown: ZapierItem = {
  key: leadTriggers.leadListDropdown,
  noun: 'Lead',
  display: {
    label: 'New Lead',
    description: 'Triggers when a new lead is created.',
    hidden: true
  },
  operation: {
    resource: LeadResource.key,
    perform: listLeadsWithoutFilters
  }
}
