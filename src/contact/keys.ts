/**
 * zapier-validate sometimes has problems when keys from actions/searches are used in searchOrCreate operations
 */
export const contactActions = {
  createPersonAction: 'contact_person_create',
  updatePersonAction: 'contact_person_update',
  createCompanyAction: 'contact_company_create',
  updateCompanyAction: 'contact_company_update'
}

export const contactSearches = {
  contactSearch: 'contact_contact_search_v2',
  personSearchOrCreate: 'contact_person_search',
  companySearchOrCreate: 'contact_company_search'
}

export const contactTriggers = {
  newContactTrigger: 'contact_new_contact_trigger',
  updatedContactTrigger: 'contact_update_contact_trigger',
  contactListDropdown: 'contact_list_contacts',
  personListDropdown: 'contact_list_persons',
  companyListDropdown: 'contact_list_companies',
  contactFieldsDropdown: 'contact_fields_dropdown',
  personFieldsDropdown: 'person_fields_dropdown',
  companyFieldsDropdown: 'company_fields_dropdown'
}
