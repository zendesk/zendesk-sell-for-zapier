import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as multipleStages from './multipleStages.fixture.json'
import App from '../../..'
import {ListStageDropdown} from '../stage.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('list stage resources', () => {
  it('should load stages and properly parse response when multiple items are returned', async () => {
    const bundle = {
      authData: {
        api_token: 'token'
      },
      inputData: {
        name: 'Pipeline',
        pipeline_id: 1234
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/stages')
      .query({
        pipeline_id: 1234,
        per_page: 100,
        page: 1
      })
      .reply(200, multipleStages)

    const results: any = await appTester(App.triggers[ListStageDropdown.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    expect(results[0]).toEqual({
      'id': 6111851,
      'name': 'Incoming',
      'category': 'incoming',
      'position': 1,
      'likelihood': 0,
      'active': true,
      'pipeline_id': 704704,
      'created_at': '2016-12-07T08:09:14Z',
      'updated_at': '2017-03-23T12:42:21Z'
    })
  })
})
