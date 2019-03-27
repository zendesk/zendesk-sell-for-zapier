import {createFakeHttpResponse, createFakeZObject} from '../testHelpers'
import {extractErrorMessageFromEnvelope, formatAndThrowAPIError, mainErrorMessage} from '../errors'
import * as errorResponse from './errorResponse.fixture.json'
import * as productsErrorResponse from './productsErrorResponse.fixture.json'

describe('extractErrorMessageFromEnvelope', () => {
  it('should fetch details from error response', () => {
    const fakeResponse = createFakeHttpResponse(
      400,
      errorResponse,
      {url: 'https://api.getbase.com/v2/leads?per_page=200', method: 'GET'}
    )
    const fakeZObject = createFakeZObject(400, errorResponse)

    const errorDetails = extractErrorMessageFromEnvelope(fakeZObject, fakeResponse)
    expect(errorDetails).toEqual({
      statusCode: 400,
      statusMessage: '400 Bad Request',
      errorDetails: [
        'The request query parameter \'per_page\' is malformed, missing, or has an invalid value (must be between 1 and 100, given: 200)'
      ],
      query: 'GET https://api.getbase.com/v2/leads?per_page=200',
      url: 'https://api.getbase.com/v2/leads?per_page=200'
    })
  })
})

describe('formatAndThrowAPIError', () => {
  it('should fetch details from 400 error response', () => {
    const fakeResponse = createFakeHttpResponse(
      400,
      errorResponse,
      {url: 'https://api.getbase.com/v2/leads?per_page=200', method: 'GET'}
    )
    const fakeZObject = createFakeZObject(400, errorResponse)
    expect(() => formatAndThrowAPIError(fakeZObject, fakeResponse)).toThrow(
      'The request query parameter \'per_page\' is malformed, missing, or has an invalid value (must be between 1 and 100, given: 200)'
    )
  })

  it('should fetch details from 403 products error response', () => {
    const fakeResponse = createFakeHttpResponse(
      403,
      productsErrorResponse,
      {url: 'https://api.getbase.com/v2/products', method: 'GET'}
    )
    const fakeZObject = createFakeZObject(403, productsErrorResponse)
    expect(() => formatAndThrowAPIError(fakeZObject, fakeResponse)).toThrow(
      'Make sure you are an admin on Sell Enterprise Plan or higher.'
    )
  })
})

describe('mainErrorMessage', () => {
  it('should return error messages from envelope for 422 code', () => {
    const results = mainErrorMessage(422, ['Field 1 is wrong', 'Field 2 is also wrong'])
    expect(results).toEqual('Field 1 is wrong, Field 2 is also wrong.')
  })

  it('should return generic error message for 5xx codes', () => {
    const results = mainErrorMessage(500, ['Internal Server Error'])
    expect(results).toEqual('Oops, something went wrong while calling Zendesk Sell API.')
  })

  it('should return custom message for 403 coming from products endpoint', () => {
    const results = mainErrorMessage(403, [], 'https://api.getbase.com/v2/products')
    expect(results).toEqual('Make sure you are an admin on Sell Enterprise Plan or higher.')
  })

  it('should return not found message for 404 code', () => {
    const results = mainErrorMessage(404, [])
    expect(results).toEqual('Entity you are looking for doesn\'t exist.')
  })
})
