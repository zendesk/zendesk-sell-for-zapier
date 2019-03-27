import {createFakeZObject} from '../../../utils/testHelpers'
import {fetchCustomFields} from '../fetch'
import {EntityType} from '../../../utils/api'

describe('fetchCustomFields', () => {
  const withData = (items: any[]) => items.map((item) => ({data: item}))

  describe('contact custom fields', () => {
    const contactCustomFields = [
      {
        id: 1,
        name: 'Name',
        type: 'string',
        for_organisation: true,
        for_contact: true
      },
      {
        id: 2,
        name: 'Person Age',
        type: 'number',
        for_organisation: false,
        for_contact: true
      },
      {
        id: 3,
        name: 'Company Industry',
        type: 'multi_select_list',
        for_organisation: true,
        for_contact: false,
        options: [
          {id: 1, name: 'TypeA'},
          {id: 2, name: 'TypeB'},
        ]
      }
    ]
    it('should return only custom fields applicable for companies', async () => {
      const zObject = createFakeZObject(200, {
        items: withData(contactCustomFields)
      })

      const customFields = await fetchCustomFields(EntityType.Company, zObject)

      expect(customFields).toHaveLength(2)
      expect(customFields[0]).toHaveProperty('name', 'Name')
      expect(customFields[1]).toHaveProperty('name', 'Company Industry')
      expect(customFields[1]).toHaveProperty('choices', [{id: 1, name: 'TypeA'}, {id: 2, name: 'TypeB'}])

      expect(zObject.url()).toEqual('https://api.getbase.com/v2/contact/custom_fields')
      expect(zObject.count()).toEqual(1)
    })

    it('should return only custom fields applicable for people', async () => {
      const zObject = createFakeZObject(200, {
        items: withData(contactCustomFields)
      })

      const customFields = await fetchCustomFields(EntityType.Person, zObject)

      expect(customFields).toHaveLength(2)
      expect(customFields[0]).toHaveProperty('name', 'Name')
      expect(customFields[1]).toHaveProperty('name', 'Person Age')
      expect(customFields[1]).toHaveProperty('type', 'number')

      expect(zObject.url()).toEqual('https://api.getbase.com/v2/contact/custom_fields')
      expect(zObject.count()).toEqual(1)
    })

  })

  it('should return custom fields applicable for deals', async () => {
    const zObject = createFakeZObject(200, {
      items: withData([
        {
          id: 1,
          name: 'Is Hot',
          type: 'boolean'
        }
      ])
    })

    const customFields = await fetchCustomFields(EntityType.Deal, zObject)

    expect(customFields).toHaveLength(1)
    expect(customFields[0]).toHaveProperty('name', 'Is Hot')

    expect(zObject.url()).toEqual('https://api.getbase.com/v2/deal/custom_fields')
    expect(zObject.count()).toEqual(1)
  })

  it('should return custom fields applicable for leads', async () => {
    const zObject = createFakeZObject(200, {
      items: withData([
        {
          id: 1,
          name: 'Status change',
          type: 'date'
        }
      ])
    })

    const customFields = await fetchCustomFields(EntityType.Lead, zObject)

    expect(customFields).toHaveLength(1)
    expect(customFields[0]).toHaveProperty('name', 'Status change')

    expect(zObject.url()).toEqual('https://api.getbase.com/v2/lead/custom_fields')
    expect(zObject.count()).toEqual(1)
  })

  describe('custom field choices', () => {
    it('should extract custom fields choices from choices field if present', async () => {
      const zObject = createFakeZObject(200, {
        items: withData([
          {
            id: 1,
            name: 'MultiSelect Custom Field',
            type: 'multi_select_list',
            options: [
              {id: 1, name: 'TypeA'},
              {id: 2, name: 'TypeB'},
            ]
          }
        ])
      })

      const customFields = await fetchCustomFields(EntityType.Lead, zObject)
      expect(customFields).toHaveLength(1)
      const multiSelectCustomFIeld = customFields[0]
      expect(multiSelectCustomFIeld).toHaveProperty('name', 'MultiSelect Custom Field')
      expect(multiSelectCustomFIeld).toHaveProperty('choices', [{id: 1, name: 'TypeA'}, {id: 2, name: 'TypeB'}])
    })

    it('should extract custom fields choices from options field if present', async () => {
      const zObject = createFakeZObject(200, {
        items: withData([
          {
            id: 1,
            name: 'MultiSelect Custom Field',
            type: 'multi_select_list',
            choices: [
              {id: 1, name: 'TypeA'},
              {id: 2, name: 'TypeB'},
            ]
          }
        ])
      })

      const customFields = await fetchCustomFields(EntityType.Lead, zObject)
      expect(customFields).toHaveLength(1)
      const multiSelectCustomFIeld = customFields[0]
      expect(multiSelectCustomFIeld).toHaveProperty('name', 'MultiSelect Custom Field')
      expect(multiSelectCustomFIeld).toHaveProperty('choices', [{id: 1, name: 'TypeA'}, {id: 2, name: 'TypeB'}])
    })
  })
})
