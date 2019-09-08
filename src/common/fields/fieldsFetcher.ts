import {EntityType} from '../../utils/api'
import {Bundle, ZObject} from 'zapier-platform-core'
import {RawCustomField, RawCustomFieldType} from '../customFields/types'
import {fetchCustomFields} from '../customFields/fetch'
import {leadRegularFields} from '../../lead/fields/leadInputFields'
import {InputField} from '../../types'
import {companyRegularFields, contactRegularFields, personRegularFields} from '../../contact/fields/contactInputFields'
import {dealRegularFields} from '../../deal/fields/dealInputFields'

export interface FieldDefinition {
  id: string,
  name: string
}

const triggerSupportedTypes = [
  RawCustomFieldType.Number,
  RawCustomFieldType.String,
  RawCustomFieldType.Text,
  RawCustomFieldType.Bool,
  RawCustomFieldType.Date,
  RawCustomFieldType.DateTime,
  RawCustomFieldType.Email,
  RawCustomFieldType.Phone,
  RawCustomFieldType.Url,
  RawCustomFieldType.List
]

const customFieldPath = (cf: RawCustomField): string =>
  `custom_fields.${cf.name}`

const customFieldLabel = (cf: RawCustomField): string =>
  `Custom Field: ${cf.name}`

const customFieldRepresentation = (cf: RawCustomField) : FieldDefinition =>
  ({id: customFieldPath(cf), name: customFieldLabel(cf)})

const fetchSupportedCustomFields = async (z: ZObject, entityType: EntityType): Promise<FieldDefinition[]> => {
  const customFields: RawCustomField[] = await fetchCustomFields(entityType, z)
  return customFields
    .filter(cf => triggerSupportedTypes.includes(cf.type))
    .map(customFieldRepresentation)
}

const regularFieldsByType = (entityType: EntityType) : InputField[] => {
  return {
    [EntityType.Lead]: leadRegularFields(true),
    [EntityType.Deal]: dealRegularFields(true),
    [EntityType.Contact]: contactRegularFields(true),
    [EntityType.Person]: personRegularFields(true),
    [EntityType.Company]: companyRegularFields(true),
  }[entityType]
}

const extractRegularFields = (entityType: EntityType): FieldDefinition[] => {
  return regularFieldsByType(entityType)
    .map(f => ({id: f.key, name: f.label}))
}

export const extractFields = (entityType: EntityType) =>
  async (z: ZObject, bundle: Bundle): Promise<FieldDefinition[]> => {
    const regularFields = extractRegularFields(entityType)
    const customFields = await fetchSupportedCustomFields(z, entityType)
    return [
      ...regularFields,
      ...customFields
    ]
  }
