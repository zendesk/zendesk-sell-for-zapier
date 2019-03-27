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
  },
  {
    key: 'last_name',
    label: 'Last Name',
  },
  {
    key: 'organization_name',
    label: 'Company Name',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'source_id',
    label: 'Source',
  },
  ...personalOutputFields,
  ...tagsOutputFields,
  {
    key: 'unqualified_reason_id',
    label: 'Unqualified Reason'
  },
  ...addressOutputFields,
  customFieldOutputFields(EntityType.Lead)
]
