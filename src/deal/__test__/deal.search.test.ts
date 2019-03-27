import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../..'
import * as multipleDeals from './multipleDeals.fixture.json'
import {DealSearch} from '../deal.search'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('deal search', () => {
  it('should pass only not empty and supported filters to deals endpoint', async () => {
    const bundle = {
      inputData: {
        'search.id': null,
        'search.name': 'Deal 1',
        'search.somethingWrong': 'wrong'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/deals')
      .query({
        name: 'Deal 1',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleDeals)

    const results = await appTester(App.searches[DealSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    expect(results[0]).toHaveProperty('name', 'Deal 1')
  })
})
