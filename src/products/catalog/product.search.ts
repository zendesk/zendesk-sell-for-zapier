import {ZapierItem} from '../../types'
import {productSearches} from './keys'
import {ProductResource} from './product.resource'
import {searchPrefixedField} from '../../utils/fieldsHelpers'
import {searchActionDetails} from '../../utils/operations'
import {searchProductsByCriteria} from './common'

export const ProductSearch: ZapierItem = {
  key: productSearches.productSearchOrCreate,
  noun: 'Product',
  display: {
    label: 'Find Product in Catalog',
    description: 'Finds a product by ID, name or SKU. Requires Sell Enterprise Plan or higher.'
  },
  operation: {
    resource: ProductResource.key,
    inputFields: [
      {
        key: searchPrefixedField('id'),
        label: 'Product ID',
        required: false,
        type: 'integer'
      },
      {
        key: searchPrefixedField('name'),
        label: 'Product Name',
        required: false,
        type: 'string'
      },
      {
        key: searchPrefixedField('sku'),
        label: 'Product SKU',
        required: false,
        type: 'string'
      }
    ],
    perform: searchProductsByCriteria(
      searchActionDetails(productSearches.productSearchOrCreate),
      ['id', 'name', 'sku']
    )
  }
}
