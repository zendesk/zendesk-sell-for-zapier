const StageResource = {
  key: 'stage',
  noun: 'Stage',
  sample: {
    id: 111111,
    name: 'Qualified',
    category: 'incoming',
    position: 3,
    likelihood: 20,
    active: true,
    pipeline_id: 2222222,
    created_at: '2016-12-07T08:09:14Z',
    updated_at: '2017-03-23T12:42:21Z'
  },

  outputFields: [
    {
      key: 'id',
      label: 'Stage ID',
      type: 'integer'
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'string'
    },
    {
      key: 'position',
      label: 'Position',
      type: 'integer'
    },
    {
      key: 'likelihood',
      label: 'Likelihood',
      type: 'integer'
    },
    {
      key: 'active',
      label: 'Active',
      type: 'boolean'
    }
  ]
}

export default StageResource
