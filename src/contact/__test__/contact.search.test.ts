import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as multipleContacts from './multipleContacts.fixture.json'
import App from '../..'
import {ContactSearch} from '../contact.search'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('search contact resources', () => {
  it('should return empty array without calling api if filters are not present', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        'search.id': null,
        name: 'Uzi'
      }
    }

    const results = await appTester(App.searches[ContactSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(0)
  })

  it('should pass only not empty and supported fields to contacts endpoint', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        'search.id': null,
        'search.name': undefined,
        'search.unsupported_filter': 'value',
        'search.is_organization': false,
        'search.first_name': 'Jakub Tutaj'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts')
      .query({
        is_organization: false,
        first_name: 'Jakub Tutaj',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleContacts)

    const results = await appTester(App.searches[ContactSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })

  it('should fetch contact directly if id is passed', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        'search.id': 4556,
        'search.first_name': 'Jakub Tutaj'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts/4556')
      .reply(200, {data: {id: 4556, first_name: 'Uzi'}})

    const results = await appTester(App.searches[ContactSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(1)

    const uzi: any = results[0]
    expect(uzi.first_name).toEqual('Uzi')
  })

  it('should pass if only id filter is defined', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        'search.id': 4556
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts/4556')
      .reply(200, {data: {id: 4556, first_name: 'Uzi'}})

    const results = await appTester(App.searches[ContactSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(1)

    const uzi: any = results[0]
    expect(uzi.first_name).toEqual('Uzi')
  })
})
