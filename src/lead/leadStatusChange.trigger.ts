import {ZapierItem} from '../types'
import {leadStatusTriggers, leadTriggers} from './keys'
import {leadSample} from './lead.resource'
import {deduplicationOutputFields} from '../common/outputFields'
import {commonLeadOutputFields} from './fields/leadOutputFields'
import {Bundle, ZObject} from 'zapier-platform-core'
import {fetchLeadsTrigger} from './common'
import {remapDeduplication} from '../utils/deduplication'

const statusFieldName = 'status'

const leadLeadsByStatusChange = async (z: ZObject, bundle: Bundle) => {
  const leads = await fetchLeadsTrigger(
    leadTriggers.leadStatusChangeTrigger,
    'updated_at',
    [statusFieldName]
  )(z, bundle)
 return remapDeduplication(leads, statusFieldName)
}

export const LeadStatusChangeTrigger: ZapierItem = {
  key: leadTriggers.leadStatusChangeTrigger,
  noun: 'Lead',

  display: {
    label: 'Lead Enters New Status',
    description: 'Triggers when a lead has change status',
    important: false,
  },
  operation: {
    sample: leadSample,
    inputFields: [
      {
        key: statusFieldName,
        label: 'Status',
        required: false,
        type: 'string',
        dynamic: `${leadStatusTriggers.leadStatusDropdown}.name.name`
      }
    ],
    outputFields: [
      ...deduplicationOutputFields,
      ...commonLeadOutputFields
    ],
    perform: leadLeadsByStatusChange
  }
}
