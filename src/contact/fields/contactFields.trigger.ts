import {ZapierItem} from '../../types'
import {contactTriggers} from '../keys'
import {extractFields} from '../../common/fields/fieldsFetcher'
import {EntityType} from '../../utils/api'
import {Bundle, ZObject} from 'zapier-platform-core'
import {isNil} from 'lodash'

/**
 * Checks for presence of 'is_organization' within bundle.inputData
 * If parameter is present then fields are returned for either person or company type
 * Otherwise all contact fields are returned, applicable for both people and companies
 */
const extractContactFields = async (z: ZObject, bundle:  Bundle) => {
  const isOrganization = bundle.inputData.is_organization
  if (isNil(isOrganization)) {
    return await extractFields(EntityType.Contact)(z, bundle)
  } else if (isOrganization) {
    return await extractFields(EntityType.Company)(z, bundle)
  }
  return await extractFields(EntityType.Person)(z, bundle)
}

/**
 * This trigger is responsible for populating dropdown with fields available for Contacts
 * in other trigger like UpdatedContactTrigger
 *
 * Used only internally in Dropdowns, don't expose this as trigger to users
 */
export const ContactFieldsDropdown: ZapierItem = {
  key: contactTriggers.contactFieldsDropdown,
  noun: 'Contact',

  display: {
    label: 'Contact Fields',
    description: 'Contact Fields',
    hidden: true
  },

  operation: {
    perform: extractContactFields
  }
}
