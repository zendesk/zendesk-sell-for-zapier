import {appendedResourceTypeProcessor, dynamicResourceField} from '../common'
import {ListLeadsDropdown} from '../../lead/newLead.trigger'
import {LeadSearch} from '../../lead/lead.search'
import {createFakeBundle, createFakeZObject} from '../../utils/testHelpers'

describe('dynamicResourceField', () => {
  const z = createFakeZObject(200, {})

  it('should return valid resource field for lead', () => {
    const bundle = createFakeBundle({resource_type: 'Lead'})
    expect(dynamicResourceField(z, bundle)).toEqual([{
      key: 'resource_id',
      label: 'Lead',
      helpText: 'After selecting the "Related To" field above, map the corresponding ID in this field. For example, if "Related To" is "Person" then you will map a Person ID here.',
      type: 'integer',
      dynamic: `${ListLeadsDropdown.key}.id.name`,
      search: `${LeadSearch.key}.id`,
      required: true
    }])
  })

  it('should return empty fields when resource is not provided', () => {
    const bundle = createFakeBundle({})
    expect(dynamicResourceField(z, bundle)).toEqual([])
  })

  it('should return static resource field when resource type cannot be recognized', () => {
    const bundle = createFakeBundle({resource_type: '{{placeholder}}'})
    expect(dynamicResourceField(z, bundle)).toEqual([{
      key: 'resource_id',
      label: 'Resource ID',
      helpText: 'After selecting the "Related To" field above, map the corresponding ID in this field. For example, if "Related To" is "Person" then you will map a Person ID here.',
      type: 'integer',
      required: true
    }])
  })
})

describe('appendedResourceTypeProcessor', () => {
  it('should return proper type for company', () => {
    const bundle = createFakeBundle({resource_type: 'Company'})
    expect(appendedResourceTypeProcessor(bundle.inputData)).toEqual({
      resource_type: 'contact'
    })
  })

  it('should return undefined if resource type is not specified', () => {
    const bundle = createFakeBundle({})
    expect(appendedResourceTypeProcessor(bundle.inputData)).toEqual({
      resource_type: undefined
    })
  })

  it('should return proper type for lead', () => {
    const bundle = createFakeBundle({resource_type: 'Lead'})
    expect(appendedResourceTypeProcessor(bundle.inputData)).toEqual({
      resource_type: 'lead'
    })
  })

  it('should pass custom type', () => {
    const bundle = createFakeBundle({resource_type: 'custom_type'})
    expect(appendedResourceTypeProcessor(bundle.inputData)).toEqual({
      resource_type: 'custom_type'
    })
  })
})
