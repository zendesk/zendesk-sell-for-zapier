import {Bundle, ZObject} from 'zapier-platform-core'
import {
  areSearchCriteriaDefined,
  extractPageParameter,
  fetchResourceAsArray,
  Filters,
  hasIdDefined,
  notNullableSupportedFilters,
  pageParameter,
  SortDefinition,
  sortParameter
} from '../utils/api'
import {fetch, ItemsWithMeta, unpackItemsResponse, unpackItemsWithMeta} from '../utils/http'
import {ActionDetails, FetchRequestOptions} from '../utils/operations'
import {pickOnlySearchFields} from '../utils/fieldsHelpers'

const unpackSupportedFilters = (bundle: Bundle, supportedFilters: string[]): Filters => {
  return notNullableSupportedFilters(bundle, supportedFilters)
}

const unpackSupportedParams = (supportedFilters: string[]) => {
  return (bundle: Bundle, otherFilters: Filters, sort?: SortDefinition): Filters => {
    return {
      ...unpackSupportedFilters(bundle, supportedFilters),
      ...sortParameter(sort),
      ...extractPageParameter(bundle),
      ...otherFilters
    }
  }
}

/**
 * Use this one only for searching purposes - not applicable for dynamic dropdowns, because bundle.inputData
 * may contain data from the form which may corrupt search results.
 *
 * It tries to fetch directly item if the id is specified, otherwise unpacks filters and use query params for searching.
 */
export const fetchByCriteria = (endpoint: string, actionDetails: ActionDetails, supportedFilters: string[]) => {
  return async (z: ZObject, bundle: Bundle, otherFilters: Filters = {}, sort?: SortDefinition) => {
    if (hasIdDefined(bundle)) {
      return await fetchResourceAsArray(z, bundle, endpoint, actionDetails)
    }

    const response = await fetch(
      z,
      {
        url: endpoint,
        params: unpackSupportedParams(supportedFilters)(bundle, otherFilters, sort)
      },
      actionDetails
    )
    return unpackItemsResponse(response, z)
  }
}

/**
 * Additional compose function which doesn't perform any action (API call) if a user doesn't provide any filter.
 * This prevents from fetching random contacts if filters are not specified (desired behavior for search actions)
 */
export const searchByCriteria = (endpoint: string, actionDetails: ActionDetails, supportedFilters: string[]) => {
  return async (z: ZObject, bundle: Bundle, otherFilters: Filters = {}) => {
    if (!areSearchCriteriaDefined(bundle, unpackSupportedFilters(bundle, supportedFilters))) {
      return []
    }
    return await fetchByCriteria(endpoint, actionDetails, supportedFilters)(z, bundle, otherFilters)
  }
}

const sanitizeSearchBundle = (bundle: Bundle) => {
  bundle.inputData = pickOnlySearchFields(bundle.inputData)
  return bundle
}

/**
 * Picks only fields prefixed with 'search.' and performs a search by criteria. Useful for searchOrCreate actions
 * which need to prefix fields to differentiate them from fields from a create action form.
 */
export const searchWithPrefixedFields = (
  endpoint: string,
  actionDetails: ActionDetails,
  supportedFilters: string[]
) => {
  return async (z: ZObject, bundle: Bundle, otherFilters: Filters = {}) => {
    const sanitizedBundle = sanitizeSearchBundle(bundle)
    return await searchByCriteria(endpoint, actionDetails, supportedFilters)(z, sanitizedBundle, otherFilters)
  }
}

/**
 * Use this one for dynamic dropdowns. It only puts payload from otherFilters into the params and ignores a content
 * from bundle.inputData (additional filters can be passed using 'otherFilters')
 */
export const fetchItems = (endpoint: string, actionDetails: ActionDetails) => {
  return async (z: ZObject, bundle: Bundle, otherFilters: Filters = {}, sort?: SortDefinition) => {
    const response = await fetch(
      z,
      {
        url: endpoint,
        params: {
          ...sortParameter(sort),
          ...extractPageParameter(bundle),
          ...otherFilters
        }
      },
      actionDetails
    )
    return unpackItemsResponse(response, z)
  }
}

/**
 * It allows to fetch more than one page from the API. Use this one for triggers, this is the only use case (so far)
 * when we want to load more data than one page contains (> 100).
 *
 * Optimization: If trigger is called from web editor, only first page is fetched
 * (it doesn't make sense to fetch more than one in this scenario)
 */
export const streamItems = (
  endpoint: string,
  actionDetails: ActionDetails,
  supportedFilters: string[],
  maxPages: number = 3
) => {
  return async (z: ZObject, bundle: Bundle, otherFilters: Filters = {}, sort?: SortDefinition) => {
    const payload = {
      url: endpoint,
      params: unpackSupportedParams(supportedFilters)(bundle, otherFilters, sort)
    }
    return await streamPages(
      z,
      payload,
      actionDetails,
      (bundle.meta && bundle.meta.isLoadingSample) ? 1 : maxPages
    )
  }
}

const streamPages = async (
  z: ZObject,
  options: FetchRequestOptions,
  actionDetails: ActionDetails,
  maxPage: number
): Promise<any[]> => {
  const stream = async (currentPage: number, shouldContinue: boolean, itemsAcc: any[]): Promise<any[]> => {
    if (!shouldContinue || currentPage > maxPage) {
      return itemsAcc
    }
    const response = await fetchNextPage(z, options, actionDetails, currentPage)
    return await stream(
      currentPage + 1,
      hasResponseNextPage(response),
      [...itemsAcc, ...response.items]
    )
  }
  return await stream(1, true, [])
}

const hasResponseNextPage = (response: ItemsWithMeta): boolean => {
  return !!(response.meta && response.meta.links && response.meta.links.next_page)
}

const fetchNextPage = async (
  z: ZObject,
  options: FetchRequestOptions,
  actionDetails: ActionDetails,
  pageNumber: number
) => {
  const response = await fetch(
    z,
    {
      ...options,
      params: {
        ...(options.params || {}),
        ...pageParameter(pageNumber)
      },
    },
    actionDetails
  )
  return unpackItemsWithMeta(response, z)
}
