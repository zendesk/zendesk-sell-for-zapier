const NoteResource = {
  key: 'note',
  noun: 'Note',
  sample: {
    id: 1,
    creator_id: 1,
    resource_type: 'lead',
    resource_id: 1,
    content: 'Highly important.',
    created_at: '2014-08-27T16:32:56Z',
    updated_at: '2014-08-27T17:32:56Z'
  },
  outputFields: [
    {
      key: 'id',
      label: 'Note ID',
      type: 'integer',
    },
    {
      key: 'content',
      label: 'Content',
      type: 'text',
    },
    {
      key: 'creator_id',
      label: 'Creator',
      type: 'integer',
    },
    {
      key: 'resource_type',
      label: 'Resource Type',
      type: 'string',
    },
    {
      key: 'resource_id',
      label: 'Resource Id',
      type: 'integer',
    }
  ]
}

export default NoteResource
