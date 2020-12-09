const EnrollmentResource = {
    key: 'enrollment',
    noun: 'Enrollment',
    sample: {
        id: 1,
        actor_id: 1,
        resource_type: 'lead',
        resource_id: 1,
        created_at: '2020-06-03T11:08:42Z',
        sequence: {
            data: {
                id: 2,
                name: 'Sample Sequence',
                steps_total: 1,
                creator_id: 1,
                updated_at: '2020-06-03T11:08:12Z',
                created_at: '2020-06-03T11:08:12Z'
            },
            meta: {
                type: 'sequence'
            }
        },

    },

    outputFields: [
        {
            key: 'id',
            label: 'Enrollment ID',
            type: 'integer',
        },
        {
            key: 'actor_id',
            label: 'Enrollment Actor',
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
export default EnrollmentResource

