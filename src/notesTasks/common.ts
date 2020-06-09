import {Bundle, ZObject} from 'zapier-platform-core'
import {restEndpoints} from '../utils/http'
import {includes} from 'lodash'
import {sanitizeDateTimeFields} from '../utils/fieldsHelpers'
import {ActionDetails} from '../utils/operations'
import {contactSearches, contactTriggers} from '../contact/keys'
import {leadSearches, leadTriggers} from '../lead/keys'
import {dealSearches, dealTriggers} from '../deal/keys'
import {Filters} from '../utils/api'
import {createItem, InputPreprocessor, mergedProcessors, pickedFieldsProcessor} from '../common/createUpdate'

enum ResourceChoice {
  Lead = 'Lead',
  Person = 'Person',
  Company = 'Company',
  Deal = 'Deal'
}

interface DynamicResourceField {
  key: string,
  label: string,
  type: string,
  helpText?: string,
  dynamic?: string,
  search?: string,
  required: boolean
}

export const resourceChoices: string[] = [
  ResourceChoice.Lead,
  ResourceChoice.Person,
  ResourceChoice.Company,
  ResourceChoice.Deal
]

const contactResources = [ResourceChoice.Company, ResourceChoice.Person] as string[]

const requestResourceType = (resourceType?: string): string | undefined => {
  if (!resourceType) return undefined

  if (includes(contactResources, resourceType)) {
    return 'contact'
  }
  return resourceType.toLowerCase()
}

const resourceField = (
  resourceName: string,
  dropDownList?: string,
  dropDownSearch?: string
): DynamicResourceField[] => {
  const field = (fieldName: string, suffix: string, prefix?: string) =>
    !!prefix ? {[fieldName]: prefix + suffix} : {}

  return [{
    key: 'resource_id',
    label: resourceName,
    type: 'integer',
    helpText: 'After selecting the "Related To" field above, map the corresponding ID in this field. For example, if "Related To" is "Person" then you will map a Person ID here.',
    ...field('dynamic', '.id.name', dropDownList),
    ...field('search', '.id', dropDownSearch),
    required: true
  }]
}

const resourceFields = (resourceType?: ResourceChoice): DynamicResourceField[] => {
  if (!resourceType) {
    return []
  }

  switch (resourceType) {
    case ResourceChoice.Lead:
      return resourceField(
        ResourceChoice.Lead,
        leadTriggers.leadListDropdown,
        leadSearches.leadSearchOrCreate
      )
    case ResourceChoice.Person:
      return resourceField(
        ResourceChoice.Person,
        contactTriggers.personListDropdown,
        contactSearches.personSearchOrCreate
      )
    case ResourceChoice.Company:
      return resourceField(
        ResourceChoice.Company,
        contactTriggers.companyListDropdown,
        contactSearches.companySearchOrCreate
      )
    case ResourceChoice.Deal:
      return resourceField(
        ResourceChoice.Deal,
        dealTriggers.dealListDropdown,
        dealSearches.dealSearchOrCreate
      )
    default:
      /**
       * If user provides custom value instead of selecting one from dropdown let's return simple integer field
       * which expects id of resource to be provided
       */
      return resourceField('Resource ID')
  }
}

/**
 * After selecting resource type from dropdown (e.g. Lead) additional components should be rendered
 * to allow user to search or select from dropdown resource accordingly.
 */
export const dynamicResourceField = (z: ZObject, bundle: Bundle) => resourceFields(bundle.inputData.resource_type)

const utcDatesProcessor = (dateFieldNames: string[]): InputPreprocessor =>
  (bundleInput: Filters) => sanitizeDateTimeFields(bundleInput, dateFieldNames)

export const appendedResourceTypeProcessor: InputPreprocessor =
  (bundleInput: Filters) => ({resource_type: requestResourceType(bundleInput.resource_type)})

/**
 * Creates new task or note. Perform all sanitization that is required by the Public API.
 */
export const createTaskNoteResource = (
  endpoint: string,
  actionDetails: ActionDetails,
  allowedFieldNames: string[],
  dateFieldNames: string[] = []
) => {
  const preprocessor = mergedProcessors([
    pickedFieldsProcessor(allowedFieldNames),
    utcDatesProcessor(dateFieldNames),
    appendedResourceTypeProcessor
  ])
  return createItem(endpoint, actionDetails, preprocessor)
}

export const notesEndpoint = restEndpoints('notes')
export const tasksEndpoint = restEndpoints('tasks')
