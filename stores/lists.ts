import { defineStore } from 'pinia'
import { MLists, MListEvent } from '@/lib/api/types'
import redactedActorsData from '@/assets/data/redacted-actors.json'

export const useListsStore = defineStore('lists', () => {
  const lists = ref<Array<MLists>>([])
  const redactedActors = ref<Set<string>>(
    new Set(
      (redactedActorsData as string[]).map((actor) => actor.toLowerCase()),
    ),
  )

  const getFlattenLists = () => {
    const flattenLists: MListEvent[] = []
    lists.value.forEach((list) => {
      Object.keys(list).forEach((key) => {
        flattenLists.push(...list[key])
      })
    })
    return flattenLists
  }

  const filterRedacted = (list: MListEvent[] | undefined) =>
    list?.filter(
      (item) => !redactedActors.value.has(item.account.toLowerCase()),
    ) || []

  const earners = computed(() =>
    filterRedacted(lists.value.find((list: MLists) => list.earners)?.earners),
  )

  const minters = computed(() =>
    filterRedacted(lists.value.find((list: MLists) => list.minters)?.minters),
  )

  const validators = computed(() =>
    filterRedacted(
      lists.value.find((list: MLists) => list.validators)?.validators,
    ),
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
