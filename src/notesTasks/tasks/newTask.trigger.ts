import {ZapierItem} from '../../types'
import TaskResource from './task.resource'
import {Bundle, ZObject} from 'zapier-platform-core'
import {streamItems} from '../../common/queries'
import {tasksEndpoint} from '../common'
import {triggerActionDetails} from '../../utils/operations'
import {descendingSort} from '../../utils/api'
import {taskTriggers} from '../keys'

const listTasksByCreatedAt = (actionName: string) => {
  return async (z: ZObject, bundle: Bundle) => {
    const sort = descendingSort('created_at')
    return await streamItems(
      tasksEndpoint,
      triggerActionDetails(actionName),
      ['resource_type']
    )(z, bundle, {}, sort)
  }
}

export const NewTaskTrigger: ZapierItem = {
  key: taskTriggers.newTaskTrigger,
  noun: 'Task',

  display: {
    label: 'New Task',
    description: 'Triggers when a new task is created.',
    important: false
  },

  operation: {
    resource: TaskResource.key,
    inputFields: [
      {
        key: 'resource_type',
        label: 'Related to',
        type: 'string',
        choices: ['lead', 'contact', 'deal'],
        required: false
      }
    ],
    perform: listTasksByCreatedAt(taskTriggers.newTaskTrigger)
  }
}
