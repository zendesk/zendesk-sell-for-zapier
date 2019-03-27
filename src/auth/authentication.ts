import {Bundle, HttpRequestOptions, ZObject} from 'zapier-platform-core'
import {appendHeader, fetch, restEndpoints, rootUrl} from '../utils/http'
import {authActionDetails} from '../utils/operations'
import {includes} from 'lodash'

interface AccessTokenItem {
  access_token: string,
  refresh_token: string
}

interface User {
  id: number,
  name: string,
  email: string
}

interface OAuthRequestHeaders {
  'content-type': string,
  Authorization: string
}

const authorizeEndpoint = `${rootUrl()}/oauth2/authorize`
const tokenEndpoint = `${rootUrl()}/oauth2/token`

const base64Credentials = (): string => {
  return Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
}

const oauthRequestHeaders = (): OAuthRequestHeaders => ({
  'content-type': 'application/x-www-form-urlencoded',
  'Authorization': `Basic ${base64Credentials()}`
})

const getAccessToken = async (z: ZObject, bundle: Bundle): Promise<AccessTokenItem> => {
  const response = await fetch(
    z,
    {
      url: tokenEndpoint,
      method: 'POST',
      body: {
        code: bundle.inputData.code,
        grant_type: 'authorization_code'
      },
      headers: {
        ...oauthRequestHeaders()
      }
    },
    authActionDetails('fetch_access_token')
  )

  if (response.status !== 200) {
    throw new Error(`OAuth2 error: Unable to fetch access token: ${response.content}`)
  }

  const result = z.JSON.parse(response.content)
  return {
    access_token: result.access_token,
    refresh_token: result.refresh_token
  }
}

const refreshAccessToken = async (z: ZObject, bundle: Bundle): Promise<AccessTokenItem> => {
  const response = await fetch(
    z,
    {
      url: tokenEndpoint,
      method: 'POST',
      body: {
        refresh_token: bundle.authData.refresh_token,
        grant_type: 'refresh_token'
      },
      headers: {
        ...oauthRequestHeaders()
      }
    },
    authActionDetails('refresh_access_token')
  )

  if (response.status !== 200) {
    throw new Error(`OAuth2 error: Unable to refresh access token: ${response.content}`)
  }

  const result = z.JSON.parse(response.content)
  return {
    access_token: result.access_token,
    refresh_token: result.refresh_token
  }
}

const authenticationValidation = async (z: ZObject): Promise<User> => {
  const response = await fetch(
    z,
    {
      url: restEndpoints('users/self')
    },
    authActionDetails('authentication_validation')
  )

  if (response.status !== 200) {
    throw new Error(`OAuh2 error: The access token you supplied is not valid: ${response.content}`)
  }
  return z.JSON.parse(response.content).data
}

export const authentication = {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: {
      url: authorizeEndpoint,
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code'
      }
    },
    getAccessToken,
    refreshAccessToken,
    autoRefresh: true
  },
  test: authenticationValidation,
  connectionLabel: '{{name}}'
}

/**
 * Adds Authorization Bearer to HTTP headers
 */
export const apiTokenBearer = (request: HttpRequestOptions, z: ZObject, bundle: Bundle) => {
  // Don't attach access_token in header when performing OAuth2 flow
  if (includes([authorizeEndpoint, tokenEndpoint], request.url)) {
    return request
  }
  // Add access_token only if it's available
  if (bundle.authData.access_token) {
    appendHeader(request, 'Authorization', `Bearer ${bundle.authData.access_token}`)
  }
  return request
}
