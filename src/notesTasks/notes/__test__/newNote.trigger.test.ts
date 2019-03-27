import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../..'
import * as notesResponse from './multipleNotesResponse.fixture.json'
import {NewNoteTrigger} from '../newNote.trigger'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('new note trigger', () => {
  it('should use only resource_type in filters while listing notes', async () => {
    const bundle = {
      inputData: {
        resource_type: 'lead',
        unsupported_one: '123'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/notes')
      .query({
        resource_type: 'lead',
        sort_by: 'created_at:desc',
        per_page: 100,
        page: 1
      })
      .reply(200, notesResponse)

    const results = await appTester(App.triggers[NewNoteTrigger.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    expect(results.map((item: any) => item.resource_type)).toEqual(['lead', 'lead'])
  })
})
