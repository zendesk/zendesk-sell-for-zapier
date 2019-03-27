import {InputField} from '../types'

export const addressInputFields: InputField[] = [
  {
    key: 'address.line1',
    label: 'Street',
    required: false,
    type: 'string'
  },
  {
    key: 'address.city',
    label: 'City',
    required: false,
    type: 'string'
  },
  {
    key: 'address.postal_code',
    label: 'Zip/Post Code',
    required: false,
    type: 'string'
  },
  {
    key: 'address.state',
    label: 'State or Region',
    required: false,
    type: 'string'
  },
  {
    key: 'address.country',
    label: 'Country',
    required: false,
    type: 'string'
  }
]

export const additionalInputFields: InputField[] = [
  {
    key: 'website',
    label: 'Website',
    required: false,
    type: 'string'
  },
  {
    key: 'skype',
    label: 'Skype',
    required: false,
    type: 'string'
  },
  {
    key: 'facebook',
    label: 'Facebook',
    required: false,
    type: 'string'
  },
  {
    key: 'twitter',
    label: 'Twitter',
    required: false,
    type: 'string'
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    required: false,
    type: 'string'
  },
  {
    key: 'fax',
    label: 'Fax',
    required: false,
    type: 'string'
  },
  {
    key: 'description',
    label: 'Description',
    required: false,
    type: 'string'
  }
]

