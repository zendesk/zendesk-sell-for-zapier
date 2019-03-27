import {createLeadName, leadCreateFieldsValidation} from '../common'

describe('createLeadName', () => {
  it('should return only last name if first is not provided', () => {
    const lead = {
      first_name: null,
      last_name: 'Kiszal',
    }
    expect(createLeadName(lead)).toBe('Kiszal')
  })

  it('should return concatenated first and last name if provided', () => {
    const lead = {
      first_name: 'Bart',
      last_name: 'Kiszal'
    }
    expect(createLeadName(lead)).toBe('Bart Kiszal')
  })

  it('should return company name if last name is not provided', () => {
    const lead = {
      first_name: 'Bart',
      organization_name: 'Base CRM'
    }
    expect(createLeadName(lead)).toBe('Base CRM')
  })
})

describe('leadCreateFieldsValidation', () => {
  it('should throw error when last name or company name is missing', () => {
    const input = {
      first_name: 'Josh'
    }
    expect(() => leadCreateFieldsValidation(input)).toThrowError('Make sure a lead has at least Last Name or Company Name provided.')
  })

  it('should throw error when first name and company name are provided', () => {
    const input = {
      first_name: 'Josh',
      organization_name: 'Zendesk Sell'
    }
    expect(() => leadCreateFieldsValidation(input)).toThrowError('Last Name can\'t be blank')
  })

  it('should pass if either company name or last name is provided', () => {
    const lastNameInput = {
      first_name: 'Josh',
      last_name: 'Smith',
      title: 'CEO'
    }
    expect(leadCreateFieldsValidation(lastNameInput)).toEqual(lastNameInput)

    const companyNameInput = {
      organization_name: 'Zendesk Sell',
      tags: ['a', 'b', 'c']
    }
    expect(leadCreateFieldsValidation(companyNameInput)).toEqual(companyNameInput)
  })
})
