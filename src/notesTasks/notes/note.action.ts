import {ZapierItem} from '../../types'
import {createTaskNoteResource, dynamicResourceField, notesEndpoint, resourceChoices} from '../common'
import NoteResource from './note.resouce'
import {createActionDetails} from '../../utils/operations'
import {notesActions} from '../keys'

export const CreateNoteAction: ZapierItem = {
  key: notesActions.createNoteAction,
  noun: 'Note',
  display: {
    label: 'Create Note',
    description: 'Creates a new note for an existing lead, contact or deal.',
    important: true
  },
  operation: {
    resource: NoteResource.key,
    inputFields: [
      {
        key: 'content',
        label: 'Content',
        type: 'text',
        required: true
      },
      {
        key: 'resource_type',
        label: 'Related to',
        helpText: 'Note must be related to a lead, person, company or deal',
        type: 'string',
        choices: resourceChoices,
        required: true,
        altersDynamicFields: true
      },
      dynamicResourceField
    ],
    perform: createTaskNoteResource(
      notesEndpoint,
      createActionDetails(notesActions.createNoteAction),
      ['content', 'resource_id']
    )
  }
}
