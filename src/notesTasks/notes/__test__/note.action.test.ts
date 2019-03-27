import * as nock from 'nock'
import * as zapier from 'zapier-platform-core'
import App from '../../..'
import {CreateNoteAction} from '../note.action'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('create note action', () => {
  it('should pass if note is properly created', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        content: 'This is note',
        resource_type: 'Person',
        resource_id: 12345,
        invalid_filter: 'filter'
      }
    }

    nock('https://api.getbase.com/v2')
      .post('/notes', {
        data: {
          content: 'This is note',
          resource_type: 'contact',
          resource_id: 12345
        }
      })
      .reply(200, {data: {id: 1230}})

    const response: any = await appTester(App.creates[CreateNoteAction.key].operation.perform, bundle)
    expect(response.id).toEqual(1230)
  })
})
