export enum RawCustomFieldType {
  Number = 'number',
  String = 'string',
  Text = 'text',
  Bool = 'bool',
  Date = 'date',
  DateTime = 'datetime',
  Email = 'email',
  Phone = 'phone',
  Url = 'url',
  Address = 'address',
  List = 'list',
  MultiSelect = 'multi_select_list'
}

export interface RawCustomField {
  id: number,
  name: string,
  type: RawCustomFieldType,
  for_organisation?: boolean | null,
  for_contact?: boolean | null,
  choices?: RawCustomFieldChoices | null
}

export type RawCustomFieldChoices = Array<{
  id: number,
  name: string
}>

export enum ZapierCustomFieldType {
  String = 'string',
  Text = 'text',
  Boolean = 'boolean',
  DateTime = 'datetime',
  Integer = 'integer'
}

export interface ZapierCustomField {
  key: string,
  label: string,
  list?: boolean,
  required?: boolean,
  choices?: string[],
  type?: ZapierCustomFieldType
}

