import {productActions, productSearches} from './keys'

export const ProductSearchOrCreate = {
  key: productSearches.productSearchOrCreate,
  display: {
    label: 'Find or Create Product in Catalog',
    description: 'Finds a product by ID, name or SKU. Optionally, create one if none are found. Requires Sell Enterprise Plan or higher.'
  },
  search: productSearches.productSearchOrCreate,
  create: productActions.createProductAction
}
