import {findAndRemapOnlyStageUpdatedItems, findAndRemapOnlyUpdatedItems, remapDeduplication} from '../deduplication'

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
  it('should properly remap ids', () => {
    const deals = [
      {id: 1, name: 'Uzi deal', field_10: 'one'},
      {id: 2, name: 'Bart deal', field_10: 'two'},
    ]

    const deduplicatedItems = remapDeduplication(deals, 'field_10')
    expect(deduplicatedItems).toHaveLength(2)
    expect(deduplicatedItems.map(item => item.id)).toEqual(['1_one', '2_two'])
    expect(deduplicatedItems.map(item => item.entity_original_id)).toEqual([1, 2])
  })
})
