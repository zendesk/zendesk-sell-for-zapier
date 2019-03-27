import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as multipleLeads from './multipleLeads.fixture.json'
import App from '../..'
import {LeadSearch} from '../lead.search'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('search lead resource', () => {
  it('should return empty array without calling api if filters are not present', async () => {
    const bundle = {
      inputData: {
        'search.id': null,
        'search.first_name': undefined
      }
    }

    const results = await appTester(App.searches[LeadSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(0)
  })

  it('should pass only not empty and supported field to leads endpoint', async () => {
    const bundle = {
      inputData: {
        'search.id': null,
        'search.first_name': undefined,
        'search.unsupported_filter': 'value',
        'search.organization_name': 'Base CRM',
        'search.email': 'tutaj@getbase.com'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/leads')
      .query({
        organization_name: 'Base CRM',
        email: 'tutaj@getbase.com',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleLeads)

    const results = await appTester(App.searches[LeadSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })

  it('should fetch lead directly if id is passed', async () => {
    const bundle = {
      inputData: {
        'search.id': 1090,
        'search.organization_name': 'Salesforce'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/leads/1090')
      .reply(200, {data: {id: 1090, organization_name: 'Base CRM'}})

    const results = await appTester(App.searches[LeadSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(1)

    const base: any = results[0]
    expect(base.organization_name).toEqual('Base CRM')
  })

  it('should pass only if id parameter is defined', async () => {
    const bundle = {
      inputData: {
        'search.id': 1090
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/leads/1090')
      .reply(200, {data: {id: 1090, organization_name: 'Base CRM'}})

    const results = await appTester(App.searches[LeadSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(1)

    const base: any = results[0]
    expect(base.organization_name).toEqual('Base CRM')
  })
})
