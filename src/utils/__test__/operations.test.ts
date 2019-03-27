import {ActionType, appSignatureAppender, extractHeaders} from '../operations'
import {verifyToken} from '../jwtTools'

describe('extractHeaders', () => {
  it('should properly extract headers if actionDetails is undefined', () => {
    const origin = {
      url: 'https://api.getbase.com',
      headers: {
        'X-Token': '123'
      }
    }

    expect(extractHeaders(origin)).toEqual(origin)
  })

  it('should properly extract headers if they are missing in the origin request', () => {
    const origin = {
      url: 'https://api.getbase.com',
    }
    const actionDetails = {
      actionType: ActionType.Trigger,
      actionName: 'action_name',
      actionId: 'id'
    }
    expect(extractHeaders(origin, actionDetails)).toEqual({
      url: 'https://api.getbase.com',
      headers: {
        'X-Clientapp-Operation-Type': 'trigger',
        'X-Clientapp-Operation-Name': 'action_name',
        'X-Clientapp-Operation-Id': 'id'
      }
    })
  })

  it('should properly merge action details headers with existing ones', () => {
    const origin = {
      url: 'https://api.getbase.com',
      headers: {
        'X-Token': '123'
      }
    }
    const actionDetails = {
      actionType: ActionType.OAuth2,
      actionName: 'refresh',
      actionId: '1234asdf'
    }

    expect(extractHeaders(origin, actionDetails)).toEqual({
      url: 'https://api.getbase.com',
      headers: {
        'X-Token': '123',
        'X-Clientapp-Operation-Type': 'oauth2',
        'X-Clientapp-Operation-Name': 'refresh',
        'X-Clientapp-Operation-Id': '1234asdf'
      }
    })
  })
})

describe('appSignatureAppender', () => {
  it('should take only headers starting with \'X-Clientapp\' and generate valid jwt signature', () => {
    process.env.JWT_SECRET = 'token42'

    const request = {
      headers: {
        'X-Header': 'value',
        'X-Clientapp-Operation-Id': '1234asdf'
      }
    }

    const {headers: signedHeaders} = appSignatureAppender(request)

    expect(signedHeaders).toBeDefined()

    // @ts-ignore at this point signed headers cannot be null/undefined
    expect(Object.keys(signedHeaders)).toHaveLength(3)
    expect(signedHeaders).toHaveProperty('X-Clientapp-Signature')

    // @ts-ignore at this point signed headers cannot be null/undefined
    const signature = signedHeaders['X-Clientapp-Signature']
    verifyToken(signature)
  })
})
