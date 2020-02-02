import React, { Component } from "react";

const MsContext = React.createContext({
  error: null,
<<<<<<< HEAD
  sidebar: false,
  patch: [],
  sbView: "modules",
=======
  sidebar: null,
  sbContent: "",
  loaded: [],
>>>>>>> 005144d7f6bc58f3cbf1d827741c5e93bfe9b5cf
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
<<<<<<< HEAD
      sbView: "modules"
    };
  }

  setSbView = label => {
    console.log(label, ": context label");
    let sbView = label;
    this.setState({ sbView });
  };

  toggleSidebar = () => {
    let sidebar = this.state.sidebar;
    this.setState({ sidebar: !sidebar });
=======
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
>>>>>>> 005144d7f6bc58f3cbf1d827741c5e93bfe9b5cf
  };

  clearContext = () => {
    console.log("cleared context");
  };

  render() {
    const value = {
      error: this.state.error,
      sidebar: this.state.sidebar,
<<<<<<< HEAD
      sbView: this.state.sbView,
      setSbView: this.setSbView,
=======
      sbContent: this.state.sbContent,
      loaded: this.state.loaded,

      load: this.load,
      setSbContent: this.setSbContent,
>>>>>>> 005144d7f6bc58f3cbf1d827741c5e93bfe9b5cf
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
