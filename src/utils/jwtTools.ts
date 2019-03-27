import {sign, verify} from 'jsonwebtoken'

const secret = (): string => {
  return process.env.JWT_SECRET || 'private_token'
}

export const singPayload = (payload: object | string): string => {
  return sign(payload, secret())
}

export const verifyToken = (token: string): object | string => {
  return verify(token, secret())
}
