import {flatMap} from 'lodash'
import {RawCustomField, RawCustomFieldType, ZapierCustomField, ZapierCustomFieldType} from './types'

export const customFieldPath = (fieldName: string) => `custom_fields.${fieldName}`

const addressCustomFieldPath = (parentField: string, childField: string) =>
  customFieldPath(`${parentField}.${childField}`)

const addressCustomFieldLabel = (parentField: string, childField: string) =>
  `${parentField} - ${childField}`

const regularTypeConverter = (field: RawCustomField, type: ZapierCustomFieldType): ZapierCustomField[] => {
  return [
    {
      key: customFieldPath(field.name),
      label: field.name,
      type
    }
  ]
}

const addressTypeConverter = (field: RawCustomField): ZapierCustomField[] => {
  const singleField = (key: string, label: string): ZapierCustomField => ({
    key: addressCustomFieldPath(field.name, key),
    label: addressCustomFieldLabel(field.name, label),
    type: ZapierCustomFieldType.String
  })

  return [
    singleField('line1', 'Street'),
    singleField('city', 'City'),
    singleField('postal_code', 'Zip/Post Code'),
    singleField('state', 'State or Region'),
    singleField('country', 'Country'),
  ]
}

const listTypeConverter = (field: RawCustomField, isMultiSelect: boolean): ZapierCustomField[] => {
  return [
    {
      key: customFieldPath(field.name),
      label: field.name,
      type: ZapierCustomFieldType.String,
      choices: (field.choices || []).map(item => item.name),
      list: isMultiSelect
    }
  ]
}

/**
 * Represents a mapping between Sell's and Zapier's Custom Field types
 */
const converter = (type: RawCustomFieldType)
  : (field: RawCustomField) => ZapierCustomField[] => {
  return {
    [RawCustomFieldType.Number]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.Integer),
    [RawCustomFieldType.String]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.String),
    [RawCustomFieldType.Text]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.Text),
    [RawCustomFieldType.Bool]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.Boolean),
    [RawCustomFieldType.Date]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.DateTime),
    [RawCustomFieldType.DateTime]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.DateTime),
    [RawCustomFieldType.Email]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.String),
    [RawCustomFieldType.Phone]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.String),
    [RawCustomFieldType.Url]: (field: RawCustomField) => regularTypeConverter(field, ZapierCustomFieldType.String),
    [RawCustomFieldType.Address]: (field: RawCustomField) => addressTypeConverter(field),
    [RawCustomFieldType.List]: (field: RawCustomField) => listTypeConverter(field, false),
    [RawCustomFieldType.MultiSelect]: (field: RawCustomField) => listTypeConverter(field, true)
  }[type]
}

const convertCustomField = (customField: RawCustomField): ZapierCustomField[] => {
  return converter(customField.type)(customField)
}

/**
 * Converts Sell API Custom Fields representation to Zapier's Input Field type
 */
export const extractCustomFields = (customFields: RawCustomField[]): ZapierCustomField[] => {
  return flatMap(customFields, (rawCf: RawCustomField) => convertCustomField(rawCf))
}
