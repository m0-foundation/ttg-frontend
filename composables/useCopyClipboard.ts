import { copyToClipboard } from '@/utils/misc'

export default () => {
  const isJustCopied = ref(false)

  function copy(text: any) {
    copyToClipboard(text)
    isJustCopied.value = true
    setTimeout(() => {
      isJustCopied.value = false
    }, 2000)
  }

  return { isJustCopied, copy }
}
