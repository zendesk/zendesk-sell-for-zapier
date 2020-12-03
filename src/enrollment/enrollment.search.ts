import {ZapierItem} from '../types'
import {enrollmentSearches} from './keys'
import EnrollmentResource from './enrollment.resource'
import {searchPrefixedField} from '../utils/fieldsHelpers'
import {searchActionDetails} from '../utils/operations'
import {searchEnrollmentsByCriteria} from './common'

export const EnrollmentSearch: ZapierItem = {
    key: enrollmentSearches.enrollmentSearch,
    noun: 'Enrollment',
    display: {
        label: 'Find Enrollment in Catalog',
        description: 'Finds a enrollment by ID. Requires Reach subscription.'
    },
    operation: {
        resource: EnrollmentResource.key,
        inputFields: [
            {
                key: searchPrefixedField('id'),
                label: 'Enrollment ID',
                required: false,
                type: 'integer'
            }
        ],
        perform: searchEnrollmentsByCriteria(searchActionDetails(enrollmentSearches.enrollmentSearch), ['id'])
    }
}
