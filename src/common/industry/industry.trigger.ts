import {ResourceType} from '../../utils/api'
import {restEndpoints} from '../../utils/http'
import {Bundle, ZObject} from 'zapier-platform-core'
import IndustryResource from './industry.resource'
import {dropdownActionDetails} from '../../utils/operations'
import {industryTriggers} from './keys'
import {fetchItems} from '../queries'

/**
 * We need those items fetched to list existing industries within dynamic dropdowns for Leads and Contacts.
 * Semantically those items are triggers, but they are hidden and not available to user
 * (not visible in Zapier interface).
 */
const industryEndpoint = (resourceType: ResourceType): string => {
  if (resourceType === ResourceType.Deal) throw new Error('Cannot fetch industries for deals')
  return restEndpoints(`${resourceType}/industries`)
}

const fetchIndustries = (actionName: string, resourceType: ResourceType) => {
  const withId = (item: any) => ({id: item.name, ...item})
  return async (z: ZObject, bundle: Bundle) => {
    const items = await fetchItems(industryEndpoint(resourceType), dropdownActionDetails(actionName))(z, bundle)
    return items.map(withId)
  }
}

interface IndustryDetails {
  key: string,
  label: string,
  description: string
}

const industryDropdownFactory = (resourceType: ResourceType, {key, label, description}: IndustryDetails) => {
  return {
    key,
    noun: 'Industry',
    display: {
      label,
      description,
      hidden: true
    },
    operation: {
      resource: IndustryResource.key,
      perform: fetchIndustries(key, resourceType)
    }
  }
}

export const LeadIndustryDropdown = industryDropdownFactory(
  ResourceType.Lead,
  {
    key: industryTriggers.leadIndustriesDropdown,
    label: 'New Lead Industry',
    description: 'List leads industries.'
  })

export const ContactIndustryDropdown = industryDropdownFactory(
  ResourceType.Contact,
  {
    key: industryTriggers.contactIndustriesDropdown,
    label: 'New Contact Industry',
    description: 'List contact industries.'
  })
