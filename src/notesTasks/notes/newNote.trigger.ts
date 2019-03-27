import {ZapierItem} from '../../types'
import NoteResource from './note.resouce'
import {Bundle, ZObject} from 'zapier-platform-core'
import {streamItems} from '../../common/queries'
import {notesEndpoint} from '../common'
import {descendingSort} from '../../utils/api'
import {triggerActionDetails} from '../../utils/operations'
import {notesTriggers} from '../keys'

const listNotesByCreatedAt = (actionName: string) => {
  return async (z: ZObject, bundle: Bundle) => {
    const sort = descendingSort('created_at')
    return await streamItems(
      notesEndpoint,
      triggerActionDetails(actionName),
      ['resource_type']
    )(z, bundle, {}, sort)
  }
}

export const NewNoteTrigger: ZapierItem = {
  key: notesTriggers.newNoteTrigger,
  noun: 'Note',

  display: {
    label: 'New Note',
    description: 'Triggers when a new note is created.',
    important: false
  },

  operation: {
    resource: NoteResource.key,
    inputFields: [
      {
        key: 'resource_type',
        label: 'Related to',
        type: 'string',
        choices: ['lead', 'contact', 'deal'],
        required: false
      }
    ],
    perform: listNotesByCreatedAt(notesTriggers.newNoteTrigger)
  }
}
