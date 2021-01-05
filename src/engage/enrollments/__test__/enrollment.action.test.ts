import * as zapier from 'zapier-platform-core'
import App from '../../..'
import * as nock from 'nock'
import {CreateEnrollmentAction, StopAllEnrollmentsAction} from '../enrollment.action'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('create enrollment action', () => {
    it('should pass if product is properly created', async () => {
        const bundle = {
            inputData: {
                sequence_id: 10,
                sell_resource: {
                    resource_id: 1337,
                    resource_type: 'lead'
                }
            }
        }

        nock('https://api.getbase.com/v2_beta')
            .post('/sequence_enrollments', {
                data: {
                    sequence_id: 10,
                    sell_resource: {
                        resource_id: 1337,
                        resource_type: 'lead'
                    }
                }
            })
            .reply(200, {data: {sequence_id: 10, lead_id: 1}})

        const response: any = await appTester(App.creates[CreateEnrollmentAction.key].operation.perform, bundle)
        expect(response.sequence_id).toEqual(10)
        expect(response.lead_id).toEqual(1)
    })
})

describe('stop enrollments action', () => {
    it('should pass if enrollment is properly stopped', async () => {
        const bundle = {
            inputData: {
                id: 1000,
                state: 'finished'
            }
        }

        nock('https://api.getbase.com/v2_beta')
            .post('/sequence_enrollments/finish_ongoing_for_resource', {
                data: {
                    resource_id: '1000',
                    resource_type: 'lead'
                }
            })
            .reply(200, {data: {id: 1000}})

        const response: any = await appTester(App.creates[StopAllEnrollmentsAction.key].operation.perform, bundle)
        expect(response.id).toEqual(1000)
    })
})
