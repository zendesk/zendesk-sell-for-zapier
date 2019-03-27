import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../..'
import * as tasksResponse from './multipleTasksResponse.fixture.json'
import {NewTaskTrigger} from '../newTask.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('new task trigger', () => {
  it('should use only resource_type in filters while listening tasks', async () => {
    const bundle = {
      inputData: {
        resource_type: 'deal',
        resource_id: 1234
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/tasks')
      .query({
        resource_type: 'deal',
        sort_by: 'created_at:desc',
        per_page: 100,
        page: 1
      })
      .reply(200, tasksResponse)

    const results = await appTester(App.triggers[NewTaskTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    expect(results.map((item: any) => item.id)).toEqual([1, 2])
    expect(results.map((item: any) => item.resource_type)).toEqual(['deal', 'deal'])
  })
})
