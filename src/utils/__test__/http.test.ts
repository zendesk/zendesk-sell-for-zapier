import { appendHeader, isResourcePresentInResponse } from '../http'
import { createFakeHttpResponse, createFakeZObject } from '../testHelpers'
import { HttpRequestOptions } from 'zapier-platform-core'

describe('isResourcePresentInResponse', () => {
  const z = createFakeZObject(200, {})

  it('should return true for successful response', () => {
    const response = createFakeHttpResponse(200, 'json')
    expect(isResourcePresentInResponse(z, response)).toBe(true)
  })

  it('should return false for 404 response', () => {
    const response = createFakeHttpResponse(404, 'json')
    expect(isResourcePresentInResponse(z, response)).toBe(false)
  })

  it('should return false for 404 response with skipThrowForStatus set', () => {
    const response = createFakeHttpResponse(404, 'json')
    response.skipThrowForStatus = true
    expect(isResourcePresentInResponse(z, response)).toBe(false)
  })

  it('should throw error when other status code is returned', () => {
    const response = createFakeHttpResponse(422, 'error')
    expect(() => isResourcePresentInResponse(z, response)).toThrowError()
  })
})

describe('appendHeader', () => {
  it('should pass if headers are not present in request', () => {
    const request: HttpRequestOptions = {}
    const updatedRequest = appendHeader(request, 'X-Header-Something', 'Value')
    expect(updatedRequest.headers).toEqual({ 'X-Header-Something': 'Value' })
  })

  it('should append new header to existing ones', () => {
    const request: HttpRequestOptions = {
      headers: { Authorization: 'Bearer 1234' },
    }
    const updatedRequest = appendHeader(request, 'X-Header-Something', 'Value')
    expect(updatedRequest.headers).toEqual({
      'X-Header-Something': 'Value',
      Authorization: 'Bearer 1234',
    })
  })
})
