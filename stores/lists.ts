import { defineStore } from 'pinia'
import { MLists, MListEvent } from '@/lib/api/types'

export const useListsStore = defineStore('lists', () => {
  const lists = ref<Array<MLists>>([])

  const getFlattenLists = () => {
    const flattenLists: MListEvent[] = []
    lists.value.forEach((list) => {
      Object.keys(list).forEach((key) => {
        flattenLists.push(...list[key])
      })
    })
    return flattenLists
  }

  const earners = computed(
    () => lists.value.find((list: MLists) => list.earners)?.earners!,
  )

  const minters = computed(
    () => lists.value.find((list: MLists) => list.minters)?.minters!,
  )

  const validators = computed(
    () => lists.value.find((list: MLists) => list.validators)?.validators!,
  )

  const setLists = (_lists: Array<MLists>) => {
    lists.value = _lists
  }

  const addList = (list: MLists) => {
    lists.value.push(list)
  }

  return {
    lists,
    earners,
    minters,
    validators,
    getFlattenLists,
    setLists,
    addList,
  }
})
