import {findAndRemapOnlyStageUpdatedItems, findAndRemapOnlyUpdatedItems, remapDeduplication} from '../deduplication'
import {assertDeduplicationIds} from '../testHelpers'

describe('findAndRemapOnlyUpdatedItems', () => {
  it('should return empty array if input is empty', () => {
    expect(findAndRemapOnlyUpdatedItems([])).toHaveLength(0)
  })

  it('should outfilter new items with precision lower than 2 seconds', () => {
    const items = [
      {id: 1, name: 'Uzi', created_at: '2018-10-17T08:25:20Z', updated_at: '2018-10-17T08:25:40Z'},
      {id: 2, name: 'Bart', created_at: '2018-10-17T08:25:20Z', updated_at: '2018-10-17T08:25:20'},
      {id: 3, name: 'Bart', created_at: '2018-10-17T08:25:20Z', updated_at: '2018-10-17T08:25:22'},
      {id: 4, name: 'Ryan', created_at: '2018-10-17T08:25:20Z', updated_at: '2019-10-17T08:25:40Z'},
    ]

    const onlyUpdates = findAndRemapOnlyUpdatedItems(items)
    expect(onlyUpdates).toHaveLength(2)
    expect(onlyUpdates.map(item => item.name)).toEqual(['Uzi', 'Ryan'])
    expect(onlyUpdates.map(item => item.entity_original_id)).toEqual([1, 4])
    expect(onlyUpdates.map(item => item.id)).toEqual(['1_2018-10-17T08:25:40Z', '4_2019-10-17T08:25:40Z'])
  })
})

describe('findAndRemapOnlyStageUpdatedItems', () => {
  it('should outfilters new items', () => {
    const items = [
      {id: 1, name: 'Uzi', created_at: '2018-10-17T08:25:20Z', last_stage_change_at: '2018-10-17T08:25:40Z'},
      {id: 2, name: 'Bart', created_at: '2018-10-17T08:25:20Z', last_stage_change_at: '2018-10-17T08:25:20'}
    ]
    const onlyUpdates = findAndRemapOnlyStageUpdatedItems(items)
    expect(onlyUpdates).toHaveLength(1)
    expect(onlyUpdates.map(item => item.name)).toEqual(['Uzi'])
    expect(onlyUpdates.map(item => item.id)).toEqual(['1_2018-10-17T08:25:40Z'])
  })
})

describe('remapDeduplication', () => {
  it('should properly remap ids for any field', () => {
    const deals = [
      {id: 1, name: 'Uzi deal', field_10: 'one'},
      {id: 2, name: 'Bart deal', field_10: 'two'},
    ]

    const deduplicatedItems = remapDeduplication(deals, 'field_10')
    expect(deduplicatedItems).toHaveLength(2)
    expect(deduplicatedItems.map(item => item.id)).toEqual(['1_one', '2_two'])
    expect(deduplicatedItems.map(item => item.entity_original_id)).toEqual([1, 2])
  })

  it('should use nulls when field is not present', () => {
    const deals = [
      {id: 100, field_10: 'Value'},
      {id: 200},
      {id: 300, field_10: undefined},
    ]

    const deduplicatedItems = remapDeduplication(deals, 'field_10')
    expect(deduplicatedItems).toHaveLength(3)
    assertDeduplicationIds(
      deduplicatedItems,
      [100, 200, 300],
      ['100_Value', '200_null', '300_null'],
    )
  })

  it('should use nulls when fields is nulled', () => {
    const deals = [
      {id: 100, field_10: 'Value'},
      {id: 200, field_10: null},
      {id: 300, field_10: null},
    ]

    const deduplicatedItems = remapDeduplication(deals, 'field_10')
    expect(deduplicatedItems).toHaveLength(3)
    assertDeduplicationIds(
      deduplicatedItems,
      [100, 200, 300],
      ['100_Value', '200_null', '300_null'],
    )
  })

  it('should properly use nested fields for deduplication id', () => {
    const deals = [
      {id: 100, custom_fields: {field: 'a'}},
      {id: 200, custom_fields: {}},
      {id: 300},
    ]

    const deduplicatedItems = remapDeduplication(deals, 'custom_fields.field')
    expect(deduplicatedItems).toHaveLength(3)
    assertDeduplicationIds(
      deduplicatedItems,
      [100, 200, 300],
      ['100_a', '200_null', '300_null'],
    )
  })

  it('should properly use nested fields with dots', () => {
    const deals = [
      {id: 100, custom_fields: {'field.with.dot': 'XXX'}},
      {id: 200, custom_fields: {}},
      {id: 300},
    ]

    const deduplicatedItems = remapDeduplication(deals, 'custom_fields.field.with.dot')
    expect(deduplicatedItems).toHaveLength(3)
    assertDeduplicationIds(
      deduplicatedItems,
      [100, 200, 300],
      ['100_XXX', '200_null', '300_null'],
    )
  })

  it('should properly use arrays as keys', () => {
    const deals = [
      {id: 100, tags: ['a', 'b', 'c']},
      {id: 200, tags: [1, 2, 3]},
      {id: 300},
    ]

    const deduplicatedItems = remapDeduplication(deals, 'tags')
    expect(deduplicatedItems).toHaveLength(3)
      assertDeduplicationIds(
      deduplicatedItems,
      [100, 200, 300],
      ['100_a,b,c', '200_1,2,3', '300_null'],
    )
  })

  it('should properly use object as keys', () => {
    const deals = [
      {id: 100, address: {street: 'a'}},
      {id: 200, address: {}},
      {id: 300},
    ]

    const deduplicatedItems = remapDeduplication(deals, 'address')
    expect(deduplicatedItems).toHaveLength(3)
    assertDeduplicationIds(
      deduplicatedItems,
      [100, 200, 300],
      ['100_{"street":"a"}', '200_{}', '300_null'],
    )
  })
})
