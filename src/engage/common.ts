import {Bundle, ZObject} from 'zapier-platform-core'
import {restEndpoints} from '../utils/http'
import {ActionDetails, triggerActionDetails} from '../utils/operations'
import {fetchItems, searchWithPrefixedFields, streamItems} from '../common/queries'
import {descendingSort} from '../utils/api'
import {createItem, pickedFieldsProcessor, updateItem} from '../common/createUpdate'

const enrollmentsEndpoint = restEndpoints('sequence_enrollments')
const sequencesEndpoint = restEndpoints('sequences')

export const searchSequencesByCriteria = (actionDetails: ActionDetails, supportedFields: string[]) =>
    searchWithPrefixedFields(sequencesEndpoint, actionDetails, supportedFields)

export const fetchEnrollmentsTrigger = (triggerName: string, sortBy: string, supportedFilters: string[]) => {
    return async (z: ZObject, bundle: Bundle) => {
        const sort = descendingSort(sortBy)
        return await streamItems(
            enrollmentsEndpoint,
            triggerActionDetails(triggerName),
            supportedFilters
        )(z, bundle, {}, sort)
    }
}

export const fetchSequencesTrigger = (triggerName: string, sortBy: string, supportedFilters: string[]) => {
    return async (z: ZObject, bundle: Bundle) => {
        const sort = descendingSort(sortBy)
        return await streamItems(
            sequencesEndpoint,
            triggerActionDetails(triggerName),
            supportedFilters
        )(z, bundle, {}, sort)
    }
}

export const fetchSequences = (actionDetails: ActionDetails) =>
    fetchItems(sequencesEndpoint, actionDetails)

export const fetchEnrollments = (actionDetails: ActionDetails) =>
    fetchItems(enrollmentsEndpoint, actionDetails)

export const createEnrollment = (actionDetails: ActionDetails) =>
    createItem(enrollmentsEndpoint, actionDetails, createFieldsProcess)

export const stopAllEnrollments = (actionDetails: ActionDetails) =>
    createItem(enrollmentsEndpoint + '/finish_ongoing_for_resource', actionDetails, createFieldsProcess)

const createFieldsProcess = pickedFieldsProcessor(['id', 'state', 'sequence_id', 'sequence_ids', 'resource_type', 'resource_id', 'actor_id'])
