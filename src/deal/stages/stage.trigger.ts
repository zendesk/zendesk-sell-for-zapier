import {ZapierItem} from '../../types'
import {stagesEndpoint} from './common'
import StageResource from './stage.resource'
import {fetchItems} from '../../common/queries'
import {dropdownActionDetails} from '../../utils/operations'
import {Bundle, ZObject} from 'zapier-platform-core'
import {notNullableSupportedFilters} from '../../utils/api'
import {stageTriggers} from '../keys'

const listStages = async (z: ZObject, bundle: Bundle) => {
  const filters = notNullableSupportedFilters(bundle, ['pipeline_id'])
  return await fetchItems(
    stagesEndpoint,
    dropdownActionDetails(stageTriggers.stageListDropdown)
  )(z, bundle, filters)
}

/**
 * This trigger is used only for dynamic dropdowns and should not be exposed as trigger
 */
export const ListStageDropdown: ZapierItem = {
  key: stageTriggers.stageListDropdown,
  noun: 'Stage',
  display: {
    label: 'New Stage',
    description: 'Lists the stages.',
    hidden: true
  },
  operation: {
    resource: StageResource.key,
    inputFields: [
      {
        key: 'pipeline_id',
        label: 'Pipeline',
        required: false,
        type: 'integer'
      }
    ],
    perform: listStages
  }
}
