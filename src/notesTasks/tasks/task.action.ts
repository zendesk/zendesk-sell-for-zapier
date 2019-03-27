import {ZapierItem} from '../../types'
import {createTaskNoteResource, dynamicResourceField, resourceChoices, tasksEndpoint} from '../common'
import TaskResource from './task.resource'
import {createActionDetails} from '../../utils/operations'
import {userSearches, userTriggers} from '../../users/keys'
import {taskActions} from '../keys'

export const CreateTaskAction: ZapierItem = {
  key: taskActions.createTaskAction,
  noun: 'Task',
  display: {
    label: 'Create Task',
    description: 'Creates a new task.',
    important: true
  },
  operation: {
    resource: TaskResource.key,
    inputFields: [
      {
        key: 'content',
        label: 'Task Content',
        type: 'text',
        required: true
      },
      {
        key: 'owner_id',
        label: 'Owner',
        helpText: 'Zendesk Sell User that the task should be assigned to.',
        required: false,
        type: 'integer',
        dynamic: `${userTriggers.userListDropdown}.id.name`,
        search: `${userSearches.userSearch}.id`
      },
      {
        key: 'due_date',
        label: 'Due Date',
        required: false,
        type: 'datetime'
      },
      {
        key: 'remind_at',
        label: 'Alert',
        helpText: 'Date and time that Zendesk Sell should send owner of the task a reminder.',
        required: false,
        type: 'datetime'
      },
      {
        key: 'resource_type',
        label: 'Related to',
        helpText: 'Leave blank for task not related to any lead, contact or deal.',
        type: 'string',
        choices: resourceChoices,
        required: false,
        altersDynamicFields: true
      },
      dynamicResourceField
    ],
    perform: createTaskNoteResource(
      tasksEndpoint,
      createActionDetails(taskActions.createTaskAction),
      ['content', 'owner_id', 'resource_id'],
      ['due_date', 'remind_at']
    )
  }
}
