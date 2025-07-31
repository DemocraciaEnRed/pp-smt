import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'

export default function ForumConnectorFactory(WrappedComponent) {
  return class ForumConnector extends Component {
    static displayName = `ForumConnector(${getDisplayName(WrappedComponent)})`

    static WrappedComponent = WrappedComponent

    state = {
      forumConfig: null
    }

    componentDidMount() {
      this.fetchForum(this.props.forum && this.props.forum.id)
    }

    fetchForum = (forumId) => {
      forumStore.findOneByName('proyectos')
        .then((forum) => {
          this.setState({ forumConfig: forum.config })
        })
        .catch((err) => { throw err })
    }

    render() {
      return <WrappedComponent forumConfig={this.state.forumConfig} {...this.props} />
    }
  }
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
}
