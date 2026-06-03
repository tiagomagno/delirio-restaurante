export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // O ambiente de sandbox injeta localStorage no Node.js com métodos quebrados.
    // Este polyfill garante que getItem/setItem sejam funções válidas durante o SSR.
    const ls = (globalThis as Record<string, unknown>).localStorage as Record<string, unknown> | undefined
    if (!ls || typeof ls.getItem !== 'function') {
      const store = new Map<string, string>()
      ;(globalThis as Record<string, unknown>).localStorage = {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k),
        clear: () => store.clear(),
        key: (i: number) => [...store.keys()][i] ?? null,
        get length() { return store.size },
      }
    }
  }
}
