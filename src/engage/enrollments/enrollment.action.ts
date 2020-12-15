import {ZapierItem} from '../../types'
import {createEnrollment, stopEnrollment} from '../common'
import {createActionDetails} from '../../utils/operations'
import {userSearches, userTriggers} from '../../users/keys'
import {enrollmentActions, enrollmentSearches, enrollmentTriggers, sequenceSearches, sequenceTriggers} from '../keys'
import EnrollmentResource from './enrollment.resource'

export const CreateEnrollmentAction: ZapierItem = {
    key: enrollmentActions.createEnrollmentAction,
    noun: 'Enrollment',
    display: {
        label: 'Create Enrollment',
        description: 'Creates a new enrollment in catalog. Requires Reach subscription.'
    },
    operation: {
        resource: EnrollmentResource.key,
        inputFields: [
            {
                key: 'sequence_id',
                label: 'Sequence',
                type: 'integer',
                required: true,
                dynamic: `${sequenceTriggers.sequenceListDropdown}.id.name`,
                search: `${sequenceSearches.sequenceSearch}.id`,
            },
            {
                key: 'sell_resource',
                label: 'Sell Resource',
                children: [
                    {
                        key: 'resource_id',
                        label: 'Lead',
                        helpText: 'Zendesk Sell Lead that will be enrolled.',
                        required: true,
                        type: 'integer',

                    },
                    {
                        key: 'resource_type',
                        label: 'Resource Type',
                        choices: ['lead'],
                        type: 'string',
                        required: true
                    }
                ]
            },
            {
                key: 'actor_id',
                label: 'Owner',
                helpText: 'Zendesk Sell User that will be an actor for enrollment.',
                required: false,
                type: 'integer',
                dynamic: `${userTriggers.userListDropdown}.id.name`,
                search: `${userSearches.userSearch}.id`
            }
        ],
        perform: createEnrollment(
            createActionDetails(enrollmentActions.createEnrollmentAction)
        )
    }
}

export const StopEnrollmentAction: ZapierItem = {
    key: enrollmentActions.stopEnrollmentAction,
    noun: 'Enrollment',
    display: {
        label: 'Stop Enrollment',
        description: 'Stops enrollment for given lead.',
    },
    operation: {
        resource: EnrollmentResource.key,
        inputFields: [
            {
                key: 'id',
                label: 'Enrollment',
                type: 'integer',
                required: true,
                dynamic: `${enrollmentTriggers.enrollmentListDropdown}.id.name`,
                search: `${enrollmentSearches.enrollmentSearch}.id`,
            },
            {
                key: 'state',
                label: 'Enrollment State',
                choices: ['finished'],
                type: 'string',
                required: true
            }
        ],
        perform: stopEnrollment(
            createActionDetails(enrollmentActions.stopEnrollmentAction)
        )
    }
}
