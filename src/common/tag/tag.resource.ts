const TagResource = {
  key: 'tag',
  noun: 'Tag',

  sample: {
    id: 9444826,
    name: 'Elephant',
    created_at: '2017-02-13T13:33:10Z',
    updated_at: '2017-02-13T13:33:10Z',
    resource_type: 'deal',
    creator_id: 1045095
  },

  outputFields: [
    {
      key: 'name',
      label: 'Name',
      type: 'string'
    },
    {
      key: 'resource_type',
      label: 'Resource Type',
      type: 'string'
    }
  ]
}

export default TagResource
