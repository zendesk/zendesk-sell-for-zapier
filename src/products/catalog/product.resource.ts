import {productOutputFields} from './fields/productOutputFields'

export const ProductResource = {
  key: 'product',
  noun: 'Product',
  sample: {
    id: 1,
    name: 'Enterprise Plan',
    description: 'Includes more storage options',
    sku: 'enterprise-plan',
    active: true,
    prices: [
      {
        amount: '1599.99',
        currency: 'USD'
      },
      {
        amount: '3599.99',
        currency: 'PLN'
      }
    ],
    cost: '999.99',
    cost_currency: 'USD',
    max_discount: 15,
    max_markup: null,
    created_at: '2014-08-27T16:32:56Z',
    updated_at: '2014-08-27T17:32:56Z'
  },
  outputFields: productOutputFields
}
