import {HttpResponse, ZObject} from 'zapier-platform-core'
import {isForbidden, isNotFound, isRateLimitReached, isRequestInvalid} from './http'

interface ErrorDetails {
  statusCode: number,
  statusMessage: string,
  errorDetails: string[],
  query: string,
  url?: string
}

interface ErrorResponse {
  errors: {
    error: {
      details: string
    }
  }[],
  meta: {
    http_status: string
  }
}

const errorResponseFromMalformedEnvelope = (status: number, statusMessage: string, details: string): ErrorResponse => {
  return {
    errors: [{
      error: {
        details
      }
    }],
    meta: {
      http_status: statusMessage
    }
  }
}

const parseErrorResponse = (z: ZObject, response: HttpResponse): ErrorResponse => {
  const {status, content} = response
  if (isRateLimitReached(status)) {
    return errorResponseFromMalformedEnvelope(status, '429 Too Many Requests', 'You reached rate limit for Sell API')
  }
  try {
    return z.JSON.parse(content)
  } catch (e) {
    z.console.error('Error while parsing error envelope', e)
    return errorResponseFromMalformedEnvelope(status, `${status} Unexpected Error`, `Unexpected Error`)
  }
}

const extractErrorDetails = (response: ErrorResponse): string[] => response.errors.map((error) => error.error.details)

const extractStatusMessage = (response: ErrorResponse): string => response.meta.http_status

const requestQuery = (response: HttpResponse): string => {
  const {method, url} = response.request
  return !!method && !!url ? `${method} ${url}` : ''
}

export const extractErrorMessageFromEnvelope = (z: ZObject, response: HttpResponse): ErrorDetails => {
  const errorResponse = parseErrorResponse(z, response)

  return {
    statusCode: response.status,
    statusMessage: extractStatusMessage(errorResponse),
    errorDetails: extractErrorDetails(errorResponse),
    query: requestQuery(response),
    url: response.request.url
  }
}

const isProductsPrivilegesError = (statusCode: number, url?: string) => {
  return isForbidden(statusCode) && url && url.includes('/v2/products')
}

export const mainErrorMessage = (statusCode: number, errorDetails: string[], url?: string): string => {
  if (isRequestInvalid(statusCode) && errorDetails.length > 0) {
    return errorDetails.join(', ') + '.'
  } else if (isProductsPrivilegesError(statusCode, url)) {
    return 'Make sure you are an admin on Sell Enterprise Plan or higher.'
  } else if (isNotFound(statusCode)) {
    return 'Entity you are looking for doesn\'t exist.'
  }
  // 5xx and other errors
  return 'Oops, something went wrong while calling Zendesk Sell API.'
}

/**
 * Extracts all errors from Public API envelope and throws withing Error's message all details
 * in user friendly format
 */
export const formatAndThrowAPIError = (z: ZObject, response: HttpResponse): never => {
  const {statusCode, statusMessage, errorDetails, query, url} = extractErrorMessageFromEnvelope(z, response)
  const messageBuffer: string[] = []
  messageBuffer.push(mainErrorMessage(statusCode, errorDetails, url))
  messageBuffer.push(`Query: ${query}`)
  messageBuffer.push(`Status: ${statusMessage}`)
  messageBuffer.push(`Errors: ${z.JSON.stringify(errorDetails)}`)
  throw new Error(messageBuffer.join('\n'))
}
