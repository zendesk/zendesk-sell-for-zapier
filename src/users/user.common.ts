import {restEndpoints} from '../utils/http'
import {ActionDetails} from '../utils/operations'
import {fetchItems, searchByCriteria} from '../common/queries'

const usersEndpoint = restEndpoints('users')

/**
 * Fetch users without applying any additional filters
 */
export const fetchUsers = (actionDetails: ActionDetails) =>
  fetchItems(usersEndpoint, actionDetails)

/**
 * Searches users using only supported fields
 */
export const searchUsersByCriteria = (actionDetails: ActionDetails, supportedFilters: string[]) =>
  searchByCriteria(usersEndpoint, actionDetails, supportedFilters)
