const PipelineResource = {
  key: 'pipeline',
  noun: 'Pipeline',
  sample: {
    id: 704704,
    name: 'Sales Pipeline',
    created_at: '2016-12-07T08:09:14Z',
    updated_at: '2017-03-23T12:42:29Z',
    disabled: false
  },

  outputFields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string'
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string'
    },
    {
      key: 'disabled',
      label: 'Disabled',
      type: 'boolean'
    }
  ]
}

export default PipelineResource
