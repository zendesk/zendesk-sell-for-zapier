import {ZapierItem} from '../../types'
import {sequenceSearches} from '../keys'
import {searchPrefixedField} from '../../utils/fieldsHelpers'
import {searchActionDetails} from '../../utils/operations'
import {searchSequencesByCriteria} from '../common'
import SequenceResource from './sequence.resource'

export const SequenceSearch: ZapierItem = {
    key: sequenceSearches.sequenceSearch,
    noun: 'Sequence',
    display: {
        label: 'Find sequence',
        description: 'Finds a sequence by Sequence ID or name. Requires Reach add-on.'
    },
    operation: {
        resource: SequenceResource.key,
        inputFields: [
            {
                key: searchPrefixedField('id'),
                label: 'Sequence ID',
                required: false,
                type: 'integer'
            },
            {
                key: searchPrefixedField('name'),
                label: 'Sequence Name',
                required: false,
                type: 'string'
            }
        ],
        perform: searchSequencesByCriteria(searchActionDetails(sequenceSearches.sequenceSearch), ['id', 'name'])
    }
}
