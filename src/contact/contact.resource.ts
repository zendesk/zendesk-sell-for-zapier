import {commonContactOutputFields} from './fields/contactOutputFields'

export const contactSample = {
  id: 1,
  creator_id: 1,
  owner_id: 1,
  is_organization: true,
  contact_id: null,
  parent_organization_id: 2,
  name: 'Design Services Company',
  first_name: null,
  last_name: null,
  title: null,
  description: null,
  industry: 'Design Services',
  website: 'http://www.designservice.com',
  email: null,
  phone: null,
  mobile: null,
  fax: '+44-208-1234567',
  twitter: null,
  facebook: null,
  linkedin: null,
  skype: null,
  address: {
    line1: '2726 Smith Street',
    city: 'Hyannis',
    postal_code: '02601',
    state: 'MA',
    country: 'US'
  },
  tags: [
    'important'
  ],
  custom_fields: {
    known_via: 'tom'
  },
  created_at: '2014-08-27T16:32:56Z',
  updated_at: '2014-08-27T16:32:56Z'
}

const ContactResource = {
  key: 'contact',
  noun: 'Contact',
  sample: contactSample,
  outputFields: [
    {
      key: 'id',
      label: 'ID',
      type: 'integer',
    },
    ...commonContactOutputFields
  ]
}

export default ContactResource
