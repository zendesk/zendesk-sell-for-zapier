import {searchUsersByCriteria} from './user.common'
import UserResource from './user.resource'
import {ZapierItem} from '../types'
import {searchActionDetails} from '../utils/operations'
import {userSearches} from './keys'

const searchSupportedFilters = ['name', 'email']

const searchContacts =
  searchUsersByCriteria(searchActionDetails(userSearches.userSearch), searchSupportedFilters)

export const UserSearch: ZapierItem = {
  key: userSearches.userSearch,
  noun: 'User',
  display: {
    label: 'Find User',
    description: 'Finds a user by ID, email or name.'
  },
  operation: {
    resource: UserResource.key,
    inputFields: [
      {
        key: 'id',
        label: 'User ID',
        required: false,
        type: 'integer'
      },
      {
        key: 'name',
        label: 'Full Name',
        required: false,
        type: 'string',
      },
      {
        key: 'email',
        label: 'Email',
        required: false,
        type: 'string'
      }
    ],
    perform: searchContacts
  }
}
