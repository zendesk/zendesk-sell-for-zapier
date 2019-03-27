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

const remapDeduplicationId = (entity: any, fieldName: string): any => {
  return {
    ...entity,
    entity_original_id: entity.id,
    id: `${entity.id}_${entity[fieldName]}`
  }
}

export const remapDeduplication = (items: any[], sortFieldName: string) => {
  return items.map(item => remapDeduplicationId(item, sortFieldName))
}

/**
 * Zapier relies on ids when it comes to marking already processed items from triggers (applicable only to polling)
 * Mapping ids for update triggers (concatenating id with datetime of change) allows trigger to process
 * multiple updates on single item.
 *
 * More details on how deduplication in Zapier works: https://zapier.com/developer/documentation/v2/deduplication/
 */
export const findAndRemapOnlyChangedItems = (items: any[], changeFieldName: string) => {
  return items.filter(isChanged(changeFieldName))
    .map(item => remapDeduplicationId(item, changeFieldName))
}

export const findAndRemapOnlyUpdatedItems = (items: any[]) =>
  findAndRemapOnlyChangedItems(items, 'updated_at')

export const findAndRemapOnlyStageUpdatedItems = (items: any[]) =>
  findAndRemapOnlyChangedItems(items, 'last_stage_change_at')
