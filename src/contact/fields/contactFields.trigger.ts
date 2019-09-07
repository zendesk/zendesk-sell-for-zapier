/**
 * This trigger is responsible for populating dropdown with fields available for Contacts
 * in other trigger like UpdatedContactTrigger
 *
 * Used only internally in Dropdowns, don't expose this as trigger to users
 */
import {ZapierItem} from '../../types'
import {contactTriggers} from '../keys'
import {extractFields} from '../../common/fields/fieldsFetcher'
import {EntityType} from '../../utils/api'

export const PersonFieldsDropdown: ZapierItem = {
  key: contactTriggers.personFieldsDropdown,
  noun: 'Contact',

  display: {
    label: 'Person Fields',
    description: 'Person Fields',
    hidden: true
  },

  operation: {
    perform: extractFields(EntityType.Person)
  }
}

export const CompanyFieldsDropdown: ZapierItem = {
  key: contactTriggers.companyFieldsDropdown,
  noun: 'Contact',

  display: {
    label: 'Company Fields',
    description: 'Company Fields',
    hidden: true
  },

  operation: {
    perform: extractFields(EntityType.Company)
  }
}

export const ContactFieldsDropdown: ZapierItem = {
  key: contactTriggers.contactFieldsDropdown,
  noun: 'Contact',

  display: {
    label: 'Contact Fields',
    description: 'Contact Fields',
    hidden: true
  },

  operation: {
    perform: extractFields(EntityType.Contact)
  }
}
