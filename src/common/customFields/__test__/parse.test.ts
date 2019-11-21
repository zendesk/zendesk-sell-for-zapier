import {extractCustomFields} from '../parse'
import {RawCustomField, RawCustomFieldType, ZapierCustomFieldType} from '../types'


describe('extractOutputCustomFields', () => {
  const testRegularCustomField = (
    name: string,
    actualType: RawCustomFieldType,
    expectedType: ZapierCustomFieldType
  ) => {
    const customField: RawCustomField = {
      id: 400,
      name,
      type: actualType,
      choices: null
    }

    const zapierCustomFields = extractCustomFields([customField])
    expect(zapierCustomFields).toHaveLength(1)
    expect(zapierCustomFields[0]).toEqual({
      key: `custom_fields.${name}`,
      label: name,
      type: expectedType
    })
  }

  it('should properly extract text custom field', () => {
    testRegularCustomField('text custom field', RawCustomFieldType.Text, ZapierCustomFieldType.Text)
  })

  it('should properly extract number custom field', () => {
    testRegularCustomField('number', RawCustomFieldType.Number, ZapierCustomFieldType.Integer)
  })

  it('should properly extract boolean custom field', () => {
    testRegularCustomField('boolean_cf', RawCustomFieldType.Bool, ZapierCustomFieldType.Boolean)
  })

  it('should properly extract date custom field', () => {
    testRegularCustomField('date_cf', RawCustomFieldType.Date, ZapierCustomFieldType.DateTime)
  })

  it('should properly extract datetime custom field', () => {
    testRegularCustomField('datetime_cf', RawCustomFieldType.DateTime, ZapierCustomFieldType.DateTime)
  })

  it('should properly extract address custom field', () => {
    const addressCustomField: RawCustomField = {
      id: 100,
      name: 'AddressCF',
      type: RawCustomFieldType.Address
    }

    const zapierCustomFields = extractCustomFields([addressCustomField])
    expect(zapierCustomFields).toHaveLength(5)
    expect(zapierCustomFields).toEqual([
        {
          key: 'custom_fields.AddressCF.line1',
          label: 'AddressCF - Street',
          type: 'string'
        },
        {
          key: 'custom_fields.AddressCF.city',
          label: 'AddressCF - City',
          type: 'string'
        },
        {
          key: 'custom_fields.AddressCF.postal_code',
          label: 'AddressCF - Zip/Post Code',
          type: 'string'
        },
        {
          key: 'custom_fields.AddressCF.state',
          label: 'AddressCF - State or Region',
          type: 'string'
        },
        {
          key: 'custom_fields.AddressCF.country',
          label: 'AddressCF - Country',
          type: 'string'
        }
      ]
    )
  })

  it('should properly extract list custom field', () => {
    const customField: RawCustomField = {
      id: 200,
      name: 'Dropdown',
      type: RawCustomFieldType.List,
      choices: [
        {id: 1, name: 'Option1'},
        {id: 2, name: 'Option2'}
      ]
    }

    const zapierCustomFields = extractCustomFields([customField])
    expect(zapierCustomFields).toHaveLength(1)
    expect(zapierCustomFields[0]).toEqual({
      key: 'custom_fields.Dropdown',
      label: 'Dropdown',
      type: ZapierCustomFieldType.String,
      list: false,
      choices: ['Option1', 'Option2']
    })
  })

  it('should properly extract multi select custom field', () => {
    const customField: RawCustomField = {
      id: 300,
      name: 'MultiSelect',
      type: RawCustomFieldType.MultiSelect,
      choices: [
        {id: 1, name: '1'},
        {id: 2, name: '2'},
        {id: 3, name: '3'}
      ]
    }

    const zapierCustomFields = extractCustomFields([customField])
    expect(zapierCustomFields).toHaveLength(1)
    expect(zapierCustomFields[0]).toEqual({
      key: 'custom_fields.MultiSelect',
      label: 'MultiSelect',
      type: ZapierCustomFieldType.String,
      list: true,
      choices: ['1', '2', '3']
    })
  })
})
