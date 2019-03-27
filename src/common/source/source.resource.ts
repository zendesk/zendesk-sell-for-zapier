const SourceResource = {
  key: `source`,
  noun: 'Source',

  sample: {
    id: 3752818,
    created_at: '2016-12-07T08:09:14Z',
    updated_at: '2016-12-07T08:09:14Z',
    name: 'Our website',
    creator_id: 1045095,
    resource_type: 'lead'
  },

  outputFields: [
    {
      key: 'id',
      label: 'ID',
      type: 'integer'
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string'
    }
  ]
}

export default SourceResource
