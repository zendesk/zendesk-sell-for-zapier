import {ZapierItem} from '../../types'
import {createEnrollment, stopEnrollment, stopAllEnrollments} from '../common'
import {createActionDetails} from '../../utils/operations'
import {userSearches, userTriggers} from '../../users/keys'
import {enrollmentActions, enrollmentSearches, enrollmentTriggers, sequenceSearches, sequenceTriggers} from '../keys'
import EnrollmentResource from './enrollment.resource'
import {leadSearches, leadTriggers} from '../../lead/keys'

export const CreateEnrollmentAction: ZapierItem = {
    key: enrollmentActions.createEnrollmentAction,
    noun: 'Enrollment',
    display: {
        label: 'Create sequence enrolment',
        description: 'Creates a sequence enrolment for a given lead. Requires Reach add-on.'
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
                        dynamic: `${leadTriggers.leadListDropdown}.id.name`,
                        search: `${leadSearches.leadSearchOrCreate}.id`

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
                label: 'Sequence owner',
                helpText: 'That will be the user that emails will be sent by and tasks will be created for.',
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

export const StopAllEnrollmentsAction: ZapierItem = {
    key: enrollmentActions.stopAllEnrollmentsAction,
    noun: 'Enrollment',
    display: {
        label: 'Stop all sequence enrolments',
        description: 'Stops all sequence enrolments for a given lead.',
    },
    operation: {
        resource: EnrollmentResource.key,
        inputFields: [
            {
                key: 'id',
                label: 'Resource',
                type: 'integer',
                required: true,
                dynamic: `${leadTriggers.leadListDropdown}.id.name`,
                search: `${leadSearches.leadSearchOrCreate}.id`,
            },
            {
                key: 'resource_type',
                label: 'Resource Type',
                choices: ['lead'],
                type: 'string',
                required: true
            }
        ],
        perform: stopAllEnrollments(
            createActionDetails(enrollmentActions.stopAllEnrollmentsAction)
        )
    }
}

export const StopEnrollmentAction: ZapierItem = {
    key: enrollmentActions.stopEnrollmentAction,
    noun: 'Enrollment',
    display: {
        label: 'Stop sequence enrolment',
        description: 'Stops a sequence enrolment for a given lead.',
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
