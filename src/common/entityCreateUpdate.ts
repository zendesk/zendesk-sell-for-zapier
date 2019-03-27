import {ActionDetails} from '../utils/operations'
import {EntityType, resourceExists} from '../utils/api'
import {PerformMethod} from '../types'
import {Bundle, ZObject} from 'zapier-platform-core'
import {
  chainedProcessors,
  createItem,
  identityPreprocessor,
  idExcludingProcessor,
  InputPreprocessor,
  updateItem
} from './createUpdate'

/**
 * Tries to create new entity based on data passed in Bundle, use only for lead/contact/deal create actions
 */
export const createEntity = (
  endpoint: string,
  actionDetails: ActionDetails,
  entityType: EntityType,
  preprocessor: InputPreprocessor = identityPreprocessor
): PerformMethod => {
  return createItem(endpoint, actionDetails, preprocessor, entityType)
}

/**
 * Tries to update existing entity based on data passed in Bundle, use only for l/c/d update actions.
 */
export const updateEntity = (
  endpoint: string,
  actionDetails: ActionDetails,
  entityType: EntityType,
  preprocessor: InputPreprocessor = identityPreprocessor
): PerformMethod => {
  return updateItem(endpoint, actionDetails, preprocessor, entityType)
}

/**
 * Tries to create or update entity based on data passed in Bundle, use only for lead/contact/deal createOrUpdate actions
 * If id is present in Bundle and item exists it will be updates, otherwise new entity will be created
 */
export const createOrUpdateEntity = (
  endpoint: string,
  actionDetails: ActionDetails,
  entityType: EntityType,
  preprocessor: InputPreprocessor = identityPreprocessor
): PerformMethod => {
  return async (z: ZObject, bundle: Bundle) => {
    if (await resourceExists(z, bundle, endpoint, actionDetails)) {
      return await updateEntity(endpoint, actionDetails, entityType, preprocessor)(z, bundle)
    }
    // Remove id from request at this point
    return await createEntity(endpoint, actionDetails, entityType, chainedProcessors(preprocessor, idExcludingProcessor))(z, bundle)
  }
}
