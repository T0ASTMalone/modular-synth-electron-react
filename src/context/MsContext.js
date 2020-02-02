import React, { Component } from "react";

const MsContext = React.createContext({
  error: null,
  sidebar: false,
  patch: [],
  sbView: "modules",
  clearContext: () => {},
  toggleSidebar: () => {}
});

export default MsContext;

export class MsProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      sidebar: false,
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
  };

  clearContext = () => {
    console.log("cleared context");
  };

  render() {
    const value = {
      error: this.state.error,
      sidebar: this.state.sidebar,
      sbView: this.state.sbView,
      setSbView: this.setSbView,
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
