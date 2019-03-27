const TaskResource = {
  key: 'task',
  noun: 'Task',
  sample: {
    id: 1,
    creator_id: 1,
    owner_id: 1,
    resource_type: 'lead',
    resource_id: 1,
    completed: true,
    completed_at: '2014-09-29T16:32:56Z',
    due_date: '2014-09-28T16:32:56Z',
    overdue: false,
    remind_at: '2014-09-29T15:32:56Z',
    content: 'Contact Tom',
    created_at: '2014-08-27T16:32:56Z',
    updated_at: '2014-08-27T17:32:56Z'
  },
  outputFields: [
    {
      key: 'id',
      label: 'Task ID'
    },
    {
      key: 'content',
      label: 'Content'
    },
    {
      key: 'creator_id',
      label: 'Creator'
    },
    {
      key: 'owner_id',
      label: 'Owner'
    },
    {
      key: 'resource_type',
      label: 'Resource Type',
    },
    {
      key: 'resource_id',
      label: 'Resource Id'
    },
    {
      key: 'due_date',
      label: 'Due Date'
    },
    {
      key: 'remind_at',
      label: 'Alert'
    },
    {
      key: 'overdue',
      label: 'Is overdue?'
    }
  ]
}

export default TaskResource
