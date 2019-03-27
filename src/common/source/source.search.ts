import {ZapierItem} from '../../types'
import {ResourceType} from '../../utils/api'
import {searchSourcesByCriteria, SourceDetails} from './common'
import SourceResource from './source.resource'
import {searchActionDetails} from '../../utils/operations'
import {sourceSearches} from './keys'

const searchSources = (actionName: string, resourceType: ResourceType) =>
  searchSourcesByCriteria(searchActionDetails(actionName), ['name'], resourceType)

const sourceSearchActionFactory = (
  resourceType: ResourceType,
  {key, noun, description}: SourceDetails
): ZapierItem => {
  return {
    key,
    noun: `${noun} Source`,
    display: {
      label: `Find ${noun} Source`,
      description,
    },
    operation: {
      resource: SourceResource.key,
      inputFields: [
        {
          key: 'id',
          label: 'Source ID',
          required: false,
          type: 'integer'
        },
        {
          key: 'name',
          label: 'Source Name',
          required: false,
          type: 'string',
        }
      ],
      perform: searchSources(key, resourceType)
    }
  }
}

export const LeadSourceSearch = sourceSearchActionFactory(
  ResourceType.Lead,
  {
    key: sourceSearches.leadSourceSearch,
    noun: 'Lead',
    description: 'Finds a lead source by ID or name.'
  })

export const DealSourceSearch = sourceSearchActionFactory(
  ResourceType.Deal,
  {
    key: sourceSearches.dealSourceSearch,
    noun: 'Deal',
    description: 'Finds a deal source by ID or name.'
  })
