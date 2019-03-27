import {tagsOutputFields} from '../../common/outputFields'
import {customFieldOutputFields} from '../../common/customFields/customFields'
import {EntityType} from '../../utils/api'

export const dealCommonOutputFields = [
  {
    key: 'owner_id',
    label: 'Owner',
  },
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'value',
    label: 'Value'
  },
  {
    key: 'currency',
    label: 'Currency',
  },
  {
    key: 'hot',
    label: 'Hot',
  },
  {
    key: 'stage_id',
    label: 'Stage',
  },
  {
    key: 'source_id',
    label: 'Source'
  },
  {
    key: 'loss_reason_id',
    label: 'Loss Reason'
  },
  {
    key: 'dropbox_email',
    label: 'Dropbox Email'
  },
  {
    key: 'contact_id',
    label: 'Primary Contact'
  },
  {
    key: 'organization_id',
    label: 'Company'
  },
  ...tagsOutputFields,
  customFieldOutputFields(EntityType.Deal)
]
