import {contactActions, contactSearches} from './keys'

export const ContactPersonSearchOrCreate = {
  key: contactSearches.personSearchOrCreate,
  display: {
    label: 'Find or Create Person',
    description: 'Finds a contact by Contact ID, name or email address. Optionally, create one if none are found.'
  },
  search: contactSearches.personSearchOrCreate,
  create: contactActions.createPersonAction
}

export const ContactCompanySearchOrCreate = {
  key: contactSearches.companySearchOrCreate,
  display: {
    label: 'Find or Create Company',
    description: 'Finds a company by Company ID, name or email address. Optionally, create one if none are found.'
  },
  search: contactSearches.companySearchOrCreate,
  create: contactActions.createCompanyAction
}
