import {convertToUtc, formatAddressFields, outfilterSearchFields, pickOnlySearchFields} from '../fieldsHelpers'

describe('formatAddressFields', () => {
  it('should return empty object if empty input was passed', () => {
    expect(formatAddressFields({})).toEqual({})
  })

  it('should return object without changes if address fields are not available', () => {
    const inputData = {
      first_name: 'John',
      title: 'CEO',
      address_fake: 'fake'
    }

    expect(formatAddressFields(inputData)).toEqual(inputData)
  })

  it('should properly extract address fields from bundle and properly nest them', () => {
    const inputData = {
      first_name: 'John',
      title: 'CEO',
      'address.line1': 'Street',
      'address.postal_code': '1234',
      'address.country': 'USA'
    }

    expect(formatAddressFields(inputData)).toEqual({
      first_name: 'John',
      title: 'CEO',
      address: {
        line1: 'Street',
        postal_code: '1234',
        country: 'USA'
      }
    })
  })
})

describe('convertToUtc', () => {
  it('should return input if not defined', () => {
    expect(convertToUtc(null)).toBeNull()
  })

  it('should return input if it\'s not valid date', () => {
    expect(convertToUtc('not a date')).toEqual('not a date')
  })

  it('should return properly utcized value', () => {
    expect(convertToUtc('2018-10-28T12:04:10+06:00')).toEqual('2018-10-28T06:04:10Z')
  })
})

describe('searchPrefixedFields', () => {
  const fields = {
    'search.id': 1234,
    'not.search.field': 'Value1',
    'id': 400,
    'search.company_name': 'Zendesk'
  }

  it('should properly remove only search prefixed fields', () => {
    expect(outfilterSearchFields(fields)).toEqual({
      'not.search.field': 'Value1',
      'id': 400
    })
  })

  it('should pick only search fields and remove theirs prefixes', () => {
    expect(pickOnlySearchFields(fields)).toEqual({
      id: 1234,
      company_name: 'Zendesk'
    })
  })
})
