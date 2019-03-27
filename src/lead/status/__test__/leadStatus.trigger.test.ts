import App from '../../..'
import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as leadStatuses from './leadStatusesResponse.fixture.json'
import {ListLeadStatusDropdown} from '../leadStatus.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('list lead statuses', () => {
  it('should properly fetch lead statuses', async () => {
    const bundle = {
      inputData: {
        paramToBeIgnored: 'value'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/lead_statuses')
      .query({
        page: 1,
        per_page: 100
      })
      .reply(200, leadStatuses)

    const response = await appTester(App.triggers[ListLeadStatusDropdown.key].operation.perform, bundle)
    expect(response).toHaveLength(2)
    expect(response[0]).toEqual({
      id: 2045740,
      name: 'New',
      created_at: '2016-12-07T08:09:14Z',
      updated_at: '2016-12-07T08:09:14Z'
    })
  })
})
