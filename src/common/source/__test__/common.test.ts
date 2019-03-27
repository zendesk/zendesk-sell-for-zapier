import {ResourceType} from '../../../utils/api'
import {sourceEndpoint} from '../common'

describe('sourceEndpoint', () => {
  it('should throw error if not supported value is passed', () => {
    expect(() => sourceEndpoint(ResourceType.Contact)).toThrowError()
  })

  it('should return valid url for leads', () => {
    expect(sourceEndpoint(ResourceType.Lead)).toEqual('https://api.getbase.com/v2/lead_sources')
  })
})
