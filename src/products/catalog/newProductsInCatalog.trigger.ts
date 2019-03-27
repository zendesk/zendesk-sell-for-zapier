import {ZapierItem} from '../../types'
import {productTriggers} from './keys'
import {ProductResource} from './product.resource'
import {fetchProductsTrigger} from './common'

export const NewProductInCatalogTrigger: ZapierItem = {
  key: productTriggers.newProductInCatalog,
  noun: 'Product',
  display: {
    label: 'New Product in Catalog',
    description: 'Triggers when a new product in catalog is created. Requires Sell Enterprise Plan or higher.'
  },
  operation: {
    resource: ProductResource.key,
    perform: fetchProductsTrigger(
      productTriggers.newProductInCatalog,
      'created_at',
      []
    )
  }
}
