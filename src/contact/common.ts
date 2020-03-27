import {restEndpoints} from '../utils/http'
import {fetchItems, searchWithPrefixedFields, streamItems} from '../common/queries'
import {appendingPreprocessor, InputPreprocessor} from '../common/createUpdate'
import {descendingSort, EntityType} from '../utils/api'
import {Bundle, ZObject} from 'zapier-platform-core'
import {ActionDetails, triggerActionDetails} from '../utils/operations'
import {createEntity, createOrUpdateEntity, updateEntity} from '../common/entityCreateUpdate'

export const contactsEndpoint = restEndpoints('contacts')

export enum ContactType {
  Person,
  Company
}

interface OrganisationProperty {
  is_organization?: boolean
}

export const organisationProperty = (type?: ContactType): OrganisationProperty => {
  return (type === null || type === undefined) ? {} : {is_organization: type === ContactType.Company}
}

export const fetchContactsTrigger = (
  triggerName: string, 
  sortBy: string,
  supportedFilters: string[],
  type?: ContactType
) => {
  return async (z: ZObject, bundle: Bundle) =>
    await streamContacts(
      triggerActionDetails(triggerName),
      supportedFilters
    )(z, bundle, organisationProperty(type), descendingSort(sortBy))
}

export const streamContacts = (actionDetails: ActionDetails, supportedFilters: string[]) =>
  streamItems(contactsEndpoint, actionDetails, supportedFilters)

export const searchContactsByCriteria = (actionDetails: ActionDetails, supportedFilters: string[]) =>
  searchWithPrefixedFields(contactsEndpoint, actionDetails, supportedFilters)

export const fetchContacts = (actionDetails: ActionDetails) =>
  fetchItems(contactsEndpoint, actionDetails)

const appendOrganisation = (type: ContactType): InputPreprocessor =>
  appendingPreprocessor(organisationProperty(type))

export const createContact = (type: ContactType, actionDetails: ActionDetails) =>
  createEntity(contactsEndpoint, actionDetails, EntityType.Contact, appendOrganisation(type))

export const updateContact = (type: ContactType, actionDetails: ActionDetails) =>
  updateEntity(contactsEndpoint, actionDetails, EntityType.Contact)

export const createOrUpdateContact = (type: ContactType, actionDetails: ActionDetails) =>
  createOrUpdateEntity(contactsEndpoint, actionDetails, EntityType.Contact, appendOrganisation(type))
