const UserResource = {
  key: 'user',
  noun: 'User',
  sample: {
    id: 2,
    name: 'Mark Johnson',
    email: 'mark@salesteam.com',
    status: 'active',
    invited: true,
    confirmed: true,
    role: 'user',
    created_at: '2014-08-27T16:32:56Z'
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
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'string'
    },
    {
      key: 'invited',
      label: 'Invited',
      type: 'boolean'
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      type: 'boolean'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'string'
    }
  ]
}

export default UserResource
