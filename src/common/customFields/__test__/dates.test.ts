import {formatDateAndTimeCustomFields, reformatDatetimeCustomFields} from '../dates'
import {RawCustomFieldType} from '../types'
import {createFakeZObject} from '../../../utils/testHelpers'
import {EntityType} from '../../../utils/api'

describe('reformatDatetimeCustomFields', () => {
  const url = 'https://api.getbase.com/v2/contacts'
  const definitions = [
    {
      data: {
        id: 1,
        name: 'string',
        type: 'string',
      }
    },
    {
      data: {
        id: 2,
        name: 'date_time',
        type: 'datetime',
      }
    },
    {
      data: {
        id: 3,
        name: 'date',
        type: 'date',
      }
    },
    {
      data: {
        id: 4,
        name: 'bool',
        type: 'bool',
      }
    }
  ]

  it('should pass if custom fields are empty', async () => {
    const customFields = {}
    const z = createFakeZObject(200, {items: definitions})

    const result = await reformatDatetimeCustomFields(z, EntityType.Contact, customFields)
    expect(result).toEqual({})
  })

  it('should not change anything if there are no datetime custom fields', async () => {
    const customFields = {
      string: 'value1',
      number: 1230
    }
    const z = createFakeZObject(200, {items: definitions})
    const result = await reformatDatetimeCustomFields(z, EntityType.Contact, customFields)
    expect(result).toEqual(customFields)
  })

  it('should properly format datetime custom fields', async () => {
    const customFields = {
      string: 'value1',
      number: 1230,
      date: '2010-12-20T01:20:00-11:00',
      date_time: '2010-12-20T23:40:00+11:00',
      not_a_date_field: '2010/11/11 12:12'
    }

    const z = createFakeZObject(200, {items: definitions})
    const result = await reformatDatetimeCustomFields(z, EntityType.Contact, customFields)
    expect(result).toEqual({
      string: 'value1',
      number: 1230,
      date: '2010-12-20',
      date_time: '2010-12-20T23:40:00Z',
      not_a_date_field: '2010/11/11 12:12'
    })
  })
})

describe('formatDateAndTimeCustomFields', () => {
  it('should properly format different dates', () => {
    const formatDate = (value: string) => formatDateAndTimeCustomFields(RawCustomFieldType.Date, value)
    expect(formatDate('2010-12-20T13:40:50Z')).toEqual('2010-12-20')
    expect(formatDate('2010-12-20T23:40:50+11:00')).toEqual('2010-12-20')
    expect(formatDate('2010-12-20T01:40:50-11:00')).toEqual('2010-12-20')
  })

  it('should properly format different datetimes', () => {
    const formatDate = (value: string) => formatDateAndTimeCustomFields(RawCustomFieldType.DateTime, value)
    expect(formatDate('2010-12-20T13:40:50Z')).toEqual('2010-12-20T13:40:50Z')
    expect(formatDate('2010-12-20T23:40:50+11:00')).toEqual('2010-12-20T23:40:50Z')
    expect(formatDate('2010-12-20T01:40:50-11:00')).toEqual('2010-12-20T01:40:50Z')
  })
})
