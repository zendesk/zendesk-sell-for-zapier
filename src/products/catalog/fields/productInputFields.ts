import {currencies} from '../../../common/currencies'

export const productCommonFields = (isNew: boolean) => [
  {
    key: 'name',
    label: 'Name',
    required: isNew,
    type: 'string'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'string'
  },
  {
    key: 'sku',
    label: 'SKU',
    type: 'string'
  },
  {
    key: 'active',
    label: 'Active',
    helpText: 'Indicator of whether or not the product can be added to a deal.',
    type: 'boolean'
  },
  {
    key: 'max_discount',
    label: 'Max Discount',
    helpText: 'Maximum discount (0-100) that can be applied to the product, e.g. put 20 if it\'s 20%.',
    type: 'integer'
  },
  {
    key: 'max_markup',
    label: 'Max Markup',
    helpText: 'Maximum markup that can be applied to the product, e.g. put 10 if it\'s 10%.',
    type: 'integer'
  },
  {
    key: 'cost',
    label: 'Unit Cost',
    helpText: 'Cost of the product. Visible only to account administrators.',
    type: 'number'
  },
  {
    key: 'cost_currency',
    label: 'Unit Cost Currency',
    helpText: 'Currency of the product cost, specified in 3-character currency code (ISO4217) format. Visible only to account administrators.',
    type: 'string',
    choices: currencies
  },
  {
    key: 'prices',
    label: 'Unit Prices',
    children: [
      {
        key: 'placeholder',
        type: 'copy',
        helpText: 'Need multiple prices for different currencies? Read more about [Zapier Line Items.](https://zapier.com/help/line-items/)'
      },
      {
        key: 'amount',
        label: 'Unit Price',
        type: 'number',
        required: isNew
      },
      {
        key: 'currency',
        label: 'Currency',
        type: 'string',
        choices: currencies,
        required: isNew
      }
    ]

  }
]

export const productIdField = {
  key: 'id',
  label: 'Product',
  required: true,
  type: 'integer'
}
