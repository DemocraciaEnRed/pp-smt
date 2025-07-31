import React from 'react'
import VectorMap from 'ext/lib/site/banner-mapa-vectores/vectorMap'


export default ({ user, zonas, setState }) => {
  const handleZona = (zonaId) => {
    setState({
      preventDefault: () => {
      },
      target: {
        name: 'zona',
        value: zonaId
      }
    })
  }
  return (
    <div className=''>
      <div className='votacion-header'>
        <h1 tabIndex="0" className='text-center'>Votación del Presupuesto Participativo 2025</h1>
      </div>
      <div className='wrapper text-center'>
        {user.privileges.canManage && <div>
          <p className="superbold">Ingresá los datos del votante</p>
          <div className='form-group'>
            <label className='required' htmlFor='dni'>
              DNI
            </label>
            <input
              className='form-control'
              type='text'
              name='dni'
              placeholder="Ingresá el DNI"
              onChange={setState}
            />
          </div>
        </div>
        }
        <div className='form-group'>
          <label className='required' htmlFor='zona'>
            Zona de votacion
          </label>
          <VectorMap action={handleZona} votacion />

        </div>
      </div>
    </div>
  )
}