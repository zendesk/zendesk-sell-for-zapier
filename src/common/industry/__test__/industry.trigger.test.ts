import App from '../../..'
import * as zapier from 'zapier-platform-core'
import {LeadIndustryDropdown} from '../industry.trigger'
import * as industryResponse from './industryResponse.fixture.json'
import * as nock from 'nock'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('list industries', () => {
  it('should properly fetch industries for leads', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      }
    }

    nock('https://api.getbase.com/v2/lead')
      .get('/industries')
      .query({
        per_page: 100,
        page: 1
      })
      .reply(200, industryResponse)

    const response = await appTester(App.triggers[LeadIndustryDropdown.key].operation.perform, bundle)
    expect(response).toHaveLength(6)
    expect(response[0]).toEqual({
      id: 'Aerospace & Defense',
      name: 'Aerospace & Defense',
      created_at: '2016-12-16T22:55:11Z',
      updated_at: '2017-09-29T09:59:46Z'
    })
  })
})
