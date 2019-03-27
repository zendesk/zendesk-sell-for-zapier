import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../..'
import {NewProductInCatalogTrigger} from '../newProductsInCatalog.trigger'
import * as productsResponse from './multipleProducts.fixture.json'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('new products from catalog trigger', () => {
  it('should fetch products sorted by created_at', async () => {
    nock('https://api.getbase.com/v2')
      .get('/products')
      .query({
        sort_by: 'created_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, productsResponse)

    const results = await appTester(App.triggers[NewProductInCatalogTrigger.key].operation.perform, {})
    expect(results).toHaveLength(3)
    expect(results.map((item: any) => item.id)).toEqual([847419, 1153049, 1159062])
  })
})
