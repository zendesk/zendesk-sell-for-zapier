import {Bundle, ZObject} from 'zapier-platform-core'
import {fetchDealsTrigger} from './common'
import {ZapierItem} from '../types'
import {findAndRemapOnlyUpdatedItems, sampleWithDeduplicationId} from '../utils/deduplication'
import {deduplicationOutputFields} from '../common/outputFields'
import {dealCommonOutputFields} from './fields/dealOutputFields'
import {dealTriggers} from './keys'
import {dealSample} from './deal.resource'

const listDealsByUpdatedAt = async (z: ZObject, bundle: Bundle) => {
  const deals = await fetchDealsTrigger(
    dealTriggers.updatedDealTrigger,
    'updated_at',
    []
  )(z, bundle)
  return findAndRemapOnlyUpdatedItems(deals)
}

const UpdatedDealTrigger: ZapierItem = {
  key: dealTriggers.updatedDealTrigger,
  noun: 'Deal',
  display: {
    label: 'Updated Deal',
    description: 'Triggers when an existing deal is updated.',
  },
  operation: {
    // Resource cannot be used here, because of different output fields (deduplication)
    sample: sampleWithDeduplicationId(dealSample),
    outputFields: [
      ...deduplicationOutputFields,
      ...dealCommonOutputFields
    ],
    perform: listDealsByUpdatedAt
  }
}

export default UpdatedDealTrigger
