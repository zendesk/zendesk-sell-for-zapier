import {ZapierItem} from '../../types'
import {enrollmentSearches, enrollmentTriggers} from '../keys'
import EnrollmentResource from './enrollment.resource'
import {searchPrefixedField} from '../../utils/fieldsHelpers'
import {searchActionDetails} from '../../utils/operations'
import {searchEnrollmentsByCriteria} from '../common'
import {leadSearches, leadTriggers} from '../../lead/keys'

export const EnrollmentSearch: ZapierItem = {
    key: enrollmentSearches.enrollmentSearch,
    noun: 'Enrollment',
    display: {
        label: 'Find sequence enrolment',
        description: 'Finds a sequence enrolment for a given lead by sequence name or sequence ID.'
    },
    operation: {
        resource: EnrollmentResource.key,
        inputFields: [
            {
                key: searchPrefixedField('id'),
                label: 'Enrollment ID',
                required: false,
                type: 'integer',
                dynamic: `${enrollmentTriggers.enrollmentListDropdown}.id.name`,
                search: `${enrollmentTriggers.enrollmentListDropdown}.id`
            },
            {
                key: searchPrefixedField('resource_type'),
                label: 'Resource Type',
                required: true,
                type: 'string',
                choices: ['lead']
            },
            {
                key: searchPrefixedField('resource_ids'),
                label: 'Resource ID',
                required: false,
                type: 'integer',
                dynamic: `${leadTriggers.leadListDropdown}.id.name`,
                search: `${leadSearches.leadSearchOrCreate}.id`
            }
        ],
        perform: searchEnrollmentsByCriteria(
            searchActionDetails(enrollmentSearches.enrollmentSearch),
            ['id', 'resource_type', 'resource_ids']
        )
    }
}
