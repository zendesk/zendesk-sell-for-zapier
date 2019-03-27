import TagResource from './tag.resource'
import {Bundle, ZObject} from 'zapier-platform-core'
import {restEndpoints} from '../../utils/http'
import {ResourceType} from '../../utils/api'
import {fetchItems} from '../queries'
import {dropdownActionDetails} from '../../utils/operations'
import {tagsTriggers} from './keys'

const tagsEndpoint = restEndpoints('tags')

const fetchTags = (actionName: string, resourceType: ResourceType) => {
  return async (z: ZObject, bundle: Bundle) =>
    await fetchItems(
      tagsEndpoint,
      dropdownActionDetails(actionName)
    )(z, bundle, {resource_type: resourceType})
}

interface TagsDetails {
  key: string,
  label: string,
  description: string
}

const tagsDropdownFactory = (
  resourceType: ResourceType,
  {key, label, description}: TagsDetails
) => {
  return {
    key,
    noun: 'Tag',
    display: {
      label,
      description,
      hidden: true
    },
    operation: {
      resource: TagResource.key,
      perform: fetchTags(key, resourceType)
    }
  }
}

/**
 * These operations are available only for dynamic dropdowns, should not be exposed as triggers
 */
export const LeadTagsDropdownList = tagsDropdownFactory(
  ResourceType.Lead,
  {
    key: tagsTriggers.leadTagDropdown,
    label: 'New Lead Tag',
    description: 'Lists leads tags.'
  })

export const ContactTagsDropdownList = tagsDropdownFactory(
  ResourceType.Contact,
  {
    key: tagsTriggers.contactTagDropdown,
    label: 'New Contact Tag',
    description: 'Lists contacts tags.'
  })

export const DealTagsDropdownList = tagsDropdownFactory(
  ResourceType.Deal,
  {
    key: tagsTriggers.dealTagDropdown,
    label: 'New Deal Tag',
    description: 'Lists deals tags.'
  })
