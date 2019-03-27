import App from '../..'
import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as usersResponse from './usersResponse.fixture.json'
import {ListUsersDropdown} from '../user.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('list users', () => {
  it('should return all users without applying any filters', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        email: 'uzi@getbase.com',
        first_name: 'Uzi'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/users')
      .query({
        per_page: 100,
        page: 1
      })
      .reply(200, usersResponse)

    const response: any = await appTester(App.triggers[ListUsersDropdown.key].operation.perform, bundle)
    expect(response).toHaveLength(1)
    expect(response[0].name).toEqual('Uzi')
  })

  it('should not apply filters even if id parameter is passed', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        id: 1235,
        first_name: 'Uzi'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/users')
      .query({
        per_page: 100,
        page: 1
      })
      .reply(200, usersResponse)

    const response: any = await appTester(App.triggers[ListUsersDropdown.key].operation.perform, bundle)
    expect(response).toHaveLength(1)
    expect(response[0].name).toEqual('Uzi')
  })
})
