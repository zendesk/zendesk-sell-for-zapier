import {Bundle, ZObject} from 'zapier-platform-core'
import {restBetaEndpoints} from '../utils/http'
import {ActionDetails, triggerActionDetails} from '../utils/operations'
import {fetchItems, searchWithPrefixedFields, streamItems} from '../common/queries'
import {descendingSort} from '../utils/api'
import {createItem, pickedFieldsProcessor, updateItem} from '../common/createUpdate'

const enrollmentsEndpoint = restBetaEndpoints('sequence_enrollments')
const sequencesEndpoint = restBetaEndpoints('sequences')

export const searchEnrollmentsByCriteria = (actionDetails: ActionDetails, supportedFields: string[]) =>
    searchWithPrefixedFields(enrollmentsEndpoint, actionDetails, supportedFields)

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

export const createEnrollment = (actionDetails: ActionDetails) =>
    createItem(enrollmentsEndpoint, actionDetails, createFieldsProcess)

export const stopEnrollment = (actionDetails: ActionDetails) =>
    updateItem(enrollmentsEndpoint, actionDetails, createFieldsProcess)

const createFieldsProcess = pickedFieldsProcessor(['id', 'state', 'sequence_id', 'resource_type', 'resource_id', 'actor_id'])
