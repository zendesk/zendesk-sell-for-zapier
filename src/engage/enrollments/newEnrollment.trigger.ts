import {ZapierItem} from '../../types'
import {enrollmentTriggers} from '../keys'
import EnrollmentResource from './enrollment.resource'
import {Bundle, ZObject} from 'zapier-platform-core'
import {dropdownActionDetails} from '../../utils/operations'
import {fetchEnrollments} from '../common'

const listEnrollmentsWithoutFilters = async (z: ZObject, bundle: Bundle) => {
    const enrollments = await fetchEnrollments(
        dropdownActionDetails(enrollmentTriggers.enrollmentListDropdown)
    )(z, bundle)
    return enrollments.map(sequence => enrollmentWithExtractedName(sequence))
}

const enrollmentWithExtractedName = (enrollment: any) => ({
    ...enrollment,
    name: enrollment.name
})

/**
 * Used only internally in DropDowns, don't expose this as trigger to users
 */
export const ListEnrollmentsDropdown: ZapierItem = {
    key: enrollmentTriggers.enrollmentListDropdown,
    noun: 'Enrollment',

    display: {
        label: 'New Enrollment',
        description: 'Triggers when a new enrollment is created.',
        hidden: true
    },

    operation: {
        resource: EnrollmentResource.key,
        perform: listEnrollmentsWithoutFilters
    }
}

