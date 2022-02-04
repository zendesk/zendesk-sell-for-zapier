import * as nock from 'nock'
import * as zapier from 'zapier-platform-core'
import { Bundle, ZObject } from 'zapier-platform-core'
import App from '../..'
import * as accessToken from './accessToken.fixture.json'
import * as refreshToken from './refreshToken.fixture.json'
import { createFakeBundle } from '../../utils/testHelpers'
import { apiTokenBearer } from '../authentication'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

const clientId = '1234566890'
const clientSecret = 'secret'

const authorizationBase64Header = {
  Authorization: 'Basic MTIzNDU2Njg5MDpzZWNyZXQ=',
  'content-type': 'application/x-www-form-urlencoded',
}

describe('OAuth2 flow', () => {
  beforeEach(() => {
    process.env.CLIENT_ID = clientId
    process.env.CLIENT_SECRET = clientSecret
  })

  it('Step 1 - generate an authorize url', async () => {
    const bundle = {
      inputData: {
        state: '1234',
        redirect_uri: 'http://zapier.com',
      },
    }

    const authenticationUrl = await appTester(
      // @ts-ignore TS doesn't understand OAuth2 schema
      App.authentication.oauth2Config.authorizeUrl,
      bundle
    )
    expect(authenticationUrl).toEqual(
      'https://api.getbase.com/oauth2/authorize?client_id=1234566890&state=1234&redirect_uri=http%3A%2F%2Fzapier.com&response_type=code'
    )
  })

  it('Step 2 - fetches access token', async () => {
    const bundle = {
      inputData: {
        code: 'one-time-code',
      },
    }

    nock('https://api.getbase.com', { reqheaders: authorizationBase64Header })
      .post('/oauth2/token', 'code=one-time-code&grant_type=authorization_code')
      .reply(200, accessToken)

    const response = await appTester(
      App.authentication.oauth2Config.getAccessToken,
      bundle
    )
    expect(response).toEqual({
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
    })
  })

  it('Step 2 - throws exception when different code than 200 is returned', async () => {
    const bundle = {
      inputData: {
        code: 'one-time-code',
      },
    }

    nock('https://api.getbase.com', { reqheaders: authorizationBase64Header })
      .post('/oauth2/token', 'code=one-time-code&grant_type=authorization_code')
      .reply(401, { error: 'invalid_client' })

    try {
      await appTester(App.authentication.oauth2Config.getAccessToken, bundle)
    } catch (e: any) {
      expect(e.message).toContain('401')
    }
  })

  it('Step 3 - refreshes access token', async () => {
    const bundle = {
      authData: {
        access_token: 'old_access_token',
        refresh_token: 'old_refresh_token',
      },
    }

    nock('https://api.getbase.com', { reqheaders: authorizationBase64Header })
      .post(
        '/oauth2/token',
        'refresh_token=old_refresh_token&grant_type=refresh_token'
      )
      .reply(200, refreshToken)

    const response = await appTester(
      App.authentication.oauth2Config.refreshAccessToken,
      bundle
    )
    expect(response).toEqual({
      access_token: 'refreshed_access_token',
      refresh_token: 'refreshed_refresh_token',
    })
  })
})

describe('apiTokenBearer', () => {
  const z = {} as ZObject

  const createBundleWithAccessToken = (token: string): Bundle => {
    const bundle = createFakeBundle({})
    bundle.authData = { access_token: token }
    return bundle
  }

  it('should not add auth bearer if calling token endpoint', () => {
    const bundle = createBundleWithAccessToken('1234')
    const request = { url: 'https://api.getbase.com/oauth2/token' }

    const updatedRequest = apiTokenBearer(request, z, bundle)
    expect(updatedRequest.headers).toBeUndefined()
  })

  it('should not add auth bearer if access_token is not present', () => {
    const bundle = createFakeBundle({})
    const request = { url: 'https://api.getbase.com/v2/contacts' }

    const updatedRequest = apiTokenBearer(request, z, bundle)
    expect(updatedRequest.headers).toBeUndefined()
  })

  it('should add auth bearer when calling resources endpoint', () => {
    const bundle = createBundleWithAccessToken('1234')
    const request = { url: 'https://api.getbase.com/v2/contacts' }

    const updatedRequest = apiTokenBearer(request, z, bundle)
    expect(updatedRequest.headers).toEqual({ Authorization: 'Bearer 1234' })
  })
})
