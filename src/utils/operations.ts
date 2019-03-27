import applicationVersion from '../version'
import {randomBytes} from 'crypto'
import {HttpRequestOptions} from 'zapier-platform-core'
import {pickBy, startsWith} from 'lodash'
import {appendHeader} from './http'
import {singPayload} from './jwtTools'

export interface ActionDetails {
  actionType: ActionType,
  actionName: string,
  actionId: string
}

export enum ActionType {
  Create = 'create',
  Trigger = 'trigger',
  Search = 'search',
  Dropdown = 'dropdown',
  OAuth2 = 'oauth2'
}

interface OperationHttpHeaders {
  'X-Clientapp-Operation-Type': ActionType,
  'X-Clientapp-Operation-Name': string,
  'X-Clientapp-Operation-Id': string
}

const randomActionId = () => randomBytes(16).toString('hex')

const operationDetailsHeaders = (actionDetails?: ActionDetails): OperationHttpHeaders | {} => {
  if (!actionDetails) {
    return {}
  }

  return {
    'X-Clientapp-Operation-Type': actionDetails.actionType,
    'X-Clientapp-Operation-Name': actionDetails.actionName,
    'X-Clientapp-Operation-Id': actionDetails.actionId
  }
}

const details = (type: ActionType, name: string): ActionDetails => ({
  actionType: type,
  actionName: name,
  actionId: randomActionId()
})

export const createActionDetails = (name: string): ActionDetails => details(ActionType.Create, name)
export const triggerActionDetails = (name: string): ActionDetails => details(ActionType.Trigger, name)
export const searchActionDetails = (name: string): ActionDetails => details(ActionType.Search, name)
export const authActionDetails = (name: string): ActionDetails => details(ActionType.OAuth2, name)
export const dropdownActionDetails = (name: string): ActionDetails => details(ActionType.Dropdown, name)

export type FetchRequestOptions = HttpRequestOptions & { url: string }

export const extractHeaders = (options: FetchRequestOptions, actionDetails?: ActionDetails): FetchRequestOptions => {
  return {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...operationDetailsHeaders(actionDetails)
    }
  }
}

export const applicationMetadataAppender = (request: HttpRequestOptions): HttpRequestOptions => {
  appendHeader(request, 'X-Clientapp-Version', applicationVersion)
  appendHeader(request, 'X-Clientapp-Name', 'Zapier')
  return request
}

export const appSignatureAppender = (request: HttpRequestOptions): HttpRequestOptions => {
  const headersToBeSigned = pickBy(request.headers, (v, k) => startsWith(k, 'X-Clientapp'))
  appendHeader(request, 'X-Clientapp-Signature', singPayload(headersToBeSigned))
  return request
}
