const STORAGE_KEY = 'governance-app-unlocked'

/**
 * App-wide password gate (soft, client-side deterrent — the password ships in
 * the public bundle). When no password is configured the gate is disabled, so
 * local/dev and unconfigured environments stay open. The unlock is persisted in
 * localStorage as the configured password (already public in the bundle) so
 * users aren't re-prompted on every reload — and so rotating the password
 * re-locks anyone whose stored value no longer matches.
 */
export function useAppPassword() {
  const config = useRuntimeConfig()
  const password = (config.public.appPassword as string) || ''

  const isAuthenticated = useState<boolean>(
    'app-password-authenticated',
    () => {
      if (!password) return true
      if (import.meta.client)
        return localStorage.getItem(STORAGE_KEY) === password
      return false
    },
  )

  function submit(input: string): boolean {
    if (input !== password) return false
    isAuthenticated.value = true
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, password)
    return true
  }

  return { isAuthenticated, submit }
}
