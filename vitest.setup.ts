// Polyfill a working localStorage/sessionStorage for the test environment.
// vitest 4 + Node 25 ship an empty {} stub for localStorage that has no
// Storage methods. Provide a real in-memory implementation so tests that
// rely on the Web Storage API behave correctly.
function createStorage(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.has(key) ? (store.get(key) as string) : null
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, String(value))
    },
  }
}

if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage?.clear) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createStorage(),
    configurable: true,
    writable: true,
  })
}

if (typeof globalThis.sessionStorage === 'undefined' || !globalThis.sessionStorage?.clear) {
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: createStorage(),
    configurable: true,
    writable: true,
  })
}
