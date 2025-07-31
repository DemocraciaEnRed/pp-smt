import React, { Component } from 'react'
import t from 't-component'

export default class BtnCidiTuc extends Component {
  static defaultProps = {
    action: 'ext/api/auth/cidituc/login'
  }

  render() {
    const { action } = this.props

    return (
      <form
        className='btn-cidituc-form'
        action={action}
        method='get'
        role='form'>
        <button
          className='btn-cidituc-btn '
          type='submit'>
          <img src='/lib/boot/logo-mobile.png' width='200' />
        </button>
      </form>
    )
  }
}
