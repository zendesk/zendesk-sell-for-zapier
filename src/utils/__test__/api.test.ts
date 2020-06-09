import {extractPageParameter, fetchResourceAsArray, hasIdDefined, SortOrder, sortParameter} from '../api'
import {Bundle} from 'zapier-platform-core'
import {createFakeBundle, createFakeZObject} from '../testHelpers'

describe('sortParameter', () => {
  it('should return empty object if sort field is not specified', () => {
    const sortDefinition = sortParameter()
    expect(sortDefinition).toEqual({})
  })

  it('should return sort with descending order if not specified', () => {
    const sortDefinition = sortParameter({fieldName: 'first_name'})
    expect(sortDefinition).toEqual({
      'sort_by': 'first_name:desc'
    })
  })

  it('should build valid sort parameter if all fields are specified', () => {
    const sortDefinition = sortParameter({fieldName: 'first_name', order: SortOrder.Asc})
    expect(sortDefinition).toEqual({
      'sort_by': 'first_name:asc'
    })
  })
})

describe('hasIdDefined', () => {
  const createBundle = (id: any): Bundle => createFakeBundle({id})

  it('should return false for string value', () => {
    expect(hasIdDefined(createBundle('string'))).toBe(false)
  })

  it('should return false for string prefixed with numeric string', () => {
    expect(hasIdDefined(createBundle('1234_value'))).toBe(false)
  })

  it('should return true for valid number', () => {
    expect(hasIdDefined(createBundle('12344567'))).toBe(true)
    expect(hasIdDefined(createBundle(12344567))).toBe(true)
  })

  it('should return false for empty input', () => {
    expect(hasIdDefined(createBundle(null))).toBe(false)
    expect(hasIdDefined(createBundle(undefined))).toBe(false)
  })
})

describe('fetchResourceAsArray', () => {
  const resourceUrl = 'https://api.getbase.com/v2/resources'

  it('should return empty array if 404 is returned from api', async () => {
    const z = createFakeZObject(404, {})
    const bundle = createFakeBundle({id: 100})

    const items = await fetchResourceAsArray(z, bundle, resourceUrl)
    expect(items).toHaveLength(0)

    expect(z.url()).toEqual('https://api.getbase.com/v2/resources/100')
  })

  it('should return item wrapped with array', async () => {
    const z = createFakeZObject(200, {data: {id: 100, name: 'Uzi'}})
    const bundle = createFakeBundle({id: 100})

    const items = await fetchResourceAsArray(z, bundle, resourceUrl)
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveProperty('name', 'Uzi')

    expect(z.url()).toEqual('https://api.getbase.com/v2/resources/100')
  })
})

describe('extractPageParameter', () => {
  it('should return first page when 0 is present in meta', () => {
    const bundle = createFakeBundle({id: 100}, {page: 0, limit: null})
    const page = extractPageParameter(bundle)
    expect(page).toEqual({
      page: 1,
      per_page: 100
    })
  })

  it('should return first page when meta.page is not present', () => {
    const bundle = createFakeBundle({id: 100}, {page: null, limit: null})
    const page = extractPageParameter(bundle)
    expect(page).toEqual({
      page: 1,
      per_page: 100
    })
  })

  it('should return first page when 0 is present in meta and default is provided', () => {
    const bundle = createFakeBundle({id: 100}, {page: 0, limit: null})
    const page = extractPageParameter(bundle, 100)
    expect(page).toEqual({
      page: 1,
      per_page: 100
    })
  })

  it('should return proper API page', () => {
    const bundle = createFakeBundle({id: 100}, {page: 2, limit: null})
    const page = extractPageParameter(bundle)
    expect(page).toEqual({
      page: 3,
      per_page: 100
    })
  })
})
