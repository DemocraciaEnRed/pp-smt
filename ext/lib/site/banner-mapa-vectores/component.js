import React, { useEffect, useState } from 'react'
import config from 'lib/config'
import topicStore from 'lib/stores/topic-store/topic-store'
import VectorMap from './vectorMap'


export default class BannerForoVecinal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      src: '',
      text: '',
      topics: null,
      zona: null,
      zonas: [], // Una sola vez desde el store
    }
    this.map = null;
    this.markersGroup = null;

  }

  fetchTopics = (zona) => {

    let query = {
      forumName: config.forumProyectos,
      year: '2025',
      zonas: zona,
      tipoIdea: 'factible'
    }
    topicStore.findAllProyectosWithQuery(query).then((topics) => {
      this.setState({ topics: topics })
    })
      .catch((err) => { throw err })

  }

  render() {
    const { topics } = this.state
    return (
      <section className='container-fluid intro-mapa'>
        <div className="row">
          <div className="col-md-12">
            <div className="fondo-titulo">
              <h2>ZONAS DE SAN MIGUEL DE TUCUMÁN</h2>
            </div>
          </div>
        </div>
        {/* <div className="row">
          <div className="col-md-12">
            <div className='mapa-box'>
              <iframe className='mapa' src="https://www.google.com/maps/d/embed?mid=1hogkVFq7mjotcMnBSPMLnPSgI2FrHNc" frameBorder="0" allowFullScreen></iframe>            
            </div>
          </div>
        </div>           */}
        <div className="row">
          <div className="col-md-12">
            <VectorMap action={this.fetchTopics} topics={topics} />
          </div>
        </div>
        {/* <div className="row">
        <div className="col-md-8">
          <p className="text-right">Podés <a href="https://www.google.com/maps/d/u/0/viewer?mid=1hogkVFq7mjotcMnBSPMLnPSgI2FrHNc&ll=-37.95097558036518%2C-57.65591206560899&z=10" tabIndex="50" target="_blank">ver el mapa en detalle acá</a></p>
        </div>
        <div className="col-md-4"></div>
      </div> */}
      </section>
    )
  }
}
