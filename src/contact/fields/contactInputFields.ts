import {customFieldsFactory} from '../../common/customFields/customFields'
import {EntityType} from '../../utils/api'
import {additionalInputFields, addressInputFields} from '../../common/inputFields'
import {contactSearches, contactTriggers} from '../keys'
import {userSearches, userTriggers} from '../../users/keys'
import {industryTriggers} from '../../common/industry/keys'
import {tagsTriggers} from '../../common/tag/keys'

const personTagsHelpText = (isNew: boolean) =>
  isNew ?
    'Specify the name of a tag which will be assigned to the person.' :
    'Specify the name of a tag which will be assigned to the person. Existing tags are kept.'

const companyTagsHelpText = (isNew: boolean) =>
  isNew ?
    'Specify the name of a tag which will be assigned to the company.' :
    'Specify the name of a tag which will be assigned to the company. Existing tags are kept.'

const commonContactFields = (tagsHelpText: string) => [
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
    key: 'industry',
    label: 'Industry',
    required: false,
    type: 'string',
    dynamic: `${industryTriggers.contactIndustriesDropdown}.name.name`
  },
  {
    key: 'tags',
    label: 'Tags',
    helpText: tagsHelpText,
    required: false,
    type: 'string',
    list: true,
    dynamic: `${tagsTriggers.contactTagDropdown}.name`
  },
  ...addressInputFields,
  {
    key: 'owner_id',
    label: 'Owner',
    helpText: 'Zendesk Sell User that the contact should be assigned to.',
    required: false,
    type: 'integer',
    dynamic: `${userTriggers.userListDropdown}.id.name`,
    search: `${userSearches.userSearch}.id`
  },
  ...additionalInputFields
]

export const companyIdFields = (required: boolean) => [{
  key: 'id',
  label: 'Company',
  required,
  type: 'integer',
  dynamic: `${contactTriggers.companyListDropdown}.id.name`,
  search: `${contactSearches.companySearchOrCreate}.id`,
}]

export const companyFields = (isNew: boolean) => [
  {
    key: 'name',
    label: 'Name',
    required: isNew,
    type: 'string'
  },
  {
    key: 'parent_organization_id',
    label: 'Parent Company',
    required: false,
    type: 'integer',
    dynamic: `${contactTriggers.companyListDropdown}.id.name`,
    search: `${contactSearches.companySearchOrCreate}.id`
  },
  ...commonContactFields(companyTagsHelpText(isNew)),
  customFieldsFactory(EntityType.Company)
]

export const personIdFields = (required: boolean) => [{
  key: 'id',
  label: 'Person',
  required,
  type: 'integer',
  dynamic: `${contactTriggers.personListDropdown}.id.name`,
  search: `${contactSearches.personSearchOrCreate}.id`,
}]

export const personFields = (isNew: boolean) => [
  {
    key: 'first_name',
    label: 'First Name',
    helpText: 'First name of the person.',
    required: false,
    type: 'string'
  },
  {
    key: 'last_name',
    label: 'Last Name',
    helpText: 'Last name of the person.',
    required: isNew,
    type: 'string'
  },
  {
    key: 'title',
    label: 'Title',
    required: false,
    type: 'string'
  },
  {
    key: 'contact_id',
    label: 'Company',
    required: false,
    type: 'integer',
    dynamic: `${contactTriggers.companyListDropdown}.id.name`,
    search: `${contactSearches.companySearchOrCreate}.id`
  },
  ...commonContactFields(personTagsHelpText(isNew)),
  customFieldsFactory(EntityType.Person)
]
