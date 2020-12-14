import {ZapierItem} from '../../types'
import {enrollmentSearches} from '../keys'
import EnrollmentResource from './enrollment.resource'
import {searchPrefixedField} from '../../utils/fieldsHelpers'
import {searchActionDetails} from '../../utils/operations'
import {searchEnrollmentsByCriteria} from '../common'

export const EnrollmentSearch: ZapierItem = {
    key: enrollmentSearches.enrollmentSearch,
    noun: 'Enrollment',
    display: {
        label: 'Find Enrollment in Catalog',
        description: 'Finds a enrollment by Enrollment ID and resource ID. Requires Reach subscription.'
    },
    operation: {
        resource: EnrollmentResource.key,
        inputFields: [
            {
                key: searchPrefixedField('id'),
                label: 'Enrollment ID',
                required: false,
                type: 'integer'
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
                type: 'integer'
            }
        ],
        perform: searchEnrollmentsByCriteria(
            searchActionDetails(enrollmentSearches.enrollmentSearch),
            ['id', 'resource_type', 'resource_ids']
        )
    }
}
