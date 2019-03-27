import {ResourceType} from '../../utils/api'
import {ZapierItem} from '../../types'
import {fetchSources, SourceDetails} from './common'
import SourceResource from './source.resource'
import {dropdownActionDetails} from '../../utils/operations'
import {sourceTriggers} from './keys'

const listSourcesWithoutFilters = (actionName: string, resourceType: ResourceType) =>
  fetchSources(dropdownActionDetails(actionName), resourceType)

const sourceDropdownList = (
  resourceType: ResourceType,
  {key, noun, description}: SourceDetails
): ZapierItem => {
  return {
    key,
    noun: `${noun} Source`,
    display: {
      label: `New ${noun} Source`,
      description,
      hidden: true
    },
    operation: {
      resource: SourceResource.key,
      perform: listSourcesWithoutFilters(key, resourceType)
    }
  }
}

/**
 * These operations are available only for dynamic dropdowns, should not be exposed as triggers
 */
export const LeadSourceDropdownList = sourceDropdownList(
  ResourceType.Lead,
  {
    key: sourceTriggers.leadSourceDropdown,
    noun: 'Lead',
    description: 'Lists the lead sources.'
  })

export const DealSourceDropdownList = sourceDropdownList(
  ResourceType.Deal,
  {
    key: sourceTriggers.dealSourceDropdown,
    noun: 'Deal',
    description: 'Lists the deal sources.'
  })
