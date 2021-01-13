const SequenceResource = {
    key: 'sequence',
    noun: 'Sequence',
    sample: {
        id: 21123,
        name: 'Sequence name',
        steps_total: 1,
        creator_id: 1,
        updated_at: '2020-06-03T11:06:30Z',
        created_at: '2020-06-03T11:06:30Z',
        steps: {
            items: [
                {
                    data: {
                        id: 1,
                        action_type: 'automated_email',
                        delay_from_previous_step: 0,
                        delay_from_previous_step_unit: 'weekdays',
                        position: 0,
                        action_properties: {
                            email_template_id: 1,
                            is_reply: false
                        }
                    },
                    meta: {
                        type: 'step'
                    }
                }
            ]
        }
    },

    outputFields: [
        {
            key: 'id',
            label: 'Sequence ID',
            type: 'integer',
        },
        {
            key: 'name',
            label: 'Sequence Name',
            type: 'integer',
        },
        {
            key: 'creator_id',
            label: 'Sequence Creator',
            type: 'integer',
        }
    ]
}
export default SequenceResource

