import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import t from 't-component'
import bus from 'bus'
import config from 'lib/config'
import FormAsync from 'lib/site/form-async'
import userConnector from 'lib/site/connectors/user'
import BtnCidiTuc from './btn-cidituc'

export class SignIn extends Component {
  constructor(props) {
    super(props)
  }

  // componentWillMount () {
  //   bus.emit('user-form:load', 'signin')
  // }

  // componentWillUnmount () {
  //   bus.emit('user-form:load', '')
  // }

  render() {
    return (
      <div id='sign-in'>
        <div className='title-page'>
          <div className='circle'>
            <i className='icon-login' />
          </div>
          <div className='title-page'>
            <h1>Ingresá a Cidituc</h1>
          </div>
        </div>
        <CidiTucForm />
      </div>
    )
  }
}

export default userConnector(SignIn)

function CidiTucForm() {
  return (
    <div className='cidituc-auth-form'>
      <p style={{ color: '#2A2A2A', fontSize: '12px', textAlign: 'center' }}>Para poder participár en las consultas, iniciá sesión con tu cuenta de <b>CiDiTuc</b>.</p>
      <BtnCidiTuc />
      <hr />
      <div className="helptext">
        <p className="" style={{ marginBottom: '10px' }}><b>Si aún no tenés cuenta en CiDiTuc</b></p>
        <p style={{ color: '#2A2A2A', fontSize: '12px' }}>Podés crearla en pocos pasos haciendo clic <a href="https://ciudaddigital.smt.gob.ar/#/registro"><b>AQUÍ</b></a></p>
      </div>
      <hr />
    </div>
  )
}
