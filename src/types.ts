import {Bundle, ZObject} from 'zapier-platform-core'

/**
 * Zapier core doesn't provide any types for basic components like action, search and trigger.
 * Purpose of these types is to force required properties during compilation.
 */
export type PerformMethod = (z: ZObject, bundle: Bundle) => Promise<any>

/**
 * Common type used for Triggers, Searches and Creates
 *
 * https://zapier.github.io/zapier-platform-schema/build/schema.html#createschema
 * https://zapier.github.io/zapier-platform-schema/build/schema.html#triggerschema
 * https://zapier.github.io/zapier-platform-schema/build/schema.html#searchschema
 */
export interface ZapierItem {
  key: string,
  noun: string,
  display: {
    label: string,
    description: string,
    important?: boolean,
    hidden?: boolean
  },
  operation: {
    sample?: object,
    resource?: string,
    inputFields?: any[],
    outputFields?: any[],
    perform: PerformMethod
  }
}

/**
 * Type for Input Field from Zapier
 * https://zapier.github.io/zapier-platform-schema/build/schema.html#fieldschema
 */
export interface InputField {
  key: string,
  label: string,
  helpText?: string,
  required?: boolean,
  type?: string,
  list?: boolean,
  dynamic?: string,
  search?: string,
  choices?: string[],
  altersDynamicFields?: boolean,
}


/**
 * Type for Output Field from Zapier
 * https://zapier.github.io/zapier-platform-schema/build/schema.html#fieldschema
 */
export interface OutputField {
  key: string,
  label: string
}

