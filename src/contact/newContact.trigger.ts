import {Bundle, ZObject} from 'zapier-platform-core'
import {ContactType, fetchContacts, fetchContactsTrigger, organisationProperty} from './common'
import ContactResource from './contact.resource'
import {ZapierItem} from '../types'
import {dropdownActionDetails} from '../utils/operations'
import {contactTriggers} from './keys'

const listContactsWithoutFilters = (actionName: string, type?: ContactType) => {
  return async (z: ZObject, bundle: Bundle) =>
    await fetchContacts(
      dropdownActionDetails(actionName),
    )(z, bundle, organisationProperty(type))
}

/**
 * Triggers used for informing user about created contacts.
 * Triggers use v2/contacts endpoint with sort applied on created_at in descending order
 *
 * Only 'NewContactTrigger' is visible to users, because rest is used internally to list
 * people/companies in dynamic dropdowns.
 */
export const NewContactTrigger: ZapierItem = {
  key: contactTriggers.newContactTrigger,
  noun: 'Contact',

  display: {
    label: 'New Contact',
    description: 'Triggers when a new contact is created.',
  },

  operation: {
    resource: ContactResource.key,
    inputFields: [
      {
        key: 'is_organization',
        label: 'Is Company?',
        required: false,
        type: 'boolean'
      }
    ],
    perform: fetchContactsTrigger(contactTriggers.newContactTrigger, 'created_at', ['is_organization'])
  }
}

/**
 * Use those only in dropdowns, don't expose to users as triggers
 */
export const ListContactDropdown: ZapierItem = {
  key: contactTriggers.contactListDropdown,
  noun: 'Contact',

  display: {
    label: 'New Contact',
    description: 'Triggers when a new contact is created.',
    hidden: true
  },

  operation: {
    resource: ContactResource.key,
    perform: listContactsWithoutFilters(contactTriggers.contactListDropdown)
  }
}

export const ListPersonsDropdown: ZapierItem = {
  key: contactTriggers.personListDropdown,
  noun: 'Person',

  display: {
    label: 'New Contact',
    description: 'Triggers when a new contact is created.',
    hidden: true
  },

  operation: {
    resource: ContactResource.key,
    perform: listContactsWithoutFilters(contactTriggers.personListDropdown, ContactType.Person)
  }
}

export const ListCompaniesDropdown: ZapierItem = {
  key: contactTriggers.companyListDropdown,
  noun: 'Company',

  display: {
    label: 'New Contact',
    description: 'Triggers when a new contact is created.',
    hidden: true
  },

  operation: {
    resource: ContactResource.key,
    perform: listContactsWithoutFilters(contactTriggers.companyListDropdown, ContactType.Company)
  }
}
