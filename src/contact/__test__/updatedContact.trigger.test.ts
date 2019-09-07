import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../..'
import * as multipleContacts from './multipleContacts.fixture.json'
import * as multipleCompanies from './multipleCompanies.fixture.json'
import UpdatedContactTrigger from '../updatedContact.trigger'
import {assertDeduplicationIds} from '../../utils/testHelpers'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('update contact trigger', () => {
  it('should fetch contacts sorted by updated_at', async () => {
    const bundle = {}

    nock('https://api.getbase.com/v2')
      .get('/contacts')
      .query({
        sort_by: 'updated_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleContacts)

    const results = await appTester(App.triggers[UpdatedContactTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(
      results,
      [1, 2],
      ['1_2019-09-04T08:28:59Z', '2_2019-01-01T08:00:00Z']
    )
  })

  it('should fetch only companies sorted by updated_at', async () => {
    const bundle = {
      inputData: {
        is_organization: true
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts')
      .query({
        sort_by: 'updated_at:desc',
        is_organization: true,
        page: 1,
        per_page: 100
      })
      .reply(200, multipleCompanies)

    const results = await appTester(App.triggers[UpdatedContactTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(
      results,
      [100, 200],
      ['100_2019-09-04T08:28:59Z', '200_2019-01-01T08:00:00Z']
    )
  })

  it('should fetch contacts sorted by update_at and generate deduplication based on passed trigger field', async () => {
    const bundle = {
      inputData: {
        trigger_field: 'tags'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts')
      .query({
        sort_by: 'updated_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleContacts)

    const results = await appTester(App.triggers[UpdatedContactTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(
      results,
      [1, 2],
      ['1_tag1,tag2', '2_']
    )
  })

  it('should fetch companies sorted by update_at and generate deduplication based on passed trigger field', async () => {
    const bundle = {
      inputData: {
        trigger_field: 'address.street',
        is_organization: true
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/contacts')
      .query({
        is_organization: true,
        sort_by: 'updated_at:desc',
        page: 1,
        per_page: 100
      })
      .reply(200, multipleCompanies)

    const results = await appTester(App.triggers[UpdatedContactTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    assertDeduplicationIds(
      results,
      [100, 200],
      ['100_Street 9', '200_Leona Wyczolkowskiego']
    )
  })
})
