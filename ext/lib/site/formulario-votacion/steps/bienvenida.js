import React from 'react'

export default ({ changeStep, texts, step, differentUser }) => (
    <div className='form-votacion'>
        <div className='votacion-header'>
            <h5>Votación del</h5>
            <h1 className='text-center'>{texts['votacion-title']}</h1>
            <p>{texts['votacion-subtitle']}</p>
        </div>
        <div className='wrapper text-center'>
            {differentUser ? <button onClick={() => changeStep(5)} className='boton-comenzar'>Registrar voto</button> : <button onClick={() => changeStep(step + 1)} className='boton-comenzar'>Comenzar</button>}
            <p>
                Si aún no viste los proyectos a votar <a href="/propuestas" target="_blank">podés verlos en más detalle aquí</a>.
            </p>
        </div>
    </div>
)