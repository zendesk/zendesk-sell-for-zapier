import * as zapier from 'zapier-platform-core'
import App from '../..'
import * as nock from 'nock'
import * as multipleDeals from './multipleDeals.fixture.json'
import {ListDealsDropdown, NewDealTrigger} from '../newDeal.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('new deal trigger', () => {
  it('should pass only supported params and sort deals by created_at', async () => {
    const bundle = {
      inputData: {
        name: 'Deal',
        value: 1.0
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/deals')
      .query({
        sort_by: 'created_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleDeals)

    const results = await appTester(App.triggers[NewDealTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })
})

describe('list deals dropdown', () => {
  it('should ignore data from bundle.input and fetch all deals', async () => {
    const bundle = {
      inputData: {
        name: 'Deal',
        value: 1.0
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/deals')
      .query({
        page: 1,
        per_page: 100
      })
      .reply(200, multipleDeals)

    const results = await appTester(App.triggers[ListDealsDropdown.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })
})
