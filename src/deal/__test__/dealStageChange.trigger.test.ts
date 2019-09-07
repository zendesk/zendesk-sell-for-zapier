import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as multipleDeals from './multipleDeals.fixture.json'
import App from '../..'
import {DealStageChangeTrigger} from '../dealStageChange.trigger'
import {assertDeduplicationIds} from '../../utils/testHelpers'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('deal stage change trigger', () => {
  it('should use only stage_id in filters while listing deals', async () => {
    const bundle = {
      inputData: {
        pipeline_id: 100,
        stage_id: 200
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/deals')
      .query({
        stage_id: 200,
        sort_by: 'last_stage_change_at:desc',
        per_page: 100,
        page: 1
      })
      .reply(200, multipleDeals)

    const results = await appTester(App.triggers[DealStageChangeTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(
      results,
      [51753911, 53024259],
      ['51753911_2018-05-16T11:35:16Z', '53024259_2018-07-13T14:29:43Z']
    )
  })

  it('should use only deal which have stage_change_at different than create date', async () => {
    const bundle = {
      inputData: {}
    }

    const response = {
      items: [
        {data: {id: 1, created_at: '2018-05-16T11:34:51Z', last_stage_change_at: '2018-05-16T11:35:16Z'}},
        {data: {id: 2, created_at: '2018-07-13T14:24:43Z', last_stage_change_at: '2018-07-13T14:24:43Z'}},
      ],
      meta: {}
    }

    nock('https://api.getbase.com/v2')
      .get('/deals')
      .query({
        sort_by: 'last_stage_change_at:desc',
        per_page: 100,
        page: 1
      })
      .reply(200, response)

    const results = await appTester(App.triggers[DealStageChangeTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(1)
    assertDeduplicationIds(
      results,
      [1],
      ['1_2018-05-16T11:35:16Z']
    )
  })
})
