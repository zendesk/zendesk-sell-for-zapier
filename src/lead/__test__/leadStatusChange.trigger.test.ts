import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../index'
import * as multipleLeads from './multipleLeads.fixture.json'
import * as unqualifiedLeads from './unqualifiedLeads.fixture.json'
import {LeadStatusChangeTrigger} from '../leadStatusChange.trigger'
import {assertDeduplicationIds} from '../../utils/testHelpers'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()


describe('lead status change trigger', () => {
  it('should fetch lead sorted by updated_at', async () => {
    const bundle = {
      inputData: {}
    }

    nock('https://api.getbase.com/v2')
      .get('/leads')
      .query({
        sort_by: 'updated_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleLeads)


    const results = await appTester(App.triggers[LeadStatusChangeTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(results, [1, 2], ['1_New', '2_Unqualified'])
  })

  it('should fetch leads sorted by updated_at and filtered by status if provided', async () => {
    const bundle = {
      inputData: {
        status: 'Unqualified'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/leads')
      .query({
        sort_by: 'updated_at:desc',
        status: 'Unqualified',
        page: 1,
        per_page: 100
      })
      .reply(200, unqualifiedLeads)

    const results = await appTester(App.triggers[LeadStatusChangeTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(3)
    assertDeduplicationIds(
      results,
      [100, 200, 300],
      ['100_Unqualified 2', '200_Unqualified 1', '300_Unqualified 3']
    )
  })
})
