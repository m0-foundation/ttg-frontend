<template>
  <div class="overflow-x-auto">
    <table class="text-left w-full">
      <colgroup>
        <template v-for="field in displayedFields" :key="field.key">
          <slot :name="`col(${field.key})`">
            <col />
          </slot>
        </template>
      </colgroup>
      <thead
        class="text-grey-400 uppercase text-xs font-light border-b-2 border-grey-500"
      >
        <tr>
          <th
            v-for="field in displayedFields"
            :key="field.key"
            class="p-3"
            :class="{
              'cursor-pointer hover:text-grey-500': field.sortable,
              'p-2': dense,
            }"
            @click="field.sortable ?? sort(field.key)"
          >
            <slot :name="`head(${field.key})`" :field="field">
              <div class="flex gap-2">
                {{ field.label }}
                <img
                  v-if="field.sortable"
                  src="/img/icon-sort.svg"
                  alt="Icon sort"
                />
              </div>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in sortedItems" :key="item.id">
          <template v-for="key in displayedFieldKeys" :key="key">
            <Component
              :is="cellElement(key as string)"
              class="p-3 text-grey-900 text-sm border-b border-dashed border-grey-500"
              :class="{
                'p-2': dense,
              }"
            >
              <slot
                :name="`cell(${key})`"
                :value="format(item, (key as string))"
                :item="item"
                :format="(k: string) => format(item, k)"
              >
                {{ format(item, key as string) }}
              </slot>
            </Component>
          </template>
        </tr>
        <tr v-if="loading || !items.length">
          <td
            :colspan="displayedFields.length"
            class="p-3 text-grey-300 text-sm border-b border-dashed border-grey-500"
          >
            <div v-if="loading" class="flex items-center justify-center">
              <MIconLoading /> Loading data...
            </div>
            <div v-else-if="!items.length">
              <slot name="empty">No data to show.</slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
interface TableField {
  key: string;
  label: string;
  format?: Function;
  hidden?: boolean;
  header?: boolean;
  sortable?: boolean;
}

interface TableItem {
  id: number;
  [key: string]: any;
}

const props = defineProps({
  fields: { type: Array as PropType<TableField[]>, default: () => [] },
  items: { type: Array as PropType<TableItem[]>, default: () => [] },
  dense: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const sortKey = ref();
const sortOrder = ref(1); // 1 for ascending, -1 for descending

const displayedFields = computed(() => props.fields.filter((i) => !i.hidden));

const displayedFieldKeys = computed(() => {
  return Object.entries(displayedFields.value).map(
    ([_key, value]) => value.key
  );
});

const cellElement = (key: string) => {
  const field = props.fields.find((f) => f.key === key);
  return field && field.header ? "th" : "td";
};

const format = (item: TableItem, key: string) => {
  const field = props.fields.find((f) => f.key === key);
  return field && field.format ? field.format(item[key]) : item[key];
};

const sort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1; // Reverse the sort order
  } else {
    sortKey.value = key;
    sortOrder.value = 1; // Reset the sort order
  }
};

const sortedItems = computed(() => {
  if (!sortKey.value) {
    return props.items;
  }

  return [...props.items].sort((a, b) => {
    const aValue = a[sortKey.value];
    const bValue = b[sortKey.value];

    if (aValue < bValue) {
      return -1 * sortOrder.value;
    } else if (aValue > bValue) {
      return 1 * sortOrder.value;
    } else {
      return 0;
    }
  });
});
</script>
