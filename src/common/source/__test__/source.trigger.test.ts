import App from '../../..'
import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as sourcesResponse from './sourcesResponse.fixture.json'
import {DealSourceDropdownList} from '../source.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('list sources', () => {
  it('should return sources for successful call to sources API', async () => {
    const bundle = {
      authData: {
        api_token: 'api token',
        name: 'name'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/deal_sources')
      .query({
        per_page: 100,
        page: 1
      })
      .reply(200, sourcesResponse)

    const response: any = await appTester(App.triggers[DealSourceDropdownList.key].operation.perform, bundle)
    expect(response).toHaveLength(3)
    expect(response.map((item: any) => item.name)).toEqual(['Our website', 'Word of mouth', 'Referral'])
  })
})


