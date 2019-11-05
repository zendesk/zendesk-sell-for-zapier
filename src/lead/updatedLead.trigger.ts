import {Bundle, ZObject} from 'zapier-platform-core'
import {fetchLeadsTrigger} from './common'
import {ZapierItem} from '../types'
import {findAndRemapOnlyUpdatedItems} from '../utils/deduplication'
import {deduplicationOutputFields} from '../common/outputFields'
import {commonLeadOutputFields} from './fields/leadOutputFields'
import {leadTriggers} from './keys'
import {leadSample} from './lead.resource'

const listLeadsUpdatedAt = async (z: ZObject, bundle: Bundle) => {
  const leads = await fetchLeadsTrigger(
    leadTriggers.updatedLeadTrigger,
    'updated_at',
    []
  )(z, bundle)
  return findAndRemapOnlyUpdatedItems(leads, bundle.inputData.trigger_field)
}

const UpdatedLeadTrigger: ZapierItem = {
  key: leadTriggers.updatedLeadTrigger,
  noun: 'Lead',
  display: {
    label: 'Updated Lead',
    description: 'Triggers when an existing lead is updated.',
  },
  operation: {
    // Resource cannot be used here, because of different output fields (deduplication)
    sample: leadSample,
    inputFields: [
      {
        key: 'trigger_field',
        label: 'Field to monitor the updates',
        helpText: 'Trigger will work only when selected field gets updated. Leave empty to trigger on any change.',
        required: false,
        type: 'string',
        dynamic: `${leadTriggers.leadFieldsDropdown}.id.name`
      }
    ],
    outputFields: [
      ...deduplicationOutputFields,
      ...commonLeadOutputFields
    ],
    perform: listLeadsUpdatedAt
  }
}

export default UpdatedLeadTrigger
