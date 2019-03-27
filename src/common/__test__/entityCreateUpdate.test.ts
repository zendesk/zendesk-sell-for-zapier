import {createFakeActionDetails, createFakeBundle, createMappingZObject} from '../../utils/testHelpers'
import {createEntity, createOrUpdateEntity, updateEntity} from '../entityCreateUpdate'
import {ActionType} from '../../utils/operations'
import {EntityType} from '../../utils/api'

describe('createEntity', () => {
  it('should send processed data using post', async () => {
    const endpoint = 'https://api.getbase.com/v2/contacts'
    const bundle = createFakeBundle({
      name: 'John',
      description: 'Description',
      'custom_fields.multi_select': ['a', 'b', 'c'],
      'address.line1': 'Wyczolkowskiego 7'
    })
    const z = createMappingZObject([
      [200, {items: []}],
      [200, {data: {id: 200}}]
    ])

    const result = await createEntity(endpoint, createFakeActionDetails(), EntityType.Contact)(z, bundle)
    expect(result).toHaveProperty('id', 200)

    expect(z.count()).toEqual(2)
    expect(z.url(0)).toEqual('https://api.getbase.com/v2/contact/custom_fields')
    expect(z.url(1)).toEqual('https://api.getbase.com/v2/contacts')

    const requestOptions = z.options(1)
    expect(requestOptions).toHaveProperty('method', 'POST')
    expect(requestOptions).toHaveProperty('body', {
      data: {
        name: 'John',
        description: 'Description',
        address: {
          line1: 'Wyczolkowskiego 7'
        },
        custom_fields: {
          multi_select: ['a', 'b', 'c']
        }
      }
    })
  })

  it('should properly format date and datetime custom fields', async () => {
    const endpoint = 'https://api.getbase.com/v2/contacts'
    const bundle = createFakeBundle({
      name: 'John',
      'custom_fields.date_time': '2018-10-30T19:00:00+09:00',
      'custom_fields.date': '2012-05-12T03:00:00+09:00'
    })
    const customFieldsDefinitions = [
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
    const z = createMappingZObject([
      [200, {items: customFieldsDefinitions}],
      [200, {data: {id: 200}}]
    ])

    await createEntity(endpoint, createFakeActionDetails(), EntityType.Contact)(z, bundle)
    expect(z.count()).toEqual(2)
    expect(z.url(0)).toEqual('https://api.getbase.com/v2/contact/custom_fields')
    expect(z.url(1)).toEqual('https://api.getbase.com/v2/contacts')

    const requestOptions = z.options(1)
    expect(requestOptions).toHaveProperty('method', 'POST')
    expect(requestOptions).toHaveProperty('body', {
      data: {
        name: 'John',
        custom_fields: {
          date_time: '2018-10-30T19:00:00Z',
          date: '2012-05-12'
        }
      }
    })
  })
})

describe('updateEntity', () => {
  it('should remove id from payload and send processed data using put', async () => {
    const endpoint = 'https://api.getbase.com/v2/leads'
    const bundle = createFakeBundle({
      id: 100,
      name: 'John',
      'custom_fields.dropdown': 'Value1'
    })

    const z = createMappingZObject([
      [200, {data: {id: 100}}],
      [200, {items: []}],
      [200, {data: {id: 100}}]
    ])

    const result = await updateEntity(endpoint, createFakeActionDetails(), EntityType.Lead)(z, bundle)
    expect(result).toHaveProperty('id', 100)

    expect(z.count()).toEqual(3)
    expect(z.url(1)).toEqual('https://api.getbase.com/v2/lead/custom_fields')
    expect(z.url(2)).toEqual('https://api.getbase.com/v2/leads/100')

    const putRequestOptions = z.options(2)
    expect(putRequestOptions).toHaveProperty('method', 'PUT')
    expect(putRequestOptions).toHaveProperty('body', {
      data: {
        name: 'John',
        custom_fields: {
          dropdown: 'Value1'
        }
      }
    })
  })

  it('should update tags to existing ones while updating entity', async () => {
    const endpoint = 'https://api.getbase.com/v2/leads'
    const bundle = createFakeBundle({
      id: 100,
      name: 'John',
      tags: ['b', 'c']
    })

    const z = createMappingZObject([
      [200, {data: {id: 100, tags: ['a', 'b']}}],
      [200, {items: []}],
      [200, {data: {id: 100}}]
    ])

    const result = await updateEntity(endpoint, createFakeActionDetails(), EntityType.Lead)(z, bundle)
    expect(result).toHaveProperty('id', 100)

    expect(z.count()).toEqual(3)
    expect(z.url(1)).toEqual('https://api.getbase.com/v2/lead/custom_fields')
    expect(z.url(2)).toEqual('https://api.getbase.com/v2/leads/100')

    const putRequestOptions = z.options(2)
    expect(putRequestOptions).toHaveProperty('method', 'PUT')
    expect(putRequestOptions).toHaveProperty('body', {
      data: {
        name: 'John',
        tags: ['a', 'b', 'c']
      }
    })
  })
})

describe('createOrUpdateEntity', () => {
  it('should call create if item doesn\'t exist', async () => {
    const endpoint = 'https://api.getbase.com/v2/deals'
    const bundle = createFakeBundle({
      id: 100,
      name: 'John',
      'custom_fields.dropdown': 'Value1'
    })

    const z = createMappingZObject([
      [404, {errors: [], meta: {}}],
      [200, {items: []}],
      [200, {data: {id: 101}}]
    ])

    const result = await createOrUpdateEntity(endpoint, createFakeActionDetails(), EntityType.Deal)(z, bundle)
    expect(result).toHaveProperty('id', 101)

    expect(z.count()).toEqual(3)
    expect(z.url(0)).toEqual('https://api.getbase.com/v2/deals/100')
    expect(z.url(1)).toEqual('https://api.getbase.com/v2/deal/custom_fields')
    expect(z.url(2)).toEqual('https://api.getbase.com/v2/deals')

    const postRequestOptions = z.options(2)
    expect(postRequestOptions).toHaveProperty('method', 'POST')
    expect(postRequestOptions).toHaveProperty('body', {
      data: {
        name: 'John',
        custom_fields: {
          dropdown: 'Value1'
        }
      }
    })
  })

  it('should call update if item exists', async () => {
    const endpoint = 'https://api.getbase.com/v2/deals'
    const bundle = createFakeBundle({
      id: 100,
      name: 'John',
      'custom_fields.dropdown': 'Value1'
    })

    const z = createMappingZObject([
      [200, {data: {id: 100}}],
      [200, {data: {id: 100}}],
      [200, {items: []}],
      [200, {data: {id: 100}}]
    ])

    const result = await createOrUpdateEntity(endpoint, createFakeActionDetails(), EntityType.Deal)(z, bundle)
    expect(result).toHaveProperty('id', 100)
    expect(z.url(3)).toEqual('https://api.getbase.com/v2/deals/100')
    expect(z.options(3)).toHaveProperty('method', 'PUT')
  })

  it('should pass action details within headers', async () => {
    const endpoint = 'https://api.getbase.com/v2/deals'
    const bundle = createFakeBundle({
      id: 100,
      name: 'John'
    })

    const z = createMappingZObject([
      [200, {data: {id: 100}}],
      [200, {data: {id: 100}}],
      [200, {items: []}],
      [200, {data: {id: 100}}]
    ])

    const result = await createOrUpdateEntity(
      endpoint,
      {
        actionType: ActionType.Create,
        actionName: 'create_or_update_entity',
        actionId: '1234asdf'
      },
      EntityType.Deal
    )(z, bundle)

    expect(result).toHaveProperty('id', 100)
    expect(z.url(3)).toEqual('https://api.getbase.com/v2/deals/100')
    expect(z.options(3)).toHaveProperty('headers', {
      'X-Clientapp-Operation-Type': 'create',
      'X-Clientapp-Operation-Name': 'create_or_update_entity',
      'X-Clientapp-Operation-Id': '1234asdf'
    })
  })
})
