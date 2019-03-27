import * as zapier from 'zapier-platform-core'
import App from '../../..'
import * as nock from 'nock'
import * as pipelinesResponse from './pipelinesResponse.fixture.json'
import * as stagesResponse from './stagesResponse.fixture.json'
import * as singleStageResponse from './singleStageResponse.fixture.json'
import {StageSearch} from '../stage.search'

const appTester = zapier.createAppTester(App)
zapier.tools.env.inject()

describe('stage search', () => {
  const emptyResponse = {items: []}

  it('should return stage based on pipeline name and stage name if pipeline can be found', async () => {
    const bundle = {
      inputData: {
        pipeline_name: 'Sales Pipeline',
        stage_name: 'Prospecting'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/pipelines')
      .query({
        name: 'Sales Pipeline'
      })
      .reply(200, pipelinesResponse)

    nock('https://api.getbase.com/v2')
      .get('/stages')
      .query({
        pipeline_id: 789898,
        name: 'Prospecting'
      })
      .reply(200, stagesResponse)

    const results = await appTester(App.searches[StageSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    expect(results[0]).toHaveProperty('id', 6524005)
  })

  it('should return stage based only on name if pipeline can\'t be found', async () => {
    const bundle = {
      inputData: {
        pipeline_name: 'Sales Pipeline',
        stage_name: 'Prospecting'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/pipelines')
      .query({
        name: 'Sales Pipeline'
      })
      .reply(200, emptyResponse)

    nock('https://api.getbase.com/v2')
      .get('/stages')
      .query({
        name: 'Prospecting'
      })
      .reply(200, stagesResponse)

    const results = await appTester(App.searches[StageSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    expect(results[0]).toHaveProperty('id', 6524005)
  })

  it('should return stage based only on name if pipelineName is not specified', async () => {
    const bundle = {
      inputData: {
        stage_name: 'Prospecting'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/stages')
      .query({
        name: 'Prospecting'
      })
      .reply(200, stagesResponse)

    const results = await appTester(App.searches[StageSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(2)
    expect(results[0]).toHaveProperty('id', 6524005)
  })

  it('should return empty result set if filters are not provided', async () => {
    const bundle = {
      inputData: {}
    }

    const results = await appTester(App.searches[StageSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(0)
  })

  it('should fetch stage by id if id is provided', async () => {
    const bundle = {
      inputData: {
        id: 1234,
        stage_name: 'Unqualified',
        pipeline_name: 'Sales Pipeline'
      }
    }

    nock('https://api.getbase.com/v2')
      .get('/stages')
      .query({
        ids: 1234
      })
      .reply(200, singleStageResponse)

    const results = await appTester(App.searches[StageSearch.key].operation.perform, bundle)
    expect(results).toHaveLength(1)
    expect(results[0]).toHaveProperty('id', 1234)
  })
})
