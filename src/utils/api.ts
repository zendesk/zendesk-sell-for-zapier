import {isEmpty, pick, pickBy} from 'lodash'
import {Bundle, ZObject} from 'zapier-platform-core'
import {fetch, isResourcePresentInResponse, unpackItemResponseAsArray, unpackSingleItemResponse} from './http'
import {ActionDetails} from './operations'

export enum ResourceType {
  Lead = 'lead',
  Contact = 'contact',
  Deal = 'deal'
}

export enum EntityType {
  Lead = 'lead',
  Person = 'person',
  Company = 'company',
  Contact = 'contact',
  Deal = 'deal'
}

export enum UpdateMethod {
  Put = 'PUT',
  Post = 'POST'
}

export enum SortOrder {
  Desc = 'desc',
  Asc = 'asc'
}

export interface Filters {
  [propName: string]: any
}

interface ApiSortParameter {
  sort_by?: string
}

export interface SortDefinition {
  fieldName: string,
  order?: SortOrder
}

export const descendingSort = (fieldName: string): SortDefinition => ({fieldName, order: SortOrder.Desc})

const isNumeric = (x: any): boolean => x !== null && x !== undefined && !isNaN(x)

export const hasIdDefined = (bundle: Bundle): boolean => isNumeric(bundle.inputData.id)

export const resourceUrl = (rootUrl: string, bundle: Bundle): string => `${rootUrl}/${bundle.inputData.id}`

export const areSearchCriteriaDefined = (bundle: Bundle, filters: Filters) => hasIdDefined(bundle) || !isEmpty(filters)

export const notNullableSupportedFilters = (bundle: Bundle, filterNames: string[]): Filters => {
  return pick(notNullableInputs(bundle.inputData), filterNames)
}

export const sortParameter = (sort?: SortDefinition): ApiSortParameter => {
  if (!sort) {
    return {}
  }
  const {fieldName, order} = sort
  const stringifiedOrder = !!order ? order : SortOrder.Desc
  return {
    sort_by: `${fieldName}:${stringifiedOrder}`
  }
}

export const extractPageParameter = (bundle: Bundle, pageNumber?: number, pageSize?: number) =>
  pageParameter((bundle && bundle.meta && bundle.meta.page) || pageNumber, pageSize)

export const pageParameter = (pageNumber: number = 1, pageSize: number = 100) => {
  return {
    per_page: pageSize,
    page: pageNumber
  }
}

export const notNullableInputs = (inputData: Filters) => {
  return pickBy(inputData, value => value !== null && value !== undefined)
}

/**
 * Checks if resource exists by trying to fetch it by ID
 */
export const resourceExists = async (
  z: ZObject,
  bundle: Bundle,
  rootUrl: string,
  actionDetails?: ActionDetails
): Promise<boolean> => {
  if (!hasIdDefined(bundle)) {
    return false
  }

  const response = await fetch(z, {url: resourceUrl(rootUrl, bundle)}, actionDetails)
  return isResourcePresentInResponse(z, response)
}

/**
 * Fetches resource (e.g. lead, contact) by id and returns as single item.
 * Error is thrown for response different than 2xx.
 */
export const fetchResource = async (
  z: ZObject,
  bundle: Bundle,
  rootUrl: string,
  actionDetails?: ActionDetails
) => {
  const response = await fetch(z, {url: resourceUrl(rootUrl, bundle)}, actionDetails)
  return unpackSingleItemResponse(response, z)
}

/**
 * Fetches resource (e.g. lead, contact) by id and returns wrapped with array.
 * If item cannot be found (404 is returned from API), empty array is returned.
 */
export const fetchResourceAsArray = async (
  z: ZObject,
  bundle: Bundle,
  rootUrl: string,
  actionDetails?: ActionDetails
): Promise<any[]> => {
  const response = await fetch(z, {url: resourceUrl(rootUrl, bundle)}, actionDetails)
  return unpackItemResponseAsArray(z, response)
}
