import {customFieldsFactory} from '../../common/customFields/customFields'
import {EntityType} from '../../utils/api'
import {leadSearches, leadStatusTriggers, leadTriggers} from '../keys'
import {userSearches, userTriggers} from '../../users/keys'
import {industryTriggers} from '../../common/industry/keys'
import {sourceSearches, sourceTriggers} from '../../common/source/keys'
import {tagsTriggers} from '../../common/tag/keys'
import {InputField} from '../../types'

const tagsHelpText = (isNew: boolean) =>
  isNew ?
    'Specify the name of a tag which will be assigned to the lead.' :
    'Specify the name of a tag which will be assigned to the lead. Existing tags are kept.'

export const leadRegularFields = (isNew: boolean) : InputField[] => [
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
    key: 'organization_name',
    label: 'Company Name',
    required: false,
    type: 'string'
  },
  {
    key: 'email',
    label: 'Email',
    required: false,
    type: 'string'
  },
  {
    key: 'phone',
    label: 'Work Number',
    required: false,
    type: 'string'
  },
  {
    key: 'mobile',
    label: 'Mobile Number',
    required: false,
    type: 'string'
  },
  {
    key: 'title',
    label: 'Title',
    required: false,
    type: 'string'
  },
  {
    key: 'source_id',
    label: 'Source',
    helpText: 'Where this lead is coming from?',
    required: false,
    type: 'integer',
    dynamic: `${sourceTriggers.leadSourceDropdown}.id.name`,
    search: `${sourceSearches.leadSourceSearch}.id`
  },
  {
    key: 'industry',
    label: 'Industry',
    required: false,
    type: 'string',
    dynamic: `${industryTriggers.leadIndustriesDropdown}.name.name`
  },
  {
    key: 'tags',
    label: 'Tags',
    helpText: tagsHelpText(isNew),
    required: false,
    type: 'string',
    list: true,
    dynamic: `${tagsTriggers.leadTagDropdown}.name`
  },
  {
    key: 'address.line1',
    label: 'Street',
    required: false,
    type: 'string'
  },
  {
    key: 'address.city',
    label: 'City',
    required: false,
    type: 'string'
  },
  {
    key: 'address.postal_code',
    label: 'Zip/Post Code',
    required: false,
    type: 'string'
  },
  {
    key: 'address.state',
    label: 'State or Region',
    required: false,
    type: 'string'
  },
  {
    key: 'address.country',
    label: 'Country',
    required: false,
    type: 'string'
  },
  {
    key: 'status',
    label: 'Status',
    helpText: 'Name of the status of the new lead.',
    required: false,
    type: 'string',
    dynamic: `${leadStatusTriggers.leadStatusDropdown}.name.name`
  },
  {
    key: 'owner_id',
    label: 'Owner',
    helpText: 'Zendesk Sell User that the lead should be assigned to.',
    required: false,
    type: 'integer',
    dynamic: `${userTriggers.userListDropdown}.id.name`,
    search: `${userSearches.userSearch}.id`
  },
  {
    key: 'website',
    label: 'Website',
    required: false,
    type: 'string'
  },
  {
    key: 'skype',
    label: 'Skype',
    required: false,
    type: 'string'
  },
  {
    key: 'facebook',
    label: 'Facebook',
    required: false,
    type: 'string'
  },
  {
    key: 'twitter',
    label: 'Twitter',
    required: false,
    type: 'string'
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    required: false,
    type: 'string'
  },
  {
    key: 'fax',
    label: 'Fax',
    required: false,
    type: 'string'
  },
  {
    key: 'description',
    label: 'Description',
    required: false,
    type: 'string'
  }
]

export const leadFields = (isNew: boolean) => [
  ...leadRegularFields(isNew),
  customFieldsFactory(EntityType.Lead)
]

export const leadIdFieldFactory = (required: boolean) => ({
  key: 'id',
  label: 'Lead',
  required,
  type: 'integer',
  dynamic: `${leadTriggers.leadListDropdown}.id.name`,
  search: `${leadSearches.leadSearchOrCreate}.id`,
})
