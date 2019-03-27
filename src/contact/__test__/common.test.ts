import {ContactType, organisationProperty} from '../common'

describe('organisationProperty', () => {
  it('should return empty object if type is not specified', () => {
    expect(organisationProperty()).toEqual({})
  })

  it('should return true if type is set to company', () => {
    expect(organisationProperty(ContactType.Company)).toEqual({is_organization: true})
  })

  it('should return false if type is set to person', () => {
    expect(organisationProperty(ContactType.Person)).toEqual({is_organization: false})
  })
})
