import {OutputField} from '../../../types'

export const productOutputFields: OutputField[] = [
  {
    key: 'id',
    label: 'Product ID'
  },
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'description',
    label: 'Description'
  },
  {
    key: 'sku',
    label: 'SKU'
  },
  {
    key: 'max_discount',
    label: 'Max Discount'
  },
  {
    key: 'max_markup',
    label: 'Max markup'
  },
  {
    key: 'cost',
    label: 'Unit Cost'
  },
  {
    key: 'cost_currency',
    label: 'Unit Cost Currency'
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
