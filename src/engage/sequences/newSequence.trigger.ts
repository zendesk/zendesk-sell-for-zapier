import {ZapierItem} from '../../types'
import {sequenceTriggers} from '../keys'
import SequenceResource from './sequence.resource'
import {Bundle, ZObject} from 'zapier-platform-core'
import {dropdownActionDetails} from '../../utils/operations'
import {fetchSequences} from '../common'

const listSequencesWithoutFilters = async (z: ZObject, bundle: Bundle) => {
    const sequences = await fetchSequences(dropdownActionDetails(sequenceTriggers.sequenceListDropdown))(z, bundle)
    return sequences.map(sequence => sequenceWithExtractedName(sequence))
}

const sequenceWithExtractedName = (sequence: any) => ({
    ...sequence,
    name: sequence.name
})

/**
 * Used only internally in DropDowns, don't expose this as trigger to users
 */
export const ListSequencesDropdown: ZapierItem = {
    key: sequenceTriggers.sequenceListDropdown,
    noun: 'Sequence',

    display: {
        label: 'New Sequence',
        description: 'Triggers when a new sequence is created.',
        hidden: true
    },

    operation: {
        resource: SequenceResource.key,
        perform: listSequencesWithoutFilters
    }
}

