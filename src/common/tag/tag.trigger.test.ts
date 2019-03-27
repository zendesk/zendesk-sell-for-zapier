import App from '../../index'
import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as tagsResponse from './tagsResponse.fixture.json'
import {DealTagsDropdownList} from './tag.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('list tags', () => {
  it('should send request with resource_type filter while fetching tags', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        resource_type: 'deal',
        id: 200,
        filter: 'value'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/tags')
      .query({
        resource_type: 'deal',
        per_page: 100,
        page: 1
      })
      .reply(200, tagsResponse)

    const response = await appTester(App.triggers[DealTagsDropdownList.key].operation.perform, bundle)
    expect(response).toHaveLength(2)
    expect(response.map((item: any) => item.name)).toEqual(['Tag1', 'Tag2'])
  })
})
