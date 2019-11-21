import {omit} from 'lodash'
import {restEndpoints} from '../utils/http'
import {descendingSort, EntityType, Filters} from '../utils/api'
import {fetchItems, searchWithPrefixedFields, streamItems} from '../common/queries'
import {InputPreprocessor} from '../common/createUpdate'
import {Bundle, ZObject} from 'zapier-platform-core'
import {ActionDetails, triggerActionDetails} from '../utils/operations'
import {createEntity, createOrUpdateEntity, updateEntity} from '../common/entityCreateUpdate'

export const dealsEndpoint = restEndpoints('deals')

export const fetchDealsTrigger = (triggerName: string, sortBy: string, supportedFilters: string[]) => {
  return async (z: ZObject, bundle: Bundle) =>
    await streamDeals(triggerActionDetails(triggerName), supportedFilters)(z, bundle, {}, descendingSort(sortBy))
}

export const streamDeals = (actionDetails: ActionDetails, supportedFilters: string[]) =>
  streamItems(dealsEndpoint, actionDetails, supportedFilters)

export const searchDealsByCriteria = (actionDetails: ActionDetails, supportedFilters: string[]) =>
  searchWithPrefixedFields(dealsEndpoint, actionDetails, supportedFilters)

export const fetchDeals = (actionDetails: ActionDetails) =>
  fetchItems(dealsEndpoint, actionDetails)

const skippingPipelinePreprocessor: InputPreprocessor = (inputData: Filters): Filters =>
  omit(inputData, ['pipeline_id'])

export const createDeal = (actionDetails: ActionDetails) =>
  createEntity(dealsEndpoint, actionDetails, EntityType.Deal, skippingPipelinePreprocessor)

export const updateDeal = (actionDetails: ActionDetails) =>
  updateEntity(dealsEndpoint, actionDetails, EntityType.Deal, skippingPipelinePreprocessor)

export const createOrUpdateDeal = (actionDetails: ActionDetails) =>
  createOrUpdateEntity(dealsEndpoint, actionDetails, EntityType.Deal, skippingPipelinePreprocessor)


