import {fetchResource, Filters} from '../utils/api'
import {isArray, isEmpty, keys, mapKeys, omit, omitBy, reduce, uniq} from 'lodash'
import {customFieldPath} from './customFields/parse'
import {Bundle, ZObject} from 'zapier-platform-core'
import {ActionDetails} from '../utils/operations'

const extractField = (bundle: Bundle, payload: any, fieldName: string): Filters => {
  const values = !!bundle.inputData[fieldName] ?
    uniq([
      ...(payload[fieldName] || []),
      ...bundle.inputData[fieldName]
    ]) :
    []
  return isEmpty(values) ? {} : {[fieldName]: values}
}

const extractTags = (bundle: Bundle, payload: any): Filters => extractField(bundle, payload, 'tags')

const filterMap = (map: object, predicate: (value: any, key?: string) => boolean) => {
  return omitBy(map, (v, k) => !predicate(v, k))
}

const notEmptyMutliSelectCustomFields = (existingItem: any): Filters => {
  const customFields = filterMap(existingItem.custom_fields, (value) => isArray(value) && !isEmpty(value))
  return mapKeys(customFields, (v, k) => customFieldPath(k))
}

const extractMultiSelectCustomFields = (bundle: Bundle, multiSelectCustomFields: Filters): Filters => {
  const reducer = (acc: object, value: any, key: string) => {
    return {
      ...acc,
      ...extractField(bundle, multiSelectCustomFields, key)
    }
  }
  return reduce(multiSelectCustomFields, reducer, {})
}

export const appendedArrayFields = async (z: ZObject, bundle: Bundle, endpoint: string, actionDetails?: ActionDetails): Promise<Filters> => {
  const existingItem = await fetchResource(z, bundle, endpoint, actionDetails)
  const multiSelectCustomFields = notEmptyMutliSelectCustomFields(existingItem)
  return {
    ...extractTags(bundle, existingItem),
    ...extractMultiSelectCustomFields(bundle, multiSelectCustomFields)
  }
}

/**
 * Makes sure that multiselect custom fields and tags will be appended to existing values instead of overwriting them.
 * To achieve this, first we need to fetch existing resource (e.g. lead) and append existing values to input from bundle
 */
export const appendFieldsProcessor = (z: ZObject, bundle: Bundle, endpoint: string, actionDetails?: ActionDetails) =>
  async (inputData: Filters): Promise<Filters> => {
    const appendedFields = await appendedArrayFields(z, bundle, endpoint, actionDetails)
    return {
      ...omit(inputData, keys(appendedFields)),
      ...appendedFields
    }
  }

