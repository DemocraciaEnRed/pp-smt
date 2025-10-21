import React, { Component } from 'react'
import 'whatwg-fetch'
import ReactPaginate from 'react-paginate'
import voteStore from '../../stores/vote-store'
import zonaStore from '../../stores/zona-store'

export default class AdminVotes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      zones: null,
      ballotBox: null,
      quantity: 0,
      votes: [],
      votesByBox: null,
      result: null,
      showWarning: false,
      showSuccess: false,
      textWarning: '',
      textSuccess: '',
      // 🔹 paginación
      currentPage: 0,
      votesPerPage: 10,
      modalOpen: false
    }

    this.bulkVotes = this.bulkVotes.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.fetchVotes()
    this.fethcZone()
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  fetchVotes() {
    voteStore.findByTopic(this.props.topic.id)
      .then(votes => {
        let votesByBox = {}

        votes.forEach(vote => {
          if (!vote.urna) votesByBox[vote.zona.id] = []
          else votesByBox[vote.urna.id] = []

        })


        Object.keys(votesByBox).forEach(box => {
          votesByBox[box].push(...votes.filter(vote => {
            if (vote.urna) return vote.urna.id === box
            else return vote.zona.id === box
          }))
        });

        this.setState({ votes, votesByBox })
      })
  }

  toggleModal = () => {
    let { ballotBox, quantity } = this.state

    if (quantity <= 0) {
      this.setState({
        showWarning: true,
        textWarning: 'La cantidad de votos no puede ser 0'
      })
      return
    }

    if (!ballotBox) {
      this.setState({
        showWarning: true,
        textWarning: 'Debe elegir un distrito'
      })
      return
    }
    const { modalOpen } = this.state
    this.setState({ modalOpen: !modalOpen })
  }

  fethcZone() {
    zonaStore.findAll()
      .then(zones => this.setState({ zones }))
  }

  bulkVotes() {
    let { ballotBox, quantity } = this.state
    let { topic } = this.props
    this.closeNotifications()
    let body = { ballotBox, quantity }

    window.fetch(`/api/v2/votes/${topic.id}/addVotes`, {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.status === 200 && res.json())
      .then(res => {
        this.setState({
          result: res,
          showSuccess: true,
          textSuccess: `Se agregaron ${quantity} votos al proyecto ${this.props.topic.mediaTitle}`,
          modalOpen: false
        }, this.resetForm)
      })
      .catch((err) => {
        this.setState({
          showWarning: true,
          textWarning: `No se ha podido agregar los votos`
        })
        console.log(err)
      })
  }

  closeNotifications() {
    this.setState({
      showWarning: false,
      showSuccess: false,
      textWarning: '',
      textSuccess: ''
    })
  }

  // 🔹 manejador de cambio de página
  handlePageClick(event) {
    this.setState({ currentPage: event.selected });
  }

  render() {
    const { zones, votes, votesByBox, ballotBox, quantity, currentPage, votesPerPage, modalOpen } = this.state
    const { topic } = this.props

    // 🔹 Calcular los votos visibles
    const offset = currentPage * votesPerPage
    const currentVotes = votes.slice(offset, offset + votesPerPage)
    const pageCount = Math.ceil(votes.length / votesPerPage)

    return (
      <div className='admin-votes'>
        <h2>Votos</h2>
        {votes && <p>Total: {votes.length}</p>}

        {votesByBox && Object.keys(votesByBox).length > 0 && (
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Urna</th>
                  <th>Cantidad de votos</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(votesByBox).map(box => (
                  <tr key={box}>
                    <td>{zones.find(zone => zone.id === box).nombre}</td>
                    <td>{votesByBox[box].length}</td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

        {votes && votes.length > 0 && (
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Usuario</th>
                  <th>Zona del proyecto</th>
                  <th>Urna</th>
                </tr>
              </thead>
              <tbody>
                {currentVotes.map(vote => (
                  <tr key={vote.id}>
                    <td>{vote.id}</td>
                    <td>{vote.user.dni}</td>
                    <td>{vote.zona.nombre}</td>
                    <td>{vote.urna.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 🔹 Paginador elegante */}
            <ReactPaginate
              breakLabel=""
              nextLabel=">"
              onPageChange={this.handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="<"
              renderOnZeroPageCount={null}
              containerClassName="pagination "
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          </div>
        )}



        <hr />

        {this.state.showWarning &&
          <div className='alert alert-warning alert-dismissible' role='alert'>
            <button type='button' onClick={this.closeNotifications} className='close' data-dismiss='alert' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
            {this.state.textWarning}
          </div>
        }

        {this.state.showSuccess &&
          <div className='alert alert-success alert-dismissible' role='alert'>
            <button type='button' onClick={this.closeNotifications} className='close' data-dismiss='alert' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
            {this.state.textSuccess}
          </div>
        }

        <div className='form-group'>
          <label>Urna (distrito)</label>
          {zones && (
            <select className='form-control' name="ballotBox" onChange={this.handleInputChange}>
              <option value="">Seleccionar distrito</option>
              {zones.map(zone => <option key={zone.id} value={zone.id}>{zone.nombre}</option>)}
            </select>
          )}
        </div>

        <div className='form-group'>
          <label>Cantidad de votos</label>
          <input
            type='number'
            min={1}
            className='form-control'
            name="quantity"
            onChange={this.handleInputChange}
          />
        </div>

        {!modalOpen && <div className='form-group pull-right'>
          <button type='button' onClick={this.toggleModal} className='btn btn-primary'>Agregar votos</button>
        </div>}
        {
          modalOpen && (
            <div className='tags-modal'>
              <div
                className='overlay'
                onClick={this.toggleModal} />
              <div className='content'>
                <form onSubmit={this.updateTags}>
                  <p className='tag-label'>Agregar {quantity} votos al proyecto "{topic.mediaTitle}" en la urna "{zones.find(zone => zone.id === ballotBox).nombre}"</p>
                  <div>
                    <button
                      className='btn btn-primary' onClick={this.bulkVotes}>
                      Confirmar
                    </button>
                    <button
                      className='btn btn-danger' onClick={this.toggleModal}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
