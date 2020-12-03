import {Bundle, ZObject} from 'zapier-platform-core'
import {restEndpoints} from '../utils/http'
import {ActionDetails, triggerActionDetails} from '../utils/operations'
import {searchWithPrefixedFields, streamItems} from '../common/queries'
import {descendingSort} from '../utils/api'
import {createItem, pickedFieldsProcessor} from '../common/createUpdate'

const enrollmentsEndpoint = restEndpoints('enrollments')
const sequencesEndpoint = restEndpoints('sequences')

export const searchEnrollmentsByCriteria = (actionDetails: ActionDetails, supportedFields: string[]) =>
    searchWithPrefixedFields(enrollmentsEndpoint, actionDetails, supportedFields)

export const searchSequencesByCriteria = (actionDetails: ActionDetails, supportedFields: string[]) =>
    searchWithPrefixedFields(sequencesEndpoint, actionDetails, supportedFields)

export const fetchEnrollmentsTrigger = (triggerName: string, sortBy: string, supportedFilters: string[]) => {
    return async (z: ZObject, bundle: Bundle) => {
        const sort = descendingSort(sortBy)
        return await streamItems(enrollmentsEndpoint, triggerActionDetails(triggerName),
            supportedFilters)(z, bundle, {}, sort)
    }
}

export const fetchSequencesTrigger = (triggerName: string, sortBy: string, supportedFilters: string[]) => {
    return async (z: ZObject, bundle: Bundle) => {
        const sort = descendingSort(sortBy)
        return await streamItems(sequencesEndpoint, triggerActionDetails(triggerName),
            supportedFilters)(z, bundle, {}, sort)
    }
}
export const createEnrollment = (actionDetails: ActionDetails) =>
    createItem(enrollmentsEndpoint, actionDetails, createFieldsProcess)

const createFieldsProcess = pickedFieldsProcessor(['sequence_id', 'resource_type', 'resource_id', 'actor_id'])
