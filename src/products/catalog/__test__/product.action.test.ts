import * as zapier from 'zapier-platform-core'
import App from '../../..'
import * as nock from 'nock'
import {CreateProductAction, UpdateProductAction} from '../product.action'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('create product action', () => {
  it('should pass if product is properly created', async () => {
    const bundle = {
      inputData: {
        name: 'Product1',
        sku: 'Value',
        prices: [
          {
            amount: 100.10,
            currency: 'USD'
          }
        ]
      }
    }

    nock('https://api.getbase.com/v2')
      .post('/products', {
        data: {
          name: 'Product1',
          sku: 'Value',
          prices: [
            {
              amount: 100.10,
              currency: 'USD'
            }
          ]
        }
      })
      .reply(200, {data: {id: 1000}})

    const response: any = await appTester(App.creates[CreateProductAction.key].operation.perform, bundle)
    expect(response.id).toEqual(1000)
  })
})

describe('update product action', () => {
  it('should pass if product is properly updated', async () => {
    const bundle = {
      inputData: {
        id: 1000,
        sku: 'newSKU'
      }
    }

    nock('https://api.getbase.com/v2')
      .put('/products/1000', {
        data: {
          sku: 'newSKU',
        }
      })
      .reply(200, {data: {id: 1000}})

    const response: any = await appTester(App.creates[UpdateProductAction.key].operation.perform, bundle)
    expect(response.id).toEqual(1000)
  })
})
