import {Bundle, ZObject} from 'zapier-platform-core'
import {EntityType, Filters, resourceUrl, UpdateMethod} from '../utils/api'
import {formatCustomFields} from './customFields/customFields'
import {formatAddressFields, outfilterSearchFields} from '../utils/fieldsHelpers'
import {fetch, unpackSingleItemResponse} from '../utils/http'
import {omit, pick} from 'lodash'
import {PerformMethod} from '../types'
import {appendFieldsProcessor} from './fieldAppenders'
import {ActionDetails} from '../utils/operations'

export type InputPreprocessor = (bundleInput: Filters) => Filters

export const idExcludingProcessor: InputPreprocessor = (bundleInput: Filters) => omit(bundleInput, ['id'])

export const identityPreprocessor: InputPreprocessor = (bundleInput: Filters) => bundleInput

export const appendingPreprocessor = (additionalFilters: Filters): InputPreprocessor => {
  return (bundleInput: Filters) => ({
    ...bundleInput,
    ...additionalFilters
  })
}

export const pickedFieldsProcessor = (allowedFieldNames: string[]): InputPreprocessor =>
  (bundleInput: Filters) => pick(bundleInput, allowedFieldNames)

const isEntityDefined = (entityType?: EntityType): entityType is EntityType => !!entityType

export const chainedProcessors = (inner: InputPreprocessor, outer: InputPreprocessor): InputPreprocessor => {
  return (bundleInput: Filters) => outer(inner(bundleInput))
}

export const mergedProcessors = (processors: InputPreprocessor[]): InputPreprocessor => {
  return (bundleInputs: Filters) => {
    const reducer = (acc: Filters, preprocessor: InputPreprocessor) => ({
      ...acc,
      ...preprocessor(bundleInputs)
    })
    return processors.reduce(reducer, {})
  }
}

const createUpdateItem = async (
  z: ZObject,
  bundle: Bundle,
  url: string,
  method: UpdateMethod,
  actionDetails: ActionDetails,
  data: Filters
) => {
  const response = await fetch(
    z,
    {
      method,
      url,
      body: {
        data
      }
    },
    actionDetails
  )
  return unpackSingleItemResponse(response, z)
}

/**
 * Uses createUpdateItem but before calling backend, tries to unpack custom and address fields.
 * Applicable only to leads, contacts, deals
 */
const createUpdateEntityWithCustomFields = async (
  z: ZObject,
  bundle: Bundle,
  url: string,
  method: UpdateMethod,
  actionDetails: ActionDetails,
  data: Filters,
  entityType: EntityType
) => {
  const sanitizedData = await formatCustomFields(z, formatAddressFields(data), entityType)
  return await createUpdateItem(z, bundle, url, method, actionDetails, sanitizedData)
}

/**
 * Generic method for creating items (resources). If entity type is specified it applies additional
 * preprocessing applicable only to lead/cotacts/deals
 */
export const createItem = (
  endpoint: string,
  actionDetails: ActionDetails,
  preprocessor: InputPreprocessor = identityPreprocessor,
  entityType?: EntityType
): PerformMethod => {
  return async (z: ZObject, bundle: Bundle) => {
    const method = UpdateMethod.Post
    const data = preprocessor(outfilterSearchFields(bundle.inputData))
    return isEntityDefined(entityType)
      ? await createUpdateEntityWithCustomFields(z, bundle, endpoint, method, actionDetails, data, entityType)
      : await createUpdateItem(z, bundle, endpoint, method, actionDetails, data)
  }
}

const sanitizedUpdateData = async (
  z: ZObject,
  bundle: Bundle,
  endpoint: string,
  actionDetails: ActionDetails,
  entityType?: EntityType
) => {
  return isEntityDefined(entityType)
    ? await appendFieldsProcessor(z, bundle, endpoint, actionDetails)(bundle.inputData)
    : bundle.inputData
}

/**
 * Generic method for updating items (resources). If entity type is specified it applies additional
 * preprocessing applicable only to lead/contacts/deals
 */
export const updateItem = (
  endpoint: string,
  actionDetails: ActionDetails,
  preprocessor: InputPreprocessor = identityPreprocessor,
  entityType?: EntityType,
): PerformMethod => {
  return async (z: ZObject, bundle: Bundle) => {
    const url = resourceUrl(endpoint, bundle)
    const method = UpdateMethod.Put
    const data = idExcludingProcessor(
      preprocessor(
        outfilterSearchFields(
          await sanitizedUpdateData(z, bundle, endpoint, actionDetails, entityType)
        )
      )
    )
    return isEntityDefined(entityType)
      ? await createUpdateEntityWithCustomFields(z, bundle, url, method, actionDetails, data, entityType)
      : await createUpdateItem(z, bundle, url, method, actionDetails, data)
  }
}
