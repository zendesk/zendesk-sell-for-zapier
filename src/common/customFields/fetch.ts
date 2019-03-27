import {ZObject} from 'zapier-platform-core'
import {fetch, restEndpoints, unpackItemsResponse} from '../../utils/http'
import {EntityType, ResourceType} from '../../utils/api'
import {RawCustomField} from './types'

interface CustomFieldsProcessor {
  fetch: (z: ZObject) => Promise<RawCustomField[]>
}

type Predicate = (cf: any) => boolean

const cfUrl = (resourceType: ResourceType): string => restEndpoints(`${resourceType}/custom_fields`)

const fetchCfDefinitions = async (z: ZObject, url: string, filter: Predicate = () => true): Promise<RawCustomField[]> => {
  const response = await fetch(z, {url})
  return unpackItemsResponse(response, z)
    .filter(filter)
    .map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        choices: item.options || item.choices
      }
    })
}

const leadFetcher: CustomFieldsProcessor = {
  fetch: async (z: ZObject) => await fetchCfDefinitions(z, cfUrl(ResourceType.Lead)),
}

const applicableForPerson: Predicate = (cf: RawCustomField) => !!cf.for_contact
const applicableForCompany: Predicate = (cf: RawCustomField) => !!cf.for_organisation

const personFetcher: CustomFieldsProcessor = {
  fetch: async (z: ZObject) => await fetchCfDefinitions(z, cfUrl(ResourceType.Contact), applicableForPerson)
}

const companyFetcher: CustomFieldsProcessor = {
  fetch: async (z: ZObject) => await fetchCfDefinitions(z, cfUrl(ResourceType.Contact), applicableForCompany)
}

const dealFetcher: CustomFieldsProcessor = {
  fetch: async (z: ZObject) => await fetchCfDefinitions(z, cfUrl(ResourceType.Deal)),
}

const contactFetcher: CustomFieldsProcessor = {
  fetch: async (z: ZObject) => await fetchCfDefinitions(z, cfUrl(ResourceType.Contact))
}

const customFieldFetchers = (entityType: EntityType): CustomFieldsProcessor => {
  return {
    [EntityType.Lead]: leadFetcher,
    [EntityType.Contact]: contactFetcher,
    [EntityType.Person]: personFetcher,
    [EntityType.Company]: companyFetcher,
    [EntityType.Deal]: dealFetcher,
  }[entityType]
}

export const fetchCustomFields = async (entityType: EntityType, z: ZObject): Promise<RawCustomField[]> => {
  return await customFieldFetchers(entityType).fetch(z)
}

