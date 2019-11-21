import {flatMap} from 'lodash'
import {RawCustomField, RawCustomFieldType} from './types'
import {OutputField} from '../../types'

const parentChildRelatedField = (parent: string, child: string): string => `${parent}__${child}`

const customFieldKey = (fieldName: string): string => parentChildRelatedField('custom_fields', fieldName)

const customFieldLabel = (fieldName: string): string => `Custom Field: ${fieldName}`

const addressCustomFieldKey = (parentField: string, addressField: string): string =>
  customFieldKey(parentChildRelatedField(parentField, addressField))

const addressCustomFieldLabel = (parentField: string, addressField: string): string =>
  customFieldLabel(`${parentField} - ${addressField}`)

const addressCustomFieldOutput = (cf: RawCustomField): OutputField[] => {
  const addressCf = (childName: string, label: string): OutputField => {
    return {
      key: addressCustomFieldKey(cf.name, childName),
      label: addressCustomFieldLabel(cf.name, label)
    }
  }

  return [
    addressCf('line1', 'Street'),
    addressCf('city', 'City'),
    addressCf('postal_code', 'Zip/Post Code'),
    addressCf('state', 'State'),
    addressCf('country', 'Country'),
  ]
}

const convertCustomField = (cf: RawCustomField): OutputField[] => {
  if (cf.type === RawCustomFieldType.Address) {
    return addressCustomFieldOutput(cf)
  }
  return [
    {
      key: customFieldKey(cf.name),
      label: customFieldLabel(cf.name)
    }
  ]
}

/**
 * Converts Custom Fields from Sell API representation to Zapier output fields
 * https://zapier.github.io/zapier-platform-cli/#output-fields
 */
export const extractOutputCustomFields = (rawCustomFields: RawCustomField[]): OutputField[] => {
  return flatMap(rawCustomFields, (rawCf: RawCustomField) => convertCustomField(rawCf))
}
