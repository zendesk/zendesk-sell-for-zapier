import {Bundle, ZObject} from 'zapier-platform-core'
import {fetchContactsTrigger} from './common'
import {ZapierItem} from '../types'
import {findAndRemapOnlyUpdatedItems} from '../utils/deduplication'
import {deduplicationOutputFields} from '../common/outputFields'
import {commonContactOutputFields} from './fields/contactOutputFields'
import {contactTriggers} from './keys'
import {contactSample} from './contact.resource'

const listContactsByUpdatedAt = async (z: ZObject, bundle: Bundle) => {
  const contacts = await fetchContactsTrigger(
    contactTriggers.updatedContactTrigger,
    'updated_at',
    ['is_organization']
  )(z, bundle)
  return findAndRemapOnlyUpdatedItems(contacts, bundle.inputData.trigger_field)
}

/**
 * Triggers used for informing user about updated contacts.
 * Triggers use v2/contacts endpoint with sort applied on updated_at in descending order
 */
const UpdatedContactTrigger: ZapierItem = {
  key: contactTriggers.updatedContactTrigger,
  noun: 'Contact',

  display: {
    label: 'Updated Contact',
    description: 'Triggers when an existing contact is updated.',
  },

  operation: {
    // Resource cannot be used here, because of different output fields (deduplication)
    sample: contactSample,
    inputFields: [
      {
        key: 'is_organization',
        label: 'Is Company?',
        required: false,
        type: 'boolean',
        altersDynamicFields: true
      },
      {
        key: 'trigger_field',
        label: 'Field to monitor the updates',
        helpText: 'Trigger will work only when selected field gets updated. Leave empty to trigger on any change.',
        required: false,
        type: 'string',
        dynamic: `${contactTriggers.contactFieldsDropdown}.id.name`
      }
    ],
    outputFields: [
      ...deduplicationOutputFields,
      ...commonContactOutputFields
    ],
    perform: listContactsByUpdatedAt
  }
}

export default UpdatedContactTrigger
