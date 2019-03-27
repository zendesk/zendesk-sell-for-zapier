import {ZObject} from 'zapier-platform-core'
import {EntityType} from '../../utils/api'
import {fetchCustomFields} from './fetch'
import {RawCustomField, RawCustomFieldType} from './types'
import {includes, mapValues} from 'lodash'
import * as moment from 'moment'

/**
 * DateTime and Date custom fields don't understand timezones. We want to convert them into local time (skip timezone entirely)
 * and send as ISO format, this is implication from system's limitations.
 */
const formatDate = (value: any) =>
  moment(value).utcOffset(value).format('YYYY-MM-DD')

const formatDateTime = (value: any) => {
  // This skips timezone and treats time as local
  const dateTime = moment(value).utcOffset(value).format('YYYY-MM-DDTHH:mm:ss')
  return moment.utc(dateTime).format()
}

interface DateTimeCustomFields {
  [index: string]: RawCustomFieldType
}

/**
 * Fetches custom fields from API and returns only date / datetime ones
 */
const fetchDateTimeCustomFields = async (z: ZObject, entityType: EntityType): Promise<DateTimeCustomFields> => {
  const reducer = (acc: DateTimeCustomFields, customField: RawCustomField) => ({
    ...acc,
    [customField.name]: customField.type
  })

  const customFields: RawCustomField[] = await fetchCustomFields(entityType, z)
  return customFields
    .filter(cf => includes([RawCustomFieldType.Date, RawCustomFieldType.DateTime], cf.type))
    .reduce(reducer, {})
}

export const formatDateAndTimeCustomFields = (type: RawCustomFieldType, value: any) =>
  type === RawCustomFieldType.DateTime ? formatDateTime(value) : formatDate(value)

/**
 * Scans customFields payload and tries to reformat only date/datetime custom fields (skipping timezone)
 */
export const reformatDatetimeCustomFields = async (z: ZObject, entityType: EntityType, customFields: object) => {
  const dfCustomFields: DateTimeCustomFields = await fetchDateTimeCustomFields(z, entityType)
  return mapValues(customFields, (val, key) => {
    if (!dfCustomFields.hasOwnProperty(key)) return val
    return formatDateAndTimeCustomFields(dfCustomFields[key], val)
  })
}

