import {
  addressOutputFields,
  creatorOwnerOutputFields,
  personalOutputFields,
  tagsOutputFields
} from '../../common/outputFields'
import {customFieldOutputFields} from '../../common/customFields/customFields'
import {EntityType} from '../../utils/api'

export const commonContactOutputFields = [
  ...creatorOwnerOutputFields,
  {
    key: 'name',
    label: 'Name',
    type: 'string',
  },
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
    key: 'contact_id',
    label: 'Organisation',
    type: 'integer',
  },
  {
    key: 'parent_organization_id',
    label: 'Parent Company',
    type: 'integer',
  },
  ...personalOutputFields,
  ...addressOutputFields,
  ...tagsOutputFields,
  customFieldOutputFields(EntityType.Contact)
]
