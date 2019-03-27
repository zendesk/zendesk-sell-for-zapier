import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../..'
import {ProductSearch} from '../product.search'
import * as productsResponse from './multipleProducts.fixture.json'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('search products in catalog', () => {
  it('should return empty array without calling api if supported filters are not present', async () => {
    const bundle = {
      inputData: {
        'search.last_name': 'Doe',
        'search.first_name': 'Joe'
      }
    }

    const results = await appTester(App.searches[ProductSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(0)
  })

  it('should pass only supported filters to search endpoint', async () => {
    const bundle = {
      inputData: {
        'search.id': null,
        'search.name': 'Product1',
        'search.unsupported_filter': 'value',
        'search.max_discount': 90,
        'search.sku': 'sku'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/products')
      .query({
        name: 'Product1',
        sku: 'sku',
        page: 1,
        per_page: 100
      })
      .reply(200, productsResponse)

    const results = await appTester(App.searches[ProductSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(3)
  })
})
