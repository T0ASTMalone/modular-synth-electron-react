import React, { Component } from "react";

const MsContext = React.createContext({
  error: null,
  sidebar: null,
  sbContent: "",
  loaded: [],
  clearContext: () => {},
  setSbContent: () => {},
  toggleSidebar: () => {}
});

export default MsContext;

export class MsProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      sidebar: false,
      sbContent: "",
      loaded: []
    };
  }

  load = name => {
    const { loaded } = this.state;
    this.setState({ loaded: [...(loaded ? loaded : []), name] });
  };

  unload = id => {
    const { loaded } = this.state;
    if (loaded.length < 1) {
      return;
    }
    const updatedModules = loaded.filter(mod => mod.id !== id);
    this.setState({ loaded: [...updatedModules] });
  };

  setSbContent = sbContent => {
    this.setState({ sbContent });
  };

  toggleSidebar = () => {
    const sidebar = this.state.sidebar;
    this.setState({
      sidebar: !sidebar
    });
  };

  clearContext = () => {
    console.log("cleared context");
  };

  render() {
    const value = {
      error: this.state.error,
      sidebar: this.state.sidebar,
      sbContent: this.state.sbContent,
      loaded: this.state.loaded,

      load: this.load,
      setSbContent: this.setSbContent,
      toggleSidebar: this.toggleSidebar,
      clearContext: this.clearContext
    };

    return (
      <MsContext.Provider value={value}>
        {this.props.children}
      </MsContext.Provider>
    );
  }
}
