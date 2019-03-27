import {createFakeBundle, createFakeZObject} from '../../utils/testHelpers'
import {leadsEndpoint} from '../../lead/common'
import {appendFieldsProcessor} from '../fieldAppenders'

describe('appendFieldsProcessor', () => {
  it('should return raw input if existing item doesn\'t have fields specified', async () => {
    const z = createFakeZObject(200, {
      data: {
        id: 250
      }
    })

    const bundle = createFakeBundle({id: 250, last_name: 'Smith', tags: ['a', 'b']})
    const fields = await appendFieldsProcessor(z, bundle, leadsEndpoint)(bundle.inputData)
    expect(fields).toEqual({
      id: 250,
      last_name: 'Smith',
      tags: ['a', 'b']
    })
    expect(z.url()).toEqual('https://api.getbase.com/v2/leads/250')
  })


  it('should append tags to input if existing item has some defined', async () => {
    const z = createFakeZObject(200, {
      data: {
        id: 100,
        first_name: 'John',
        tags: ['a', 'b']
      }
    })

    const bundle = createFakeBundle({id: 100, last_name: 'Smith', tags: ['c', 'd']})
    const fields = await appendFieldsProcessor(z, bundle, leadsEndpoint)(bundle.inputData)
    expect(fields).toEqual({
      id: 100,
      last_name: 'Smith',
      tags: ['a', 'b', 'c', 'd']
    })
  })

  it('should not add values if they are empty', async () => {
    const z = createFakeZObject(200, {
      data: {
        id: 100,
        first_name: 'John',
        tags: []
      }
    })

    const bundle = createFakeBundle({id: 100, last_name: 'Smith'})
    const fields = await appendFieldsProcessor(z, bundle, leadsEndpoint)(bundle.inputData)
    expect(fields).toEqual({
      id: 100,
      last_name: 'Smith'
    })
  })

  it('should properly pass multiselect cfs if existing item doesn\'t have any', async () => {
    const z = createFakeZObject(200, {
      data: {
        id: 100,
        first_name: 'John'
      }
    })
    const bundle = createFakeBundle({
      id: 100,
      'custom_fields.value1': ['a', 'b'],
      'custom_fields.value2': [],
    })

    const fields = await appendFieldsProcessor(z, bundle, leadsEndpoint)(bundle.inputData)
    expect(fields).toEqual({
      id: 100,
      'custom_fields.value1': ['a', 'b'],
      'custom_fields.value2': [],
    })
  })

  it('should properly append multiselect cfs', async () => {
    const z = createFakeZObject(200, {
      data: {
        id: 100,
        first_name: 'John',
        custom_fields: {
          dropdown: 'antek',
          value1: ['a', 'b'],
          value3: ['1', '2']
        }
      }
    })
    const bundle = createFakeBundle({
      id: 100,
      'custom_fields.value1': ['c', 'd'],
      'custom_fields.value2': [],
    })
    const fields = await appendFieldsProcessor(z, bundle, leadsEndpoint)(bundle.inputData)
    expect(fields).toEqual({
      id: 100,
      'custom_fields.value1': ['a', 'b', 'c', 'd'],
      'custom_fields.value2': []
    })
  })

  it('should not duplicate existing values in array fields', async () => {
    const z = createFakeZObject(200, {
      data: {
        id: 100,
        first_name: 'John',
        tags: ['123'],
        custom_fields: {
          dropdown: 'antek',
          value1: ['a', 'b'],
          value2: ['1', '2']
        }
      }
    })
    const bundle = createFakeBundle({
      id: 100,
      tags: ['123', '124'],
      'custom_fields.value1': ['a', 'b', 'c'],
      'custom_fields.value2': ['1', '2'],
    })
    const fields = await appendFieldsProcessor(z, bundle, leadsEndpoint)(bundle.inputData)
    expect(fields).toEqual({
      id: 100,
      tags: ['123', '124'],
      'custom_fields.value1': ['a', 'b', 'c'],
      'custom_fields.value2': ['1', '2']
    })
  })

})
