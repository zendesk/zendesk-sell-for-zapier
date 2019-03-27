import {createFakeActionDetails, createFakeBundle, createFakeZObject, createMappingZObject} from '../../utils/testHelpers'
import {fetchItems, searchByCriteria, streamItems} from '../queries'
import {SortOrder} from '../../utils/api'
import {ActionType} from '../../utils/operations'

const endpoint = 'https://api.getbase.com/v2/entities'

describe('fetchByCriteria', () => {
  it('should fetch by id if it\'s defined in inputData', async () => {
    const z = createFakeZObject(200, {items: [{id: 10}]})
    const bundle = createFakeBundle({id: 10, company_name: 'Zendesk'})

    const response = await searchByCriteria(endpoint, createFakeActionDetails(), ['company_name'])(z, bundle)
    expect(response).toHaveLength(1)
    expect(z.count()).toEqual(1)
    expect(z.url()).toEqual('https://api.getbase.com/v2/entities/10')
  })

  it('should fetch by criteria if id is not defined', async () => {
    const z = createFakeZObject(200, {items: [{id: 10}]})
    const bundle = createFakeBundle({first_name: 'Josh', company_name: 'Zendesk'})

    const response = await searchByCriteria(endpoint, createFakeActionDetails(), ['company_name'])(z, bundle)
    expect(response).toHaveLength(1)
    expect(z.count()).toEqual(1)
    expect(z.options()).toHaveProperty('params', {
      company_name: 'Zendesk',
      page: 1,
      per_page: 100
    })
  })

  it('should add operations details to headers while querying by criteria', async () => {
    const z = createFakeZObject(200, {items: [{id: 10}]})
    const bundle = createFakeBundle({company_name: 'Zendesk'})

    const actionDetails = {
      actionType: ActionType.Search,
      actionName: 'search_entities',
      actionId: '1234asdf'
    }

    const response = await searchByCriteria(endpoint, actionDetails, ['company_name'])(z, bundle)
    expect(response).toHaveLength(1)
    expect(z.count()).toEqual(1)
    expect(z.options()).toHaveProperty('headers', {
      'X-Clientapp-Operation-Type': ActionType.Search,
      'X-Clientapp-Operation-Name': 'search_entities',
      'X-Clientapp-Operation-Id': '1234asdf'
    })
  })
})

describe('searchByCriteria', () => {
  it('should return empty array without calling backend if filters are not defined', async () => {
    const z = createFakeZObject(500, {})
    const bundle = createFakeBundle({company_name: 'Zendesk', employees: 200})

    const response = await searchByCriteria(endpoint, createFakeActionDetails(), ['first_name', 'last_name'])(z, bundle)
    expect(response).toHaveLength(0)
    expect(z.count()).toEqual(0)
  })

  it('should return empty array without calling backend if filters are nullable', async () => {
    const z = createFakeZObject(500, {})
    const bundle = createFakeBundle({first_name: null, last_name: undefined})

    const response = await searchByCriteria(endpoint, createFakeActionDetails(), ['first_name', 'last_name'])(z, bundle)
    expect(response).toHaveLength(0)
    expect(z.count()).toEqual(0)
  })

  it('should fetch entities by criteria if filters are defined', async () => {
    const z = createFakeZObject(200, {items: [{id: 10}]})
    const bundle = createFakeBundle({first_name: 'John', last_name: 'Smith', company_name: 'Zendesk'})

    const response = await searchByCriteria(endpoint, createFakeActionDetails(), ['first_name', 'last_name'])(z, bundle)
    expect(response).toHaveLength(1)
    expect(z.count()).toEqual(1)
    expect(z.options()).toHaveProperty('params', {
      first_name: 'John',
      last_name: 'Smith',
      page: 1,
      per_page: 100
    })
  })
})

describe('fetchItems', () => {
  it('should unpack page & sort params properly', async () => {
    const bundle = createFakeBundle({}, {page: 3})
    const z = createFakeZObject(200, {items: [{id: 10}]})

    const response = await fetchItems(endpoint, createFakeActionDetails())(z, bundle, {}, {
      fieldName: 'name',
      order: SortOrder.Desc
    })
    expect(response).toHaveLength(1)
    expect(z.options()).toHaveProperty('params', {sort_by: 'name:desc', page: 3, per_page: 100})
  })

  it('should pass additional params to query params', async () => {
    const bundle = createFakeBundle({}, {})
    const additionalFilters = {distinct: true}
    const z = createFakeZObject(200, {items: []})

    const response = await fetchItems(endpoint, createFakeActionDetails())(z, bundle, additionalFilters)
    expect(response).toHaveLength(0)
    expect(z.options()).toHaveProperty('params', {distinct: true, page: 1, per_page: 100})
  })
})

describe('streamItems', () => {
  const createItemsResponse = (ids: number[], hasNextPage: boolean) => {
    return {
      items: ids.map(id => ({data: {id}})),
      meta: {
        type: 'collection',
        count: ids.length,
        ...(hasNextPage ? {links: {next_page: endpoint}} : {})
      }
    }
  }

  it('should fetch only first page if call comes from web editor', async () => {
    const z = createMappingZObject([
      [200, createItemsResponse([1, 2, 3], true)],
      [200, createItemsResponse([4, 5, 6], true)],
      [200, createItemsResponse([7, 8, 9], false)],
    ])
    const bundle = createFakeBundle({}, {frontend: true})

    const items = await streamItems(endpoint, createFakeActionDetails(), [], 5)(z, bundle)
    expect(items).toHaveLength(3)
    expect(items.map((item: any) => item.id)).toEqual([1, 2, 3])

    expect(z.count()).toEqual(1)
    expect(z.options(0)).toHaveProperty('params', {per_page: 100, page: 1})
  })

  it('should fetch only first 3 pages if there is no more to fetch', async () => {
    const z = createMappingZObject([
      [200, createItemsResponse([1, 2, 3], true)],
      [200, createItemsResponse([4, 5, 6], false)],
    ])
    const bundle = createFakeBundle({})

    const items = await streamItems(endpoint, createFakeActionDetails(), [], 5)(z, bundle)
    expect(items).toHaveLength(6)
    expect(items.map((item: any) => item.id)).toEqual([1, 2, 3, 4, 5, 6])

    expect(z.count()).toEqual(2)
    expect(z.options(0)).toHaveProperty('params', {per_page: 100, page: 1})
    expect(z.options(1)).toHaveProperty('params', {per_page: 100, page: 2})
  })

  it('should fetch only number of pages limited by maxPages parameter even if there is more to load', async () => {
    const z = createMappingZObject([
      [200, createItemsResponse([1, 2, 3], true)],
      [200, createItemsResponse([4, 5, 6], true)],
      [200, createItemsResponse([7, 8, 9], true)],
      [200, createItemsResponse([10, 11, 12], false)]
    ])

    const bundle = createFakeBundle({})

    const items = await streamItems(endpoint, createFakeActionDetails(), [], 2)(z, bundle)
    expect(items).toHaveLength(6)
    expect(items.map((item: any) => item.id)).toEqual([1, 2, 3, 4, 5, 6])

    expect(z.count()).toEqual(2)
    expect(z.options(0)).toHaveProperty('params', {per_page: 100, page: 1})
    expect(z.options(1)).toHaveProperty('params', {per_page: 100, page: 2})
  })
})
