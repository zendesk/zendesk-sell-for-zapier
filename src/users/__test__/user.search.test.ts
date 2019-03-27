import App from '../..'
import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as usersResponse from './usersResponse.fixture.json'
import {UserSearch} from '../user.search'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('search users', () => {
  it('should return empty array without calling api if filters are not present', async () => {
    const bundle = {
      inputData: {}
    }

    const response = await appTester(App.searches[UserSearch.key].operation.perform, bundle)
    expect(response).toHaveLength(0)
  })

  it('should pass only supported filters to search endpoint', async () => {
    const bundle = {
      inputData: {
        email: 'uzi@getbase.com',
        first_name: 'Uzi'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/users')
      .query({
        email: 'uzi@getbase.com',
        per_page: 100,
        page: 1
      })
      .reply(200, usersResponse)

    const response: any = await appTester(App.searches[UserSearch.key].operation.perform, bundle)
    expect(response).toHaveLength(1)
    expect(response[0].name).toEqual('Uzi')
  })

  it('should fetch user directly if only id filter is passed', async () => {
    const bundle = {
      inputData: {
        id: 1234
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/users/1234')
      .reply(200, {data: {id: 1234, email: 'uzi@getbase.com'}})

    const response: any = await appTester(App.searches[UserSearch.key].operation.perform, bundle)
    expect(response).toHaveLength(1)
    expect(response[0].email).toEqual('uzi@getbase.com')
  })
})
