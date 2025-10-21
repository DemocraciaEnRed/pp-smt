import urlBuilder from '../url-builder'
import request from '../request/request'
import Store from './store/store'

class ZonaStore extends Store {
  name() {
    return 'zona'
  }

  findAll(forceUpdate) {
    if (!forceUpdate && this.zonas)
      return new Promise((resolve, reject) => { resolve(this.zonas) })

    let url = this.url('')
    if (this._fetches.get(url)) return this._fetches.get(url)

    let fetch = this._fetch(url)

    fetch.then((zonas) => {
      return this.zonas = zonas
    }).catch((err) => {
      this.log('Found error', err)
      return this.zonas = []
    })

    return fetch
  }

  search(query) {
    const url = this.url('search', { q: query })

    const fetch = new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (err) return reject(err)
          resolve(res.body)
        })
    })

    return fetch
  }
}

export default new ZonaStore()
