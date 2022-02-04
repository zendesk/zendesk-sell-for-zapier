import LeadResource from './lead.resource'
import { leadFields, leadIdFieldFactory } from './fields/leadInputFields'
import { ZapierItem } from '../types'
import { createActionDetails } from '../utils/operations'
import { createLead, createOrUpdateLead, updateLead } from './common'
import { leadActions } from './keys'

export const CreateLeadAction: ZapierItem = {
  key: leadActions.createLeadAction,
  noun: 'Lead',
  display: {
    label: 'Create Lead',
    description: 'Creates a new lead.',
  },
  operation: {
    resource: LeadResource.key,
    inputFields: leadFields(true),
    perform: createLead(createActionDetails(leadActions.createLeadAction)),
  },
}

export const UpdateLeadAction: ZapierItem = {
  key: leadActions.updateLeadAction,
  noun: 'Lead',
  display: {
    label: 'Update Lead',
    description: 'Updates an existing lead.',
  },
  operation: {
    resource: LeadResource.key,
    inputFields: [leadIdFieldFactory(true), ...leadFields(false)],
    perform: updateLead(createActionDetails(leadActions.updateLeadAction)),
  },
}

// Deprecated and hidden
export const DeprecatedCreateOrUpdateLeadAction: ZapierItem = {
  key: 'lead_create_or_update',
  noun: 'Lead',
  display: {
    label: 'Create or Update Lead',
    description: 'Creates or Updates a lead based off of a Lead ID.',
    hidden: true,
  },
  operation: {
    resource: LeadResource.key,
    inputFields: [leadIdFieldFactory(false), ...leadFields(false)],
    perform: createOrUpdateLead(createActionDetails('lead_create_or_update')),
  },
}
