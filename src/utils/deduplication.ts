import * as moment from 'moment'

const isChanged = (changeFieldName: string) => {
  return (entity: any) => {
    const createdAt = moment(entity.created_at)
    const changedAt = moment(entity[changeFieldName])
    // Somehow updated_at and created_at dates might differ a bit for new items
    // (probably application assigns those fields separately with different timestamps)
    return changedAt.diff(createdAt, 'seconds') > 2
  }
}

const get = (entity: any, segments: string[]): any => {
  if (segments.length === 0 || entity === null || entity === undefined) {
    return entity
  }
  return get(entity[segments[0]], segments.slice(1))
}

const splitByFirstDot = (path : string) : string[] => {
  const dotPosition = path.indexOf('.')
  if (dotPosition <= 0) {
    return [path]
  }
  return [
    path.substring(0, dotPosition),
    path.substring(dotPosition + 1)
  ]
}

const extractFieldValue = (entity: any, path: string): any => {
  const segments = splitByFirstDot(path)
  const value =  get(entity, segments)
  return value === undefined ? null : value
}

const remapDeduplicationId = (entity: any, fieldPath: string): any => {
  const fieldValue = extractFieldValue(entity, fieldPath)
  return {
    ...entity,
    entity_original_id: entity.id,
    id: `${entity.id}_${fieldValue}`
  }
}

export const remapDeduplication = (items: any[], fieldPath: string) => {
  return items.map(item => remapDeduplicationId(item, fieldPath))
}

/**
 * Zapier relies on ids when it comes to marking already processed items from triggers (applicable only to polling)
 * Mapping ids for update triggers (concatenating id with datetime of change) allows trigger to process
 * multiple updates on single item.
 *
 * More details on how deduplication in Zapier works: https://zapier.com/developer/documentation/v2/deduplication/
 */
export const findAndRemapOnlyChangedItems = (items: any[], modificationTimeField: string, triggerFieldPath?: string) => {
  return items.filter(isChanged(modificationTimeField))
    .map(item => remapDeduplicationId(item, triggerFieldPath || modificationTimeField))
}

export const findAndRemapOnlyUpdatedItems = (items: any[], triggerFieldPath?: string) =>
  findAndRemapOnlyChangedItems(items, 'updated_at', triggerFieldPath)

export const findAndRemapOnlyStageUpdatedItems = (items: any[]) =>
  findAndRemapOnlyChangedItems(items, 'last_stage_change_at')
