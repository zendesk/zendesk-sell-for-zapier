import {Bundle, ZObject} from 'zapier-platform-core'
import {fetchDealsTrigger} from './common'
import DealResource, {dealSample} from './deal.resource'
import {ZapierItem} from '../types'
import {deduplicationOutputFields} from '../common/outputFields'
import {dealCommonOutputFields} from './fields/dealOutputFields'
import {findAndRemapOnlyStageUpdatedItems} from '../utils/deduplication'
import {dealTriggers, pipelineTriggers, stageTriggers} from './keys'

const stageChangeAtField = 'last_stage_change_at'
const triggerSupportedFields = ['stage_id']

const listDealsByLastStageChange = async (z: ZObject, bundle: Bundle) => {
  const deals = await fetchDealsTrigger(
    dealTriggers.dealStageChangeTrigger,
    stageChangeAtField,
    triggerSupportedFields
  )(z, bundle)
  return findAndRemapOnlyStageUpdatedItems(deals)
}

export const DealStageChangeTrigger: ZapierItem = {
  key: dealTriggers.dealStageChangeTrigger,
  noun: 'Deal',

  display: {
    label: 'Deal Enters New Stage',
    description: 'Triggers when a deal enters a new stage.',
    important: true
  },
  operation: {
    // Resource cannot be used here, because of different output fields (deduplication)
    sample: dealSample,
    inputFields: [
      {
        key: 'pipeline_id',
        label: 'Pipeline',
        required: false,
        type: 'integer',
        dynamic: `${pipelineTriggers.pipelineListDropdown}.id.name`,
        altersDynamicFields: true
      },
      {
        key: 'stage_id',
        label: 'Stage',
        required: false,
        type: 'integer',
        dynamic: `${stageTriggers.stageListDropdown}.id.name`
      },
    ],
    outputFields: [
      ...deduplicationOutputFields,
      ...dealCommonOutputFields
    ],
    perform: listDealsByLastStageChange
  }
}

// Deprecated and hidden
export const DeprecatedDealStageChangeTrigger: ZapierItem = {
  key: 'deal_last_stage_change',
  noun: 'Deal',

  display: {
    label: 'Deal Stage Changed (legacy)',
    description: 'Triggers when a stage of the deal has changed.',
    hidden: true
  },

  operation: {
    resource: DealResource.key,
    inputFields: [
      {
        key: 'pipeline_id',
        label: 'Pipeline',
        helpText: 'Name of the pipeline the deal is in.',
        required: false,
        type: 'integer',
        dynamic: `${pipelineTriggers.pipelineListDropdown}.id.name`,
        altersDynamicFields: true
      },
      {
        key: 'stage_id',
        label: 'Stage',
        helpText: 'Name of the stage the deal was moved to. ',
        required: false,
        type: 'integer',
        dynamic: `${stageTriggers.stageListDropdown}.id.name`
      },
    ],
    perform: fetchDealsTrigger(
      'deal_last_stage_change',
      stageChangeAtField,
      triggerSupportedFields
    )
  }
}

