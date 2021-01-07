import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../..'
import {CreateEnrollmentAction, StopAllEnrollmentsAction} from '../enrollment.action'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('stop all enrollments for given lead action', () => {
    it('should pass if enrollment is properly stopped', async () => {
        const bundle = {
            inputData: {
                resource_id: '1000',
                resource_type: 'lead'
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

describe('stop enrollments for single sequence action', () => {
    it('should pass if enrollment is properly stopped', async () => {
        const bundle = {
            inputData: {
                resource_id: '1000',
                resource_type: 'lead',
                sequence_ids: [2]
            }
        }

        nock('https://api.getbase.com/v2_beta')
            .post('/sequence_enrollments/finish_ongoing_for_resource', {
                data: {
                    resource_id: '1000',
                    resource_type: 'lead',
                    sequence_ids: [2]
                }
            })
            .reply(200, {data: {id: 1000}})

        const response: any = await appTester(App.creates[StopAllEnrollmentsAction.key].operation.perform, bundle)
        expect(response.id).toEqual(1000)
    })
})
