import { createStorage, type Storage } from 'unstorage'
import { netlifyDriver } from '~/utilities/NetlifyKvStore'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()

  let storage: Storage
  switch (config.kvBackend) {
    case 'netlify':
      storage = createStorage({ driver: netlifyDriver() })
      break
    default:
      throw new Error(`Unknown KV backend: ${config.kvBackend}`)
  }

  // Attach KV store to H3 event context for all API routes
  nitroApp.hooks.hook('request', (event) => {
    event.context.$kv = storage
  })
})