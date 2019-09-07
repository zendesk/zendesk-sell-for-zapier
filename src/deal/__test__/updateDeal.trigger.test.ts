import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as multipleDeals from './multipleDeals.fixture.json'
import App from '../..'
import {assertDeduplicationIds} from '../../utils/testHelpers'
import DealUpdatedTrigger from '../updateDeal.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('deals update trigger', () => {
  it('should fetch deals sorted by updated_at', async () => {
    const bundle = {}

    nock('https://api.getbase.com/v2')
      .get('/deals')
      .query({
        sort_by: 'updated_at:desc',
        per_page: 100,
        page: 1
      })
      .reply(200, multipleDeals)

    const results = await appTester(App.triggers[DealUpdatedTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(
      results,
      [51753911, 53024259],
      ['51753911_2019-05-18T11:35:16Z', '53024259_2018-07-15T14:24:49Z']
    )
  })
})
