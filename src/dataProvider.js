import baseDataProvider from './baseDataProvider'
import leadsDataProvider from './leadsDataProvider'

const dataProvidersByResource = {
  'leads': leadsDataProvider,
}

const defaultHandler = {
  get: (target, property) => {
    return (resource, params) => {
      const dataProvider = dataProvidersByResource[resource] || baseDataProvider
      const method = dataProvider[property]

      if ( ! method ) {
        throw new Error(`Unknown dataProvider function: ${property}`)
      }

      return method.call(dataProvider, resource, params)
    }
  }
}

export default new Proxy({}, defaultHandler)