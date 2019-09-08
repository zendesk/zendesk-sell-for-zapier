import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../index'
import UpdatedLeadTrigger from '../updatedLead.trigger'
import * as multipleLeads from './multipleLeads.fixture.json'
import {assertDeduplicationIds} from '../../utils/testHelpers'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('update lead trigger', () => {
  it('should fetch leads sorted by updated_at', async () => {
    const bundle = {}

    nock('https://api.getbase.com/v2')
      .get('/leads')
      .query({
        sort_by: 'updated_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleLeads)

    const results = await appTester(App.triggers[UpdatedLeadTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(
      results,
      [1, 2],
      ['1_2019-09-04T08:28:59Z', '2_2019-01-01T08:00:00Z']
    )
  })

  it('should fetch leads sorted by update_at and generate deduplication based on passed trigger field', async () => {
    const bundle = {
      inputData: {
        trigger_field: 'custom_fields.Custom Field 1'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/leads')
      .query({
        sort_by: 'updated_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleLeads)

    const results = await appTester(App.triggers[UpdatedLeadTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(
      results,
      [1, 2],
      ['1_Value 111', '2_Value 222']
    )
  })
})
