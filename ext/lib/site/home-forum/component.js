import React, { Component } from 'react'

import HomeCatalogo from '../home-catalogo/component'
import HomeAbout from '../home-about/component';
import forumConnector from 'lib/site/connectors/forumConfig'
import getYears from 'ext/lib/site/utils/getYears'
import Skeleton from 'ext/lib/site/skeleton/component'


const HomeForum = (props) => {
  const { params: { forum } } = props;
  let years


  switch (forum) {
    case 'propuestas':
      years = getYears(props.forumConfig, "votacion")
      if (!years) return <Skeleton />
      return <HomeCatalogo {...props} years={years} archive={false} />
    case 'acerca-de':
      return <HomeAbout {...props} />
    case 'catalogo':
      years = getYears(props.forumConfig, "seguimiento")
      if (!years) return <Skeleton />
      return <HomeCatalogo {...props} years={years} archive={true} />
    default:
      // que nunca caiga en la vieja pantalla de proyectos
      //return <HomeProyectos {...props} />
      return <HomeCatalogo {...props} />
  }
}

export default forumConnector(HomeForum)
