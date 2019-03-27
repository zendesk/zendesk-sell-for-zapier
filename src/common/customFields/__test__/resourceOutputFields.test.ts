import {extractOutputCustomFields} from '../resourceOutputFields'
import {RawCustomField, RawCustomFieldType} from '../types'

describe('extractOutputCustomFields', () => {
  it('should return empty array for empty input', () => {
    const result = extractOutputCustomFields([])
    expect(result).toHaveLength(0)
  })

  it('should properly format address custom field', () => {
    const rawCustomFields = [
      {
        id: 100,
        name: 'AddressCF',
        type: RawCustomFieldType.Address
      }
    ]
    const result = extractOutputCustomFields(rawCustomFields)
    expect(result).toHaveLength(5)
    expect(result).toEqual([
      {
        key: 'custom_fields__AddressCF__line1',
        label: 'Custom Field: AddressCF - Street'
      },
      {
        key: 'custom_fields__AddressCF__city',
        label: 'Custom Field: AddressCF - City'
      },
      {
        key: 'custom_fields__AddressCF__postal_code',
        label: 'Custom Field: AddressCF - Zip/Post Code'
      },
      {
        key: 'custom_fields__AddressCF__state',
        label: 'Custom Field: AddressCF - State'
      },
      {
        key: 'custom_fields__AddressCF__country',
        label: 'Custom Field: AddressCF - Country'
      },
    ])

  })

  it('should properly format custom fields', () => {
    const rawCustomFields: RawCustomField[] = [
      {
        id: 100,
        name: 'MultiSelect',
        type: RawCustomFieldType.MultiSelect,
        choices: [{id: 100, name: '100'}]
      },
      {
        id: 101,
        name: 'Bool',
        type: RawCustomFieldType.Bool
      },
      {
        id: 102,
        name: 'Email',
        type: RawCustomFieldType.Email
      }
    ]

    const result = extractOutputCustomFields(rawCustomFields)
    expect(result).toHaveLength(3)
    expect(result).toEqual([
      {
        key: 'custom_fields__MultiSelect',
        label: 'Custom Field: MultiSelect',
      },
      {
        key: 'custom_fields__Bool',
        label: 'Custom Field: Bool',
      },
      {
        key: 'custom_fields__Email',
        label: 'Custom Field: Email',
      }
    ])
  })
})
