import {ZapierItem} from '../../types'
import {createEnrollment, stopEnrollment} from '../common'
import {createActionDetails} from '../../utils/operations'
import {userSearches, userTriggers} from '../../users/keys'
import {enrollmentActions} from '../keys'
import EnrollmentResource from './enrollment.resource'

export const CreateEnrollmentAction: ZapierItem = {
    key: enrollmentActions.createEnrollmentAction,
    noun: 'Enrollment',
    display: {
        label: 'Create Enrollment',
        description: 'Creates a new enrollment.',
        important: true
    },
    operation: {
        resource: EnrollmentResource.key,
        inputFields: [
            {
                key: 'sequence_id',
                label: 'Sequence',
                type: 'integer',
                required: true
            },
            {
                key: 'lead_id',
                label: 'Lead',
                helpText: 'Zendesk Sell Lead that will be enrolled.',
                required: true,
                type: 'integer',

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
                required: true
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
