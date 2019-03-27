import {fetchUsers} from './user.common'
import UserResource from './user.resource'
import {ZapierItem} from '../types'
import {dropdownActionDetails} from '../utils/operations'
import {userTriggers} from './keys'

const listUsersWithoutFilters =
  fetchUsers(dropdownActionDetails(userTriggers.userListDropdown))

export const ListUsersDropdown: ZapierItem = {
  key: userTriggers.userListDropdown,
  noun: 'User',

  display: {
    label: 'New User',
    description: 'Lists the users.',
    hidden: true
  },
  operation: {
    resource: UserResource.key,
    perform: listUsersWithoutFilters
  }
}
