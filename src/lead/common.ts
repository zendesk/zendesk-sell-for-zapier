import {restEndpoints} from '../utils/http'
import {fetchItems, searchWithPrefixedFields, streamItems} from '../common/queries'
import {InputPreprocessor} from '../common/createUpdate'
import {descendingSort, EntityType, Filters} from '../utils/api'
import {Bundle, ZObject} from 'zapier-platform-core'
import {ActionDetails, triggerActionDetails} from '../utils/operations'
import {createEntity, createOrUpdateEntity, updateEntity} from '../common/entityCreateUpdate'

export const leadsEndpoint = restEndpoints('leads')

export const createLeadName = (lead: any) => {
  const {first_name: firstName, last_name: lastName} = lead
  if (lastName) {
    return (firstName ? `${firstName} ` : '') + lastName
  }
  return lead.organization_name
}

export const leadCreateFieldsValidation: InputPreprocessor = (inputData: Filters) => {
  const {first_name: firstName, last_name: lastName, organization_name: companyName} = inputData

  if (firstName && companyName && !lastName) {
    throw new Error('Last Name can\'t be blank')
  }
  if (!lastName && !companyName) {
    throw new Error('Make sure a lead has at least Last Name or Company Name provided.')
  }
  return inputData
}

export const fetchLeadsTrigger = (triggerName: string, sortBy: string, supportedFilters: string[]) => {
  return async (z: ZObject, bundle: Bundle) =>
    streamLeads(triggerActionDetails(triggerName), supportedFilters)(z, bundle, {}, descendingSort(sortBy))
}

export const streamLeads = (actionDetails: ActionDetails, supportedFilters: string[]) =>
  streamItems(leadsEndpoint, actionDetails, supportedFilters)

export const searchLeadsByCriteria = (actionDetails: ActionDetails, supportedFilters: string[]) =>
  searchWithPrefixedFields(leadsEndpoint, actionDetails, supportedFilters)

export const fetchLeads = (actionDetails: ActionDetails) =>
  fetchItems(leadsEndpoint, actionDetails)

export const createLead = (actionDetails: ActionDetails) =>
  createEntity(leadsEndpoint, actionDetails, EntityType.Lead, leadCreateFieldsValidation)

export const updateLead = (actionDetails: ActionDetails) =>
  updateEntity(leadsEndpoint, actionDetails, EntityType.Lead)

export const createOrUpdateLead = (actionDetails: ActionDetails) =>
  createOrUpdateEntity(leadsEndpoint, actionDetails, EntityType.Lead)
