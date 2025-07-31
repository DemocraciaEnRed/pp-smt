import React from 'react'
import VotoTopicCard from './topic-card/component'

export default ({ topics }) => {

    const showTopics = topics

    return (
        <div className='form-votacion'>
            <div className='votacion-header'>
                <h1 className='text-center'>4. Confirmación de votos</h1>
                <p>Por favor revisá cuidadosamente que los votos registrados sean correctos. En caso de haber un error podés volver hacia atrás</p>
            </div>
            <div className='wrapper'>
                {showTopics && showTopics.map((topic) => (
                    <VotoTopicCard
                        key={topic.id}
                        topic={topic}
                    />
                ))}
            </div>
        </div>
    )

}