import {Bundle, ZObject} from 'zapier-platform-core'
import {contactsEndpoint, ContactType, organisationProperty, searchContactsByCriteria} from './common'
import ContactResource from './contact.resource'
import {ZapierItem} from '../types'
import {createActionDetails, searchActionDetails} from '../utils/operations'
import {contactSearches} from './keys'
import {searchPrefixedField} from '../utils/fieldsHelpers'
import {searchByCriteria} from '../common/queries'

const searchSupportedFilters = ['name', 'email', 'first_name', 'last_name', 'is_organization']

const searchContacts = (actionName: string, type?: ContactType) => {
  return async (z: ZObject, bundle: Bundle) =>
    await searchContactsByCriteria(
      searchActionDetails(actionName),
      searchSupportedFilters
    )(z, bundle, organisationProperty(type))
}

export const ContactSearch: ZapierItem = {
  key: contactSearches.contactSearch,
  noun: 'Contact',
  display: {
    label: 'Find Contact',
    description: 'Finds a contact by Contact ID, name or email address.',
    important: true
  },
  operation: {
    resource: ContactResource.key,
    inputFields: [
      {
        key: searchPrefixedField('id'),
        label: 'Contact ID',
        required: false,
        type: 'integer'
      },
      {
        key: searchPrefixedField('name'),
        label: 'Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('first_name'),
        label: 'First Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('last_name'),
        label: 'Last Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('email'),
        label: 'Email',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('is_organization'),
        label: 'Is Company?',
        required: false,
        type: 'boolean'
      }
    ],
    perform: searchContacts(contactSearches.contactSearch),
  },
}

export const ContactPersonSearch: ZapierItem = {
  key: contactSearches.personSearchOrCreate,
  noun: 'Person',
  display: {
    label: 'Find Person',
    description: 'Finds a person by Person ID, name or email address.',
  },
  operation: {
    resource: ContactResource.key,
    inputFields: [
      {
        key: searchPrefixedField('id'),
        label: 'Person ID',
        required: false,
        type: 'integer'
      },
      {
        key: searchPrefixedField('first_name'),
        label: 'First Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('last_name'),
        label: 'Last Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('email'),
        label: 'Email',
        required: false,
        type: 'string'
      }
    ],
    perform: searchContacts(contactSearches.personSearchOrCreate, ContactType.Person),
  },
}

export const ContactCompanySearch: ZapierItem = {
  key: contactSearches.companySearchOrCreate,
  noun: 'Company',
  display: {
    label: 'Find Company',
    description: 'Finds a company by Company ID, name or email address.',
  },
  operation: {
    resource: ContactResource.key,
    inputFields: [
      {
        key: searchPrefixedField('id'),
        label: 'Company ID',
        required: false,
        type: 'integer'
      },
      {
        key: searchPrefixedField('name'),
        label: 'Company Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('email'),
        label: 'Email',
        required: false,
        type: 'string'
      }
    ],
    perform: searchContacts(contactSearches.companySearchOrCreate, ContactType.Company),
  },
}

// Deprecated and hidden legacy layer which doesn't support searchOrCreate functionality
export const DeprecatedContactSearch: ZapierItem = {
  key: 'contact_contact_search',
  noun: 'Contact',
  display: {
    label: 'Find Contact (legacy)',
    description: 'Finds a contact by Contact ID, name or email address.',
    hidden: true
  },
  operation: {
    resource: ContactResource.key,
    inputFields: [
      {
        key: 'id',
        label: 'Contact ID',
        required: false,
        type: 'integer'
      },
      {
        key: 'name',
        label: 'Name',
        required: false,
        type: 'string'
      },
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
        key: 'email',
        label: 'Email',
        required: false,
        type: 'string'
      },
      {
        key: 'is_organization',
        label: 'Is Company?',
        required: false,
        type: 'boolean'
      }
    ],
    perform: async (z: ZObject, bundle: Bundle) => {
      return await searchByCriteria(
        contactsEndpoint,
        createActionDetails('contact_contact_search'),
        searchSupportedFilters
      )(z, bundle)
    }
  },
}

