/**
 * Customer.io analytics integration
 */
/* global _cio */

const config = {
  assumesPageview: true
}

export default function customerIOPlugin(userConfig) {
  return {
    NAMESPACE: 'customerio',
    config: Object.assign({}, config, userConfig),
    initialize: ({ config }) => {
      const { siteID } = config
      if (!siteID) {
        throw new Error('No customer.io siteID defined')
      }
      if (typeof _cio === 'undefined') {
        window._cio = [];
        (function() {
          var a, b, c
          a = function(f) {
            return function() {
              _cio.push([f].concat(Array.prototype.slice.call(arguments, 0)))
            }
          }
          b = ['load', 'identify', 'sidentify', 'track', 'page']
          for (c = 0; c < b.length; c++) { _cio[b[c]] = a(b[c]) }
          var t = document.createElement('script')
          var s = document.getElementsByTagName('script')[0]
          t.async = true
          t.id = 'cio-tracker'
          t.setAttribute('data-site-id', siteID)
          t.src = 'https://assets.customer.io/assets/track.js'
          s.parentNode.insertBefore(t, s)
        })()
      }
    },
    page: ({ payload }) => {
      if (typeof _cio !== 'undefined') {
        _cio.page(document.location.href, payload.properties)
      }
    },
    track: ({ payload }) => {
      if (typeof _cio !== 'undefined') {
        _cio.track(payload.event, payload.properties)
      }
    },
    identify: ({ payload }) => {
      const { id, traits } = payload
      if (typeof _cio !== 'undefined') {
        _cio.identify({
          id: id,
          ...traits
        })
      }
    },
    loaded: () => {
      return !!(window._cio && window._cio.push !== Array.prototype.push)
    }
  }
}
