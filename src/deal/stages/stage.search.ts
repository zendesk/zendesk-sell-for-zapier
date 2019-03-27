import {isEmpty} from 'lodash'
import {ZapierItem} from '../../types'
import StageResource from './stage.resource'
import {Bundle, ZObject} from 'zapier-platform-core'
import {fetch, unpackItemsResponse} from '../../utils/http'
import {pipelinesEndpoint, stagesEndpoint} from './common'
import {hasIdDefined} from '../../utils/api'
import {ActionDetails, searchActionDetails} from '../../utils/operations'
import {stageSearches} from '../keys'

const findPipelineByName = async (z: ZObject, actionDetails: ActionDetails, pipelineName: string) => {
  const response = await fetch(
    z,
    {
      url: pipelinesEndpoint,
      params: {
        name: pipelineName
      }
    },
    actionDetails
  )
  return unpackItemsResponse(response, z)
}

const pipelineIdFilter = async (z: ZObject, actiionDetails: ActionDetails, pipelineName?: string): Promise<{ pipeline_id?: number }> => {
  if (!pipelineName) {
    return {}
  }
  const pipelines = await findPipelineByName(z, actiionDetails, pipelineName) as any[]
  return pipelines && pipelines[0] ? {pipeline_id: pipelines[0].id} : {}
}

const stageNameFilter = (bundle: Bundle): { name?: string } => {
  const {stage_name: value} = bundle.inputData
  return !!value ? {name: value} : {}
}

const searchSupportedFilters = async (z: ZObject, bundle: Bundle, actionDetails: ActionDetails) => {
  const pipelineFilter = await pipelineIdFilter(z, actionDetails, bundle.inputData.pipeline_name)
  return {
    ...stageNameFilter(bundle),
    ...pipelineFilter
  }
}

const fetchStageById = async (z: ZObject, bundle: Bundle, actionDetails: ActionDetails) => {
  const {id} = bundle.inputData
  const response = await fetch(
    z,
    {
      url: stagesEndpoint,
      params: {
        ids: id
      }
    },
    actionDetails
  )
  return unpackItemsResponse(response, z)
}

/**
 * If user provides a Pipeline Name filter parameter, we need to perform an additional call to the Sell API
 * to fetch pipeline's id based on its name. Then we can combine it (pipeline_id) with other filters
 * and look for stage using another call.
 */
const findStages = async (z: ZObject, bundle: Bundle) => {
  const actionDetails = searchActionDetails(stageSearches.stageSearch)

  if (hasIdDefined(bundle)) {
    return await fetchStageById(z, bundle, actionDetails)
  }

  const filters = await searchSupportedFilters(z, bundle, actionDetails)
  if (isEmpty(filters)) {
    return []
  }

  const response = await fetch(
    z,
    {
      url: stagesEndpoint,
      params: filters
    },
    actionDetails
  )
  return unpackItemsResponse(response, z)
}

export const StageSearch: ZapierItem = {
  key: stageSearches.stageSearch,
  noun: 'Stage',
  display: {
    label: 'Find Deal Stage',
    description: 'Finds a deal stage by ID or name.',
  },
  operation: {
    resource: StageResource.key,
    inputFields: [
      {
        key: 'id',
        label: 'Stage ID',
        helpText: 'Provide either Stage ID or Stage Name.',
        required: false,
        type: 'integer'
      },
      {
        key: 'stage_name',
        label: 'Stage Name',
        helpText: 'Provide either Stage ID or Stage Name.',
        required: false,
        type: 'string'
      },
      {
        key: 'pipeline_name',
        label: 'Pipeline Name',
        required: false,
        type: 'string'
      }
    ],
    perform: findStages
  }
}
