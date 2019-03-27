import {dealCommonOutputFields} from './fields/dealOutputFields'

export const dealSample = {
  id: 1,
  creator_id: 1,
  owner_id: 1,
  name: 'Website Redesign',
  value: '1000.50',
  currency: 'USD',
  hot: true,
  stage_id: 1,
  last_stage_change_at: '2014-08-27T16:32:56Z',
  last_stage_change_by_id: 1,
  last_activity_at: '2014-08-27T17:32:56Z',
  source_id: 10,
  loss_reason_id: null,
  dropbox_email: 'dropbox@4e627bcd.deals.futuresimple.com',
  contact_id: 1,
  organization_id: 2,
  estimated_close_date: null,
  customized_win_likelihood: 15,
  tags: [
    'important'
  ],
  custom_fields: {
    website: 'http://www.coffeeshop.com'
  },
  created_at: '2014-08-27T16:32:56Z',
  updated_at: '2014-08-27T17:32:56Z'
}

const DealResource = {
  key: 'deal',
  noun: 'Deal',
  sample: dealSample,
  outputFields: [
    {
      key: 'id',
      label: 'ID',
    },
    ...dealCommonOutputFields
  ]
}

export default DealResource
