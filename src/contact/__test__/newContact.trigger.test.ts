import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../..'
import * as multipleContacts from './multipleContacts.fixture.json'
import {ListCompaniesDropdown, ListContactDropdown, NewContactTrigger} from '../newContact.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('new contact trigger', () => {
  it('should pass only is_organization property and fetch contacts', async () => {
    const bundle = {
      inputData: {
        last_name: 'Smith',
        is_organization: true
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts')
      .query({
        sort_by: 'created_at:desc',
        is_organization: true,
        page: 1,
        per_page: 100
      })
      .reply(200, multipleContacts)

    const results = await appTester(App.triggers[NewContactTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })
})

describe('contact dropdowns', () => {
  it('should fetch only companies in companies dropdown trigger', async () => {
    const bundle = {
      inputData: {
        name: 'Base CRM'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts')
      .query({
        is_organization: true,
        page: 1,
        per_page: 100
      })
      .reply(200, multipleContacts)

    const results = await appTester(App.triggers[ListCompaniesDropdown.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })

  it('should fetch all contacts on contacts dropdown trigger', async () => {
    const bundle = {
      inputData: {
        first_name: 'John'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts')
      .query({
        page: 1,
        per_page: 100
      })
      .reply(200, multipleContacts)

    const results = await appTester(App.triggers[ListContactDropdown.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })
})
