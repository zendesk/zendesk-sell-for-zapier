import {OutputField} from '../types'

export const deduplicationOutputFields: OutputField[] = [
  {
    key: 'entity_original_id',
    label: 'ID',
    type: 'integer'
  },
  {
    key: 'id',
    label: 'Zapier Deduplication ID',
    type: 'string',
  }
]

export const creatorOwnerOutputFields: OutputField[] = [
  {
    key: 'owner_id',
    label: 'Owner',
    type: 'integer'
  },
  {
    key: 'creator_id',
    label: 'Creator',
    type: 'integer'
  }
]

export const personalOutputFields: OutputField[] = [
  {
    key: 'title',
    label: 'Title',
    type: 'string'
  },
  {
    key: 'description',
    label: 'Description',
    type: 'string'
  },
  {
    key: 'industry',
    label: 'Industry',
    type: 'string'
  },
  {
    key: 'website',
    label: 'Website',
    type: 'string'
  },
  {
    key: 'email',
    label: 'Email',
    type: 'string'
  },
  {
    key: 'phone',
    label: 'Phone',
    type: 'string'
  },
  {
    key: 'mobile',
    label: 'Mobile',
    type: 'string'
  },
  {
    key: 'fax',
    label: 'Fax',
    type: 'string'
  },
  {
    key: 'twitter',
    label: 'Twitter',
    type: 'string'
  },
  {
    key: 'facebook',
    label: 'Facebook',
    type: 'string'
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    type: 'string'
  },
  {
    key: 'skype',
    label: 'Skype',
    type: 'string'
  }
]

export const tagsOutputFields: OutputField[] = [
  {
    key: 'tags',
    label: 'Tags'
  }
]

export const addressOutputFields: OutputField[] = [
  {
    key: 'address__line1',
    label: 'Street',
    type: 'string'
  },
  {
    key: 'address__city',
    label: 'City',
    type: 'string'
  },
  {
    key: 'address__postal_code',
    label: 'Zip/Post Code',
    type: 'string'
  },
  {
    key: 'address__state',
    label: 'State',
    type: 'string'
  },
  {
    key: 'address__country',
    label: 'Country',
    type: 'string'
  }
]
