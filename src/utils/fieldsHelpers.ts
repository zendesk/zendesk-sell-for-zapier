import {isEmpty, mapKeys, mapValues, omitBy, pick, pickBy} from 'lodash'
import * as moment from 'moment'
import {Filters} from './api'

const addressFieldsEnvelope = (addressFields: object) => {
  const remapped = mapKeys(addressFields, (value, key) => key.split('.')[1])
  return isEmpty(remapped) ? {} : {address: remapped}
}

export const formatAddressFields = (inputData: object) => {
  const addressFieldsPredicate = (value: string, key: string): boolean => key.startsWith('address.')
  const addressFields = pickBy(inputData, addressFieldsPredicate)
  return {
    ...omitBy(inputData, addressFieldsPredicate),
    ...addressFieldsEnvelope(addressFields)
  }
}

export const convertToUtc = (input: any) => {
  if (!input || !moment(input).isValid()) {
    return input
  }
  return moment(input).utc().format()
}

/**
 * Picks datetime fields and converts their values to UTC.
 * Zapier by default uses moment.js and stores datetimes in ISO format with Timezone e.g. 2018-12-19T19:37:26+01:00
 *
 * Some fields (especially in tasks) requires dates to be in UTC formatted in ISO8601
 */
export const sanitizeDateTimeFields = (inputData: Filters, dateTimeFieldNames: string[]): Filters => {
  return mapValues(
    pick(inputData, dateTimeFieldNames),
    convertToUtc
  )
}

/**
 * We need to prefix fields in searchOrCreate action to prevent from conflicting keys from search with keys from create.
 * If there are two fields (one in action and one in search) then Zapier has problems with rendering them properly
 *
 * For example, duplicated fields are visible only in search action and duplicated field which are required
 * during create are marked as required in search
 */
const searchFieldPrefix = 'search.'

export const searchPrefixedField = (fieldName: string) => `${searchFieldPrefix}${fieldName}`

export const pickOnlySearchFields = (inputData: Filters): Filters => {
  const regexp = new RegExp(`^${searchFieldPrefix}`)
  const removePrefix = (v: any, k: string) => k.replace(regexp, '')
  return mapKeys(
    pickBy(inputData, (v: any, k: string) => k.startsWith(searchFieldPrefix)), removePrefix
  )
}

export const outfilterSearchFields = (inputData: Filters): Filters => {
  return omitBy(inputData, (v, k) => k.startsWith(searchFieldPrefix))
}
