import {Bundle, HttpRequestOptions, HttpResponse, ZObject} from 'zapier-platform-core'
import {ActionDetails, ActionType} from './operations'

/**
 * This file contains fakes which makes testing easier. Use those fake instead of mocking Zapier types directly
 */

/**
 * Creates bundle with predefined properties, it makes testing easier than mocking Bundle
 */
export const createFakeBundle = (inputData: { [x: string]: any }, meta: object = {}): Bundle => {
  return {
    authData: {},
    inputData,
    inputDataRaw: inputData,
    meta: {
      frontend: false,
      prefill: false,
      hydrate: false,
      test_poll: false,
      standard_poll: true,
      first_poll: false,
      limit: 1,
      page: 1,
      ...meta
    }
  }
}

/**
 * Create fake response compliant with HttpResponse type
 */
export const createFakeHttpResponse = (status: number, content: string | object, request: HttpRequestOptions = {}): HttpResponse => {
  const stringifiedContent = typeof(content) === 'object' ? JSON.stringify(content) : content
  return {
    status,
    content: stringifiedContent,
    headers: {},
    getHeader: (key: string) => undefined,
    throwForStatus: () => ({}),
    request
  }
}

interface FakeZObject extends ZObject {
  url: (index?: number) => string | null | undefined,
  options: (index?: number) => HttpRequestOptions | null | undefined
  count: () => number
}

/**
 * Creates fake ZObject which returns the same response on every call. Additionally counts all request calls.
 * @param status
 * @param payload
 */
export const createFakeZObject = (status: number, payload: object): FakeZObject => {
  let usedOptions: HttpRequestOptions | undefined
  let count = 0

  return {
    request: async (options: HttpRequestOptions) => {
      usedOptions = options
      count += 1
      return createFakeHttpResponse(status, payload)
    },
    JSON: {
      parse: JSON.parse,
      stringify: JSON.stringify
    },
    url: () => usedOptions && usedOptions.url,
    options: () => usedOptions,
    count: () => count
  } as FakeZObject
}

/**
 * Creates fake ZObject which returns different responses based on order of calling request method. Additionally counts all request calls.
 */
export const createMappingZObject = (responses: Array<[number, object]>): FakeZObject => {
  let counter = 0
  const usedOptions: HttpRequestOptions[] = []

  return {
    request: async (options: HttpRequestOptions) => {
      usedOptions.push(options)
      const [status, payload] = responses[counter++]
      return createFakeHttpResponse(status, payload)
    },
    JSON: {
      parse: JSON.parse,
      stringify: JSON.stringify
    },
    url: (index: number) => usedOptions[index] && usedOptions[index].url,
    options: (index: number) => usedOptions[index],
    count: () => counter
  } as FakeZObject
}

export const createFakeActionDetails = (): ActionDetails =>
  ({actionType: ActionType.Create, actionName: 'action_name', actionId: 'asdf1234'})
