import {productActions} from './keys'
import {ProductResource} from './product.resource'
import {productCommonFields, productIdField} from './fields/productInputFields'
import {ZapierItem} from '../../types'
import {createProduct, updateProduct} from './common'
import {createActionDetails} from '../../utils/operations'

export const CreateProductAction: ZapierItem = {
  key: productActions.createProductAction,
  noun: 'Product',
  display: {
    label: 'Create Product in Catalog',
    description: 'Creates a new product in catalog. Requires Sell Enterprise Plan or higher.'
  },
  operation: {
    resource: ProductResource.key,
    inputFields: productCommonFields(true),
    perform: createProduct(createActionDetails(productActions.createProductAction))
  }
}

export const UpdateProductAction: ZapierItem = {
  key: productActions.updateProductAction,
  noun: 'Product',
  display: {
    label: 'Update Product in Catalog',
    description: 'Updates an existing product in catalog. Requires Sell Enterprise Plan or higher.'
  },
  operation: {
    resource: ProductResource.key,
    inputFields: [
      productIdField,
      ...productCommonFields(true)
    ],
    perform: updateProduct(createActionDetails(productActions.updateProductAction))
  }
}
