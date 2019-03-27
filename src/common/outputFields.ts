import {OutputField} from '../types'

export const deduplicationOutputFields: OutputField[] = [
  {
    key: 'entity_original_id',
    label: 'ID'
  },
  {
    key: 'id',
    label: 'Zapier Deduplication ID'
  }
]

export const creatorOwnerOutputFields: OutputField[] = [
  {
    key: 'owner_id',
    label: 'Owner',
  },
  {
    key: 'creator_id',
    label: 'Creator'
  }
]

export const personalOutputFields: OutputField[] = [
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'description',
    label: 'Description'
  },
  {
    key: 'industry',
    label: 'Industry'
  },
  {
    key: 'website',
    label: 'Website'
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'phone',
    label: 'Phone'
  },
  {
    key: 'mobile',
    label: 'Mobile'
  },
  {
    key: 'fax',
    label: 'Fax'
  },
  {
    key: 'twitter',
    label: 'Twitter'
  },
  {
    key: 'facebook',
    label: 'Facebook'
  },
  {
    key: 'linkedin',
    label: 'LinkedIn'
  },
  {
    key: 'skype',
    label: 'Skype'
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
  },
  {
    key: 'address__city',
    label: 'City',
  },
  {
    key: 'address__postal_code',
    label: 'Zip/Post Code',
  },
  {
    key: 'address__state',
    label: 'State',
  },
  {
    key: 'address__country',
    label: 'Country',
  }
]
