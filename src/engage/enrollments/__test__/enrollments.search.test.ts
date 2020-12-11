import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../..'
import {EnrollmentSearch} from '../enrollment.search'
import * as enrollmentsResponse from './enrollments.fixture.json'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('search enrollments in catalog', () => {
  it('should return empty array without calling api if supported filters are not present', async () => {
    const bundle = {
      inputData: {
        'search.first_name': 'Joe'
      }
    }

    const results = await appTester(App.searches[EnrollmentSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(0)
  })

  it('should pass only supported filters to search endpoint', async () => {
    const bundle = {
      inputData: {
        'search.id': null,
        'search.resource_type': 'lead',
        'search.resource_ids': 1988695232,
      }
    }

    nock('https://api.getbase.com/v2_beta')
      .get('/sequence_enrollments')
      .query({
        resource_type: 'lead',
        resource_ids: 1988695232,
        per_page: 100,
        page: 1
      })
      .reply(200, enrollmentsResponse)

    const results = await appTester(App.searches[EnrollmentSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })

  it('should pass only supported filters to search endpoint', async () => {
    const bundle = {
      inputData: {
        'search.id': 92593
      }
    }

    nock('https://api.getbase.com/v2_beta')
        .get('/sequence_enrollments/92593')
        .reply(200, enrollmentsResponse)

    const results = await appTester(App.searches[EnrollmentSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(1)
  })
})
