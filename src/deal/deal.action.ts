import DealResource from './deal.resource'
import {dealFields, dealIdFieldFactory} from './fields/dealInputFields'
import {ZapierItem} from '../types'
import {createDeal, createOrUpdateDeal, updateDeal} from './common'
import {createActionDetails} from '../utils/operations'
import {dealActions} from './keys'

export const CreateDealAction: ZapierItem = {
  key: dealActions.createDealAction,
  noun: 'Deal',
  display: {
    label: 'Create Deal',
    description: 'Creates a new deal.',
    important: true
  },
  operation: {
    resource: DealResource.key,
    inputFields: dealFields(true),
    perform: createDeal(createActionDetails(dealActions.createDealAction))
  }
}

export const UpdateDealAction: ZapierItem = {
  key: dealActions.updateDealAction,
  noun: 'Deal',
  display: {
    label: 'Update Deal',
    description: 'Updates an existing deal.',
  },
  operation: {
    resource: DealResource.key,
    inputFields: [
      dealIdFieldFactory(true),
      ...dealFields(false)
    ],
    perform: updateDeal(createActionDetails(dealActions.updateDealAction))
  }
}

// Deprecated and hidden
export const DeprecatedCreateOrUpdateDealAction: ZapierItem = {
  key: 'deal_create_or_update',
  noun: 'Deal',
  display: {
    label: 'Create or Update Deal',
    description: 'Creates or Updates a deal based off of Deal ID.',
    hidden: true,
  },
  operation: {
    resource: DealResource.key,
    inputFields: [
      dealIdFieldFactory(false),
      ...dealFields(false)
    ],
    perform: createOrUpdateDeal(createActionDetails('deal_create_or_update'))
  }
}
