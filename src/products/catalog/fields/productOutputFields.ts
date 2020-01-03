import {OutputField} from '../../../types'

export const productOutputFields: OutputField[] = [
  {
    key: 'id',
    label: 'Product ID',
    type: 'integer',
  },
  {
    key: 'name',
    label: 'Name',
    type: 'string',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'string',
  },
  {
    key: 'sku',
    label: 'SKU',
    type: 'string',
  },
  {
    key: 'max_discount',
    label: 'Max Discount',
    type: 'number',
  },
  {
    key: 'max_markup',
    label: 'Max markup',
    type: 'number',
  },
  {
    key: 'cost',
    label: 'Unit Cost',
    type: 'string',
  },
  {
    key: 'cost_currency',
    label: 'Unit Cost Currency',
    type: 'string',
  },
  {
    key: 'prices[]amount',
    label: 'Unit Prices Amounts'
  },
  {
    key: 'prices[]currency',
    label: 'Unit Prices Currencies'
  }
]
