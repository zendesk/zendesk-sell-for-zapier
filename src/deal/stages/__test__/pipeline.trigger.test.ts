import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as pipelinesResponse from './pipelinesResponse.fixture.json'
import App from '../../..'
import {ListPipelineDropdown} from '../pipeline.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('list pipeline resources', () => {
  it('should return multiple pipelines for successful request', async () => {
    const bundle = {
      authData: {
        api_token: 'token'
      },
      inputData: {
        id: 100,
        filter: 'value',
        pipeline_id: 123,
        stage_id: 100
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/pipelines')
      .query({
        per_page: 100,
        page: 1
      })
      .reply(200, pipelinesResponse)

    const results: any = await appTester(App.triggers[ListPipelineDropdown.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    expect(results.map((item: any) => item.name)).toEqual(['Sales pipeline', 'Empire pipeline'])
  })
})
