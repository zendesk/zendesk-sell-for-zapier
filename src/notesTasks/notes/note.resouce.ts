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
      label: 'Note ID'
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
      key: 'resource_type',
      label: 'Resource Type',
    },
    {
      key: 'resource_id',
      label: 'Resource Id'
    }
  ]
}

export default NoteResource
