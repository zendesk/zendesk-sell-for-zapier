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
  },
  {
    key: 'first_name',
    label: 'First Name',
  },
  {
    key: 'last_name',
    label: 'Last Name',
  },
  {
    key: 'contact_id',
    label: 'Organisation'
  },
  {
    key: 'parent_organization_id',
    label: 'Parent Company'
  },
  ...personalOutputFields,
  ...addressOutputFields,
  ...tagsOutputFields,
  customFieldOutputFields(EntityType.Contact)
]
