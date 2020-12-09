import * as zapier from 'zapier-platform-core'
import App from '../../..'
import * as nock from 'nock'
import {CreateEnrollmentAction, StopEnrollmentAction} from '../enrollment.action'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('create enrollment action', () => {
  it('should pass if product is properly created', async () => {
    const bundle = {
      inputData: {
        sequence_id: 10,
        lead_id: 1
      }
    }

    nock('https://api.getbase.com/v2')
      .post('/enrollments', {
        data: {
          sequence_id: 10,
          lead_id: 1
        }
      })
      .reply(200, {data: {sequence_id: 10, lead_id: 1}})

    const response: any = await appTester(App.creates[CreateEnrollmentAction.key].operation.perform, bundle)
    expect(response.sequence_id).toEqual(10)
    expect(response.lead_id).toEqual(1)
  })
})

describe('stop enrollment action', () => {
  it('should pass if enrollment is properly stopped', async () => {
    const bundle = {
      inputData: {
        id: 1000
      }
    }

    nock('https://api.getbase.com/v2')
      .put('/enrollments/1000', {
        data: {
          state: 'finished',
        }
      })
      .reply(200, {data: {id: 1000}})

    const response: any = await appTester(App.creates[StopEnrollmentAction.key].operation.perform, bundle)
    expect(response.id).toEqual(1000)
  })
})
