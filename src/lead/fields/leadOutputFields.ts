import {
  addressOutputFields,
  creatorOwnerOutputFields,
  personalOutputFields,
  tagsOutputFields
} from '../../common/outputFields'
import {customFieldOutputFields} from '../../common/customFields/customFields'
import {EntityType} from '../../utils/api'

export const commonLeadOutputFields = [
  ...creatorOwnerOutputFields,
  {
    key: 'first_name',
    label: 'First Name',
    type: 'string',
  },
  {
    key: 'last_name',
    label: 'Last Name',
    type: 'string',
  },
  {
    key: 'organization_name',
    label: 'Company Name',
    type: 'string',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'string',
  },
  {
    key: 'source_id',
    label: 'Source',
    type: 'integer',
  },
  ...personalOutputFields,
  ...tagsOutputFields,
  {
    key: 'unqualified_reason_id',
    label: 'Unqualified Reason',
    type: 'string',
  },
  ...addressOutputFields,
  customFieldOutputFields(EntityType.Lead)
]
