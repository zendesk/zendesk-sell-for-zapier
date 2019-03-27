import {restEndpoints} from '../../utils/http'
import {searchWithPrefixedFields, streamItems} from '../../common/queries'
import {ActionDetails, triggerActionDetails} from '../../utils/operations'
import {Bundle, ZObject} from 'zapier-platform-core'
import {descendingSort} from '../../utils/api'
import {createItem, pickedFieldsProcessor, updateItem} from '../../common/createUpdate'

const productsEndpoint = restEndpoints('products')

export const searchProductsByCriteria = (actionDetails: ActionDetails, supportedFields: string[]) =>
  searchWithPrefixedFields(productsEndpoint, actionDetails, supportedFields)

export const fetchProductsTrigger = (triggerName: string, sortBy: string, supportedFilters: string[]) => {
  return async (z: ZObject, bundle: Bundle) => {
    const sort = descendingSort(sortBy)
    return await streamItems(productsEndpoint, triggerActionDetails(triggerName), supportedFilters)(z, bundle, {}, sort)
  }
}

const createUpdateFieldsProcess = pickedFieldsProcessor(['id', 'name', 'description', 'sku', 'active', 'max_discount', 'max_markup', 'cost', 'cost_currency', 'prices'])

export const createProduct = (actionDetails: ActionDetails) =>
  createItem(productsEndpoint, actionDetails, createUpdateFieldsProcess)

export const updateProduct = (actionDetails: ActionDetails) =>
  updateItem(productsEndpoint, actionDetails, createUpdateFieldsProcess)
