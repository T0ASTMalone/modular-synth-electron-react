import React, { Component } from "react";

const MsContext = React.createContext({
  error: null,
  sidebar: false,
  clearContext: () => {},
  toggleSidebar: () => {}
});

export default MsContext;

export class MsProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      sidebar: false
    };
  }

  toggleSidebar = () => {
    console.log("toggling sidebar");
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
