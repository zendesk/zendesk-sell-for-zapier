import {companyFields, companyIdFields, personFields, personIdFields} from './fields/contactInputFields'
import {ContactType, createContact, createOrUpdateContact, updateContact} from './common'
import ContactResource from './contact.resource'
import {ZapierItem} from '../types'
import {createActionDetails} from '../utils/operations'
import {contactActions} from './keys'

export const CreatePersonAction: ZapierItem = {
  key: contactActions.createPersonAction,
  noun: 'Person',
  display: {
    label: 'Create Person',
    description: 'Creates a new person.',
  },
  operation: {
    resource: ContactResource.key,
    inputFields: personFields(true),
    perform: createContact(ContactType.Person, createActionDetails(contactActions.createPersonAction))
  }
}

export const UpdatePersonAction: ZapierItem = {
  key: contactActions.updatePersonAction,
  noun: 'Person',
  display: {
    label: 'Update Person',
    description: 'Updates an existing person.',
  },
  operation: {
    resource: ContactResource.key,
    inputFields: [
      ...personIdFields(true),
      ...personFields(false),
    ],
    perform: updateContact(ContactType.Person, createActionDetails(contactActions.updatePersonAction))
  }
}

export const CreateCompanyAction: ZapierItem = {
  key: contactActions.createCompanyAction,
  noun: 'Company',
  display: {
    label: 'Create Company',
    description: 'Creates a new company.',
  },
  operation: {
    resource: ContactResource.key,
    inputFields: companyFields(true),
    perform: createContact(ContactType.Company, createActionDetails(contactActions.createCompanyAction))
  }
}

export const UpdateCompanyAction: ZapierItem = {
  key: contactActions.updateCompanyAction,
  noun: 'Company',
  display: {
    label: 'Update Company',
    description: 'Updates an existing company.',
  },
  operation: {
    resource: ContactResource.key,
    inputFields: [
      ...companyIdFields(true),
      ...companyFields(false),
    ],
    perform: updateContact(ContactType.Company, createActionDetails(contactActions.updateCompanyAction))
  }
}

// Deprecated and hidden
export const DeprecatedCreateOrUpdatePersonAction: ZapierItem = {
  key: 'contact_create_or_update_person',
  noun: 'Person',
  display: {
    label: 'Create or Update Person',
    description: 'Creates or Updates a person based off of a Person ID.',
    hidden: true
  },
  operation: {
    resource: ContactResource.key,
    inputFields: [
      ...personIdFields(false),
      ...personFields(false),
    ],
    perform: createOrUpdateContact(ContactType.Person, createActionDetails('contact_create_or_update_person'))
  }
}

// Deprecated and hidden
export const DeprecatedCreateOrUpdateCompanyAction: ZapierItem = {
  key: 'contact_create_or_update_company',
  noun: 'Company',
  display: {
    label: 'Create or Update Company',
    description: 'Creates or Updates a company based off of a Company ID.',
    hidden: true
  },
  operation: {
    resource: ContactResource.key,
    inputFields: [
      ...companyIdFields(false),
      ...companyFields(false),
    ],
    perform: createOrUpdateContact(ContactType.Company, createActionDetails('contact_create_or_update_company'))
  }
}
