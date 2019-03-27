import {commonLeadOutputFields} from './fields/leadOutputFields'

export const leadSample = {
  id: 1,
  creator_id: 1,
  owner_id: 1,
  first_name: 'Mark',
  last_name: 'Johnson',
  organization_name: 'Design Services Company',
  status: 'New',
  source_id: 10,
  title: 'CEO',
  description: 'I know him via Tom',
  industry: 'Design Services',
  website: 'http://www.designservice.com',
  email: 'mark@designservices.com',
  phone: '508-778-6516',
  mobile: '508-778-6516',
  fax: '+44-208-1234567',
  twitter: 'mjohnson',
  facebook: 'mjohnson',
  linkedin: 'mjohnson',
  skype: 'mjohnson',
  address: {
    line1: '2726 Smith Street',
    city: 'Hyannis',
    postal_code: '02601',
    state: 'MA',
    country: 'US'
  },
  tags: [
    'important'
  ]
}

const LeadResource = {
  key: 'lead',
  noun: 'Lead',
  sample: leadSample,
  outputFields: [
    {
      key: 'id',
      label: 'ID',
    },
    ...commonLeadOutputFields
  ]
}

export default LeadResource
