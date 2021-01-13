import * as zapier from 'zapier-platform-core'
import * as nock from 'nock'
import App from '../../..'
import {SequenceSearch} from '../sequence.search'
import * as sequenceResponse from './sequences.fixture.json'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('search sequences in catalog', () => {
    it('should return empty array without calling api if supported filters are not present', async () => {
        const bundle = {
            inputData: {
                'search.first_name': 'Joe'
            }
        }

        const results = await appTester(App.searches[SequenceSearch.key].operation.perform, bundle)
        expect(results).toHaveLength(0)
    })

    it('should be possible to pass id to search endpoint', async () => {
        const bundle = {
            inputData: {
                'search.id': 21123
            }
        }

        nock('https://api.getbase.com/v2')
            .get('/sequences/21123')
            .reply(200, sequenceResponse)

        const results = await appTester(App.searches[SequenceSearch.key].operation.perform, bundle)
        expect(results).toHaveLength(1)
    })

  it('should be possible to pass name to search endpoint', async () => {
    const bundle = {
      inputData: {
        'search.id': null,
        'search.name': 'Welcome'
      }
    }

    nock('https://api.getbase.com/v2')
        .get('/sequences')
        .query({
          name: 'Welcome',
          page: 1,
          per_page: 100
        })
        .reply(200, sequenceResponse)

    const results = await appTester(App.searches[SequenceSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
  })
})
