import {fetchItems} from '../../common/queries'
import {pipelinesEndpoint} from './common'
import {ZapierItem} from '../../types'
import PipelineResource from './pipeline.resource'
import {dropdownActionDetails} from '../../utils/operations'
import {pipelineTriggers} from '../keys'

const listPipelines = fetchItems(pipelinesEndpoint, dropdownActionDetails(pipelineTriggers.pipelineListDropdown))

/**
 * This trigger is used only for dynamic dropdowns and should not be exposed as trigger
 */
export const ListPipelineDropdown: ZapierItem = {
  key: pipelineTriggers.pipelineListDropdown,
  noun: 'Pipeline',
  display: {
    label: 'New Pipeline',
    description: 'Lists the pipelines.',
    hidden: true
  },
  operation: {
    resource: PipelineResource.key,
    perform: listPipelines
  }
}
