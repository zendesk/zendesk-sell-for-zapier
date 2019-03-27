import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import * as singleDeal from './singleDeal.fixture.json'
import App from '../..'
import {CreateDealAction, UpdateDealAction} from '../deal.action'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

const mockEmptyCustomFieldsResponse = () => {
  nock('https://api.getbase.com/v2/deal')
    .get('/custom_fields')
    .reply(200, {items: []})
}

describe('create deal action', () => {
  it('should pass deal data to endpoint without pipeline id', async () => {
    const bundle = {
      authData: {
        api_token: 'token'
      },
      inputData: {
        name: 'Deal Name',
        contact_id: 1234567,
        stage_id: 2,
        pipeline_id: 120,
        'custom_fields.dropdown': 'Value',
        'custom_fields.super_field': 'Value1'
      }
    }

    mockEmptyCustomFieldsResponse()
    nock('https://api.getbase.com/v2')
      .post('/deals', {
        data: {
          name: 'Deal Name',
          contact_id: 1234567,
          stage_id: 2,
          custom_fields: {
            dropdown: 'Value',
            super_field: 'Value1'
          }
        }
      })
      .reply(200, singleDeal)

    const createdDeal = await appTester(App.creates[CreateDealAction.key].operation.perform, bundle)
    expect(createdDeal.id).toEqual(123)
    expect(createdDeal.name).toEqual('Deal Name')
  })

})

describe('update deal action', () => {
  it('should pass if deal is properly updated', async () => {
    const bundle = {
      authData: {
        api_token: 'api token'
      },
      inputData: {
        id: 600,
        name: 'Deal Name',
        stage_id: 2,
        pipeline_id: 120
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/deals/600')
      .reply(200, {data: {id: 600}})

    mockEmptyCustomFieldsResponse()
    nock('https://api.getbase.com/v2')
      .put('/deals/600', {
        data: {
          name: 'Deal Name',
          stage_id: 2
        }
      })
      .reply(200, {data: {id: 600}})

    const updatedDeal = await appTester(App.creates[UpdateDealAction.key].operation.perform, bundle)
    expect(updatedDeal.id).toEqual(600)
  })
})
