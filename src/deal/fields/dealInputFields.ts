import {customFieldsFactory} from '../../common/customFields/customFields'
import {EntityType} from '../../utils/api'
import {dealSearches, dealTriggers, pipelineTriggers, stageSearches, stageTriggers} from '../keys'
import {contactSearches, contactTriggers} from '../../contact/keys'
import {userSearches, userTriggers} from '../../users/keys'
import {sourceSearches, sourceTriggers} from '../../common/source/keys'
import {tagsTriggers} from '../../common/tag/keys'
import {currencies} from '../../common/currencies'

const tagsHelpText = (isNew: boolean) =>
  isNew ?
    'Specify the name of a tag which will be assigned to the deal.' :
    'Specify the name of a tag which will be assigned to the deal. Existing tags are kept.'

export const dealFields = (isNew: boolean) => [
  {
    key: 'name',
    label: 'Name',
    required: isNew,
    type: 'string'
  },
  {
    key: 'contact_id',
    label: 'Primary Contact',
    helpText: 'Choose a primary contact which will be assigned to the deal.',
    required: isNew,
    type: 'integer',
    dynamic: `${contactTriggers.contactListDropdown}.id.name`,
    search: `${contactSearches.contactSearch}.id`,
  },
  {
    key: 'value',
    label: 'Value',
    helpText: 'Value of the new deal. Should be a number.',
    required: false,
    type: 'number'
  },
  {
    key: 'currency',
    label: 'Currency',
    required: false,
    choices: currencies,
    type: 'string'
  },
  {
    key: 'hot',
    label: 'Hot',
    helpText: 'Mark this deal as a hot deal.',
    required: false,
    type: 'boolean'
  },
  {
    key: 'owner_id',
    label: 'Owner',
    helpText: 'Zendesk Sell User that the deal should be assigned to.',
    required: false,
    type: 'integer',
    dynamic: `${userTriggers.userListDropdown}.id.name`,
    search: `${userSearches.userSearch}.id`
  },
  {
    key: 'pipeline_id',
    label: 'Pipeline',
    required: false,
    type: 'integer',
    dynamic: `${pipelineTriggers.pipelineListDropdown}.id.name`,
    altersDynamicFields: true
  },
  {
    key: 'stage_id',
    label: 'Stage',
    required: false,
    type: 'integer',
    dynamic: `${stageTriggers.stageListDropdown}.id.name`,
    search: `${stageSearches.stageSearch}.id`
  },
  {
    key: 'source_id',
    label: 'Source',
    helpText: 'Where this deal is coming from?',
    required: false,
    type: 'integer',
    dynamic: `${sourceTriggers.dealSourceDropdown}.id.name`,
    search: `${sourceSearches.dealSourceSearch}.id`
  },
  {
    key: 'tags',
    label: 'Tags',
    helpText: tagsHelpText(isNew),
    required: false,
    type: 'string',
    list: true,
    dynamic: `${tagsTriggers.dealTagDropdown}.name`
  },
  customFieldsFactory(EntityType.Deal)
]

export const dealIdFieldFactory = (required: boolean) => ({
  key: 'id',
  label: 'Deal',
  required,
  type: 'integer',
  dynamic: `${dealTriggers.dealListDropdown}.id.name`,
  search: `${dealSearches.dealSearchOrCreate}.id`,
})
