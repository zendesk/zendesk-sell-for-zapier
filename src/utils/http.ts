import {HttpRequestOptions, HttpResponse, ZObject} from 'zapier-platform-core'
import {formatAndThrowAPIError} from './errors'
import {ActionDetails, extractHeaders, FetchRequestOptions} from './operations'
import {includes} from 'lodash'

const between = (status: number, minInclusive: number, maxInclusive: number) =>
  status >= minInclusive && status <= maxInclusive

export const isSuccessful = (status: number): boolean => between(status, 200, 299)
export const isNotFound = (status: number): boolean => status === 404
export const isRequestInvalid = (status: number): boolean => includes([400, 422], status)
export const isForbidden = (status: number): boolean => status === 403
export const isRateLimitReached = (status: number): boolean => status === 429

export const rootUrl = (): string => {
  return process.env.SELL_API_URL || 'https://api.getbase.com'
}

export interface ItemsWithMeta {
  items: object[],
  meta: {
    type: string,
    count: number,
    links: {
      self?: string,
      first_page?: string,
      prev_page?: string,
      next_page?: string
    }
  }
}

/**
 * Unpacks items from Sell API response envelope if the status code is 2xx.
 * {items: [{data: {id: 1}}] -> [{id: 1}]
 *
 * More details here: https://developers.getbase.com/docs/rest/articles/responses
 */
export const unpackItemsResponse = (response: HttpResponse, z: ZObject): object[] => {
  if (isSuccessful(response.status)) {
    const payload: any[] = z.JSON.parse(response.content).items
    return payload.map(item => item.data)
  }
  return formatAndThrowAPIError(z, response)
}

/**
 * Unpacks items from Sell API response envelope if the status code is 2xx.
 * Additionally includes meta information from the envelope.
 *
 * More details here: https://developers.getbase.com/docs/rest/articles/responses
 */
export const unpackItemsWithMeta = (response: HttpResponse, z: ZObject): ItemsWithMeta => {
  if (isSuccessful(response.status)) {
    const payload = z.JSON.parse(response.content)
    return {
      items: payload.items.map((item: any) => item.data),
      meta: payload.meta
    }
  }
  return formatAndThrowAPIError(z, response)
}

/**
 * Unpacks single item from Sell API response envelope if the status code is 2xx.
 * {data: {id: 1}} => {id: 1}
 *
 * More details here: https://developers.getbase.com/docs/rest/articles/responses
 */
export const unpackSingleItemResponse = (response: HttpResponse, z: ZObject) => {
  if (isSuccessful(response.status)) {
    return z.JSON.parse(response.content).data
  }
  return formatAndThrowAPIError(z, response)
}


/**
 * Unpacks single item from Sell API response envelope and returns wrapped with an array.
 * If item doesn't exist empty array is returned.
 *
 * More details here: https://developers.getbase.com/docs/rest/articles/responses
 */
export const unpackItemResponseAsArray = (z: ZObject, response: HttpResponse): any[] => {
  const {status} = response
  if (isSuccessful(status)) {
    return [unpackSingleItemResponse(response, z)]
  }
  if (isNotFound(status)) {
    return []
  }
  return formatAndThrowAPIError(z, response)
}

export const isResourcePresentInResponse = (z: ZObject, response: HttpResponse): boolean => {
  const {status} = response
  if (isSuccessful(status)) {
    return true
  }
  if (isNotFound(status)) {
    return false
  }
  return formatAndThrowAPIError(z, response)
}

export const appendHeader = (request: HttpRequestOptions, name: string, value: string): HttpRequestOptions => {
  if (!request.headers) {
    request.headers = {}
  }
  request.headers[name] = value
  return request
}

/**
 * Use this function for requests instead of z.request() directly -
 * it adds headers which identifies where request comes from
 */
export const fetch = async (
  z: ZObject,
  options: FetchRequestOptions,
  actionDetails?: ActionDetails
): Promise<HttpResponse> => {
  const newOptions = extractHeaders(options, actionDetails)
  return await z.request(newOptions)
}

export const restEndpoints = (resource: string): string => `${rootUrl()}/v2/${resource}`
export const restBetaEndpoints = (resource: string): string => `https://app.futuresimple.com/apis/engage/api/v1/${resource}`
