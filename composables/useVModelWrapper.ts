import { computed } from 'vue'

export function useVModelWrapper<T>(
  props: DefineProps<T>,
  emit: (event: any, ...args: any[]) => void,
  prop: keyof typeof props,
) {
  return computed({
    get: () => props[prop],
    set: (value) => emit(`update:${String(prop)}`, value),
  })
}
