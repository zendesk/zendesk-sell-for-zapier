import {ResourceType} from '../../utils/api'
import {restEndpoints} from '../../utils/http'
import {ActionDetails} from '../../utils/operations'
import {fetchItems, searchByCriteria} from '../queries'

export const sourceEndpoint = (resourceType: ResourceType) => {
  switch (resourceType) {
    case ResourceType.Lead:
      return restEndpoints('lead_sources')
    case ResourceType.Deal:
      return restEndpoints('deal_sources')
    default:
      throw new Error(`Sources doesn't support resource type - ${resourceType}`)
  }
}

export interface SourceDetails {
  key: string,
  noun: string,
  description: string
}

export const searchSourcesByCriteria = (
  actionDetails: ActionDetails,
  supportedFilters: string[], 
  resourceType: ResourceType
) =>
  searchByCriteria(sourceEndpoint(resourceType), actionDetails, supportedFilters)

export const fetchSources = (actionDetails: ActionDetails, resourceType: ResourceType) =>
  fetchItems(sourceEndpoint(resourceType), actionDetails)

