import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../..'
import * as multipleLeads from './multipleLeads.fixture.json'
import {ListLeadsDropdown, NewLeadTrigger} from '../newLead.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('new lead trigger', () => {
  it('should fetch leads sorted by created_at', async () => {
    const bundle = {
      inputData: {
        last_name: 'Smith'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/leads')
      .query({
        sort_by: 'created_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleLeads)

    const results = await appTester(App.triggers[NewLeadTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })
})

describe('leads dropdown', () => {
  it('should ignore params from bundle.inputData and fetch all leads', async () => {
    const bundle = {
      inputData: {
        last_name: 'Smith'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/leads')
      .query({
        page: 1,
        per_page: 100
      })
      .reply(200, multipleLeads)

    const results = await appTester(App.triggers[ListLeadsDropdown.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })
})
