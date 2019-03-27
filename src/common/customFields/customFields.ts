import {isEmpty, omitBy, pickBy} from 'lodash'
import {ZObject} from 'zapier-platform-core'
import {EntityType} from '../../utils/api'
import {fetchCustomFields} from './fetch'
import {extractCustomFields} from './parse'
import {ZapierCustomField} from './types'
import {customFieldsEnvelope, isCustomField} from './format'
import {OutputField} from '../../types'
import {extractOutputCustomFields} from './resourceOutputFields'
import {reformatDatetimeCustomFields} from './dates'

/**
 * Fetches custom fields using Sell API based on the specified entityType,
 * then transforms them to a representation compliant with Zapier Output Field format
 * https://zapier.github.io/zapier-platform-cli/#customdynamic-fields
 */
export const customFieldsFactory = (entityType: EntityType) => {
  return async (z: ZObject): Promise<ZapierCustomField[]> => {
    const rawCustomFields = await fetchCustomFields(entityType, z)
    return extractCustomFields(rawCustomFields)
  }
}

const customFieldsPredicate = (value: string, key: string): boolean => isCustomField(key)

/**
 * Parses custom fields from the inputData and transforms them to a representation compliant
 * with Sell API (based on entity type)
 * https://developers.getbase.com/docs/rest/articles/requests#custom_fields
 */
export const formatCustomFields = async (z: ZObject, inputData: object, entityType: EntityType) => {
  const customFields = customFieldsEnvelope(
    pickBy(inputData, customFieldsPredicate)
  )
  const sanitizedDateTimes = await reformatDatetimeCustomFields(z, entityType, customFields)
  return {
    ...omitBy(inputData, customFieldsPredicate),
    ...(isEmpty(customFields) ? {} : {custom_fields: sanitizedDateTimes})
  }
}

/**
 * Fetches custom fields using Sell API based on specified entityType and then transforms them
 * to a representation compliant with Zapier Output Field format
 * https://zapier.github.io/zapier-platform-cli/#output-fields
 */
export const customFieldOutputFields = (entityType: EntityType) => {
  return async (z: ZObject): Promise<OutputField[]> => {
    const rawCustomFields = await fetchCustomFields(entityType, z)
    return extractOutputCustomFields(rawCustomFields)
  }
}
