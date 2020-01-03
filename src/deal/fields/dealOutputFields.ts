import {tagsOutputFields} from '../../common/outputFields'
import {customFieldOutputFields} from '../../common/customFields/customFields'
import {EntityType} from '../../utils/api'

export const dealCommonOutputFields = [
  {
    key: 'owner_id',
    label: 'Owner',
    type: 'integer',
  },
  {
    key: 'name',
    label: 'Name',
    type: 'string',
  },
  {
    key: 'value',
    label: 'Value',
    type: 'string',
  },
  {
    key: 'currency',
    label: 'Currency',
    type: 'string',
  },
  {
    key: 'hot',
    label: 'Hot',
    type: 'boolean',
  },
  {
    key: 'stage_id',
    label: 'Stage',
    type: 'integer',
  },
  {
    key: 'source_id',
    label: 'Source',
    type: 'integer',
  },
  {
    key: 'loss_reason_id',
    label: 'Loss Reason',
    type: 'integer',
  },
  {
    key: 'dropbox_email',
    label: 'Dropbox Email',
    type: 'string',
  },
  {
    key: 'contact_id',
    label: 'Primary Contact',
    type: 'integer',
  },
  {
    key: 'organization_id',
    label: 'Company',
    type: 'integer',
  },
  ...tagsOutputFields,
  customFieldOutputFields(EntityType.Deal)
]
