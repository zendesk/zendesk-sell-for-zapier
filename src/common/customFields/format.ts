import {reduce} from 'lodash'

interface AccumulatorType {
  [index: string]: any
}

const customFieldMatcher = /^custom_fields.(.*)$/
const addressCustomFieldMatcher = /^custom_fields.(.*).(line1|city|postal_code|state|country)$/

export const isCustomField = (fieldName: string): boolean => customFieldMatcher.test(fieldName)

const isAddressCustomField = (name: string): boolean => addressCustomFieldMatcher.test(name)

const extractAddressCustomField = (name: string, value: any, accumulator: AccumulatorType) => {
  const matched = name.match(addressCustomFieldMatcher)
  if (!matched) {
    // This should never happen
    throw new Error(`Not matching field definition passed as custom field: ${name} ${value}`)
  }

  const [ignored, parentField, childField] = matched
  return {
    ...accumulator,
    [parentField]: {
      ...(accumulator.hasOwnProperty(parentField) ? accumulator[parentField] : {}),
      [childField]: value
    }
  }
}

const extractRegularCustomField = (name: string, value: any, accumulator: AccumulatorType) => {
  const matched = name.match(customFieldMatcher)
  if (!matched) {
    // This should never happen
    throw new Error(`Not matching field definition passed as custom field ${name} ${value}`)
  }

  const [ignored, customFieldName] = matched
  return {
    ...accumulator,
    [customFieldName]: value
  }
}

/**
 * Zapier Input Fields are not hierarchical, so Sell API Custom Fields must be flattened before conversion
 * by replacing the object hierarchy with dots in the fields' keys.
 *
 * This function is responsible for bringing back this hierarchy based on fields' keys
 * and building envelope compliant with Sell API
 * https://developers.getbase.com/docs/rest/articles/requests#custom_fields
 */
export const customFieldsEnvelope = (customFields: object) => {
  const reducer = (acc: AccumulatorType, value: any, key: string) => {
    if (isAddressCustomField(key)) {
      return extractAddressCustomField(key, value, acc)
    }
    return extractRegularCustomField(key, value, acc)
  }
  return reduce(customFields, reducer, {})
}
