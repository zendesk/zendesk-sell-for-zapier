import {ZapierItem} from '../types'
import {sequenceSearches} from './keys'
import {searchPrefixedField} from '../utils/fieldsHelpers'
import {searchActionDetails} from '../utils/operations'
import {searchSequencesByCriteria} from './common'
import SequenceResource from './sequence.resource'

export const SequenceSearch: ZapierItem = {
    key: sequenceSearches.sequenceSearch,
    noun: 'Sequence',
    display: {
        label: 'Find Sequence in Catalog',
        description: 'Finds a sequence by ID. Requires Reach subscription.'
    },
    operation: {
        resource: SequenceResource.key,
        inputFields: [
            {
                key: searchPrefixedField('id'),
                label: 'Sequence ID',
                required: false,
                type: 'integer'
            }
        ],
        perform: searchSequencesByCriteria(searchActionDetails(sequenceSearches.sequenceSearch), ['id'])
    }
}
