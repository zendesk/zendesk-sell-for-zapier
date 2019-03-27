import App from '../../..'
import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as emptyResponse from './emptySourcesResponse.fixture.json'
import * as singleResponse from './singleSourceResponse.fixture.json'
import {LeadSourceSearch} from '../source.search'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('search sources', () => {
  it('should pass only supported parameters to search endpoint', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        not_matching: 123,
        name: 'Word'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/lead_sources')
      .query({
        name: 'Word',
        per_page: 100,
        page: 1
      })
      .reply(200, emptyResponse)

    const response: any = await appTester(App.searches[LeadSourceSearch.key].operation.perform, bundle)
    expect(response).not.toBeNull()
    expect(response).toHaveLength(0)
  })

  it('should call single resource endpoint if id parameter is passed', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        id: 123
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/lead_sources/123')
      .reply(200, singleResponse)

    const response: any = await appTester(App.searches[LeadSourceSearch.key].operation.perform, bundle)
    expect(response).not.toBeNull()
    expect(response).toHaveLength(1)
    expect(response[0].name).toBe('This is wunderbar')
  })
})
