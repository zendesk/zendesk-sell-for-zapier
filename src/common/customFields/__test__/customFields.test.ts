import {customFieldsFactory, formatCustomFields} from '../customFields'
import {EntityType} from '../../../utils/api'
import {createFakeZObject} from '../../../utils/testHelpers'

describe('customFieldsFactory', () => {
  it('should return properly parsed custom fields in Zapier format', async () => {
    const items = [
      {
        id: 1,
        name: 'Phone',
        type: 'phone',
      },
      {
        id: 2,
        name: 'Gender',
        type: 'bool',
      },
      {
        id: 3,
        name: 'Industry',
        type: 'list',
        options: [
          {id: 1, name: 'TypeA'},
          {id: 2, name: 'TypeB'},
        ]
      }
    ].map((item) => ({data: item}))

    const z = createFakeZObject(200, {items})

    const fields = await customFieldsFactory(EntityType.Deal)(z)
    expect(fields).toHaveLength(3)

    expect(fields[0]).toEqual({
      key: 'custom_fields.Phone',
      label: 'Phone',
      type: 'string'
    })

    expect(fields[1]).toEqual({
      key: 'custom_fields.Gender',
      label: 'Gender',
      type: 'boolean'
    })

    expect(fields[2]).toEqual({
      key: 'custom_fields.Industry',
      label: 'Industry',
      type: 'string',
      list: false,
      choices: ['TypeA', 'TypeB']
    })
  })
})


describe('formatCustomFields', () => {
  const createEmptyCustomFieldsResponse = () => {
    return createFakeZObject(200, {items: []})
  }

  it('should properly format regular custom fields', async () => {
    const inputData = {
      'custom_fields.field.with.dots': 'Dots',
      'custom_fields.;1234': 'Odd',
      'custom_fields.sector': ['Sector1', 'Sector2'],
      'custom_fields.regular_field': 'RegularOne'
    }

    const z = createEmptyCustomFieldsResponse()
    const formatted = await formatCustomFields(z, inputData, EntityType.Contact)
    expect(formatted).toEqual({
      custom_fields: {
        'field.with.dots': 'Dots',
        ';1234': 'Odd',
        sector: ['Sector1', 'Sector2'],
        regular_field: 'RegularOne'
      }
    })
  })

  it('should not add custom fields to output if can\'t find any', async () => {
    const inputData = {
      'not_custom_fields.name': 'Name21',
      last_name: 'Last Name'
    }

    const z = createEmptyCustomFieldsResponse()
    const formatted = await formatCustomFields(z, inputData, EntityType.Contact)
    expect(formatted).toEqual({
      'not_custom_fields.name': 'Name21',
      last_name: 'Last Name'
    })
  })

  it('should properly format address custom fields', async () => {
    const inputData = {
      name: 'Josh',
      'custom_fields.second_name': 'Paul',
      'custom_fields.address1.line1': 'Wyczolkowskiego',
      'custom_fields.address1.postal_code': '30118',
      'custom_fields.address.with.dots.city': 'Krakow',
      'custom_fields.another_address.country': 'Poland'
    }

    const z = createEmptyCustomFieldsResponse()
    const formatted = await formatCustomFields(z, inputData, EntityType.Contact)
    expect(formatted).toEqual({
      name: 'Josh',
      custom_fields: {
        second_name: 'Paul',
        address1: {
          line1: 'Wyczolkowskiego',
          postal_code: '30118'
        },
        'address.with.dots': {
          city: 'Krakow'
        },
        another_address: {
          country: 'Poland'
        }
      }
    })
  })

  it('should skip regular fields', async () => {
    const inputData = {
      name: 'Josh',
      organisation_name: 'Base CRM',
      'custom_fields.second_name': 'Adrian',
      'custom_fields.multi_select': [1, 2, 3]
    }

    const z = createEmptyCustomFieldsResponse()
    const formatted = await formatCustomFields(z, inputData, EntityType.Contact)
    expect(formatted).toEqual({
      name: 'Josh',
      organisation_name: 'Base CRM',
      custom_fields: {
        second_name: 'Adrian',
        multi_select: [1, 2, 3]
      }
    })
  })

  it('should properly format date and datetime custom fields', async () => {
    const inputData = {
      name: 'Josh',
      'custom_fields.date_time': '2018-10-30T19:00:00+09:00',
      'custom_fields.date': '2018-10-30T19:00:00+09:00'
    }

    const items = [
      {
        data: {
          id: 1,
          name: 'date_time',
          type: 'datetime',
        }
      },
      {
        data: {
          id: 2,
          name: 'date',
          type: 'date',
        }
      },
    ]
    const z = createFakeZObject(200, {items})
    const formatted = await formatCustomFields(z, inputData, EntityType.Lead)
    expect(formatted).toEqual({
      name: 'Josh',
      custom_fields: {
        date: '2018-10-30',
        date_time: '2018-10-30T19:00:00Z'
      }
    })
  })
})
