import React from 'react'
import VectorMap from 'ext/lib/site/banner-mapa-vectores/vectorMap'


export default () => {
  const handleZona = zonaId => {
    console.log(zonaId);

  }
  return (
    <div className='container-fluid row text-center' style={{ width: '100%' }}>
      <div className='col-md-12'>
        <h1 className='text-center'>Presupuesto Participativo</h1>
        <p>Para votar acercate a los centros habilitados de votacion </p>
      </div>
      <div className='col-md-12 text-center'>
        <VectorMap action={handleZona} />
      </div>
    </div>
  )
}