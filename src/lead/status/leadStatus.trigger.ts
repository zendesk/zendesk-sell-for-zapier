import {restEndpoints} from '../../utils/http'
import {ZapierItem} from '../../types'
import LeadStatusResource from './leadStatus.resource'
import {Bundle, ZObject} from 'zapier-platform-core'
import {dropdownActionDetails} from '../../utils/operations'
import {leadStatusTriggers} from '../keys'
import {fetchItems} from '../../common/queries'

const leadStatusEndpoint = restEndpoints('lead_statuses')

const fetchLeadStatuses = async (z: ZObject, bundle: Bundle) =>
  await fetchItems(leadStatusEndpoint, dropdownActionDetails(leadStatusTriggers.leadStatusDropdown))(z, bundle)

export const ListLeadStatusDropdown: ZapierItem = {
  key: leadStatusTriggers.leadStatusDropdown,
  noun: 'Lead Status',

  display: {
    label: 'New Lead Status',
    description: 'List lead statuses.',
    hidden: true
  },
  operation: {
    resource: LeadStatusResource.key,
    perform: fetchLeadStatuses
  }
}
