import { defineStore } from "pinia";
import { MLists, MListEvent } from "@/lib/api";

export const useListsStore = defineStore("lists", {
  state: () => ({
    lists: [] as Array<MLists>,
  }),

  getters: {
    getFlattenLists(state) {
      const flattenLists: MListEvent[] = [];
      state.lists.forEach((list) => {
        Object.keys(list).forEach((key) => {
          flattenLists.push(...list[key]);
        });
      });
      return flattenLists;
    },
  },

  actions: {
    setLists(lists: Array<MLists>) {
      this.lists = lists;
    },
    addList(list: MLists) {
      this.lists.push(list);
    },
  },
});
