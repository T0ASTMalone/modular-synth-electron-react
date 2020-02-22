import React, { Component } from "react";

const MsContext = React.createContext({
  error: null,
  ctx: null,
  nodes: {},
  sidebar: null,
  sbContent: "",
  loaded: [],
  clearContext: () => {},
  setSbContent: () => {},
  toggleSidebar: () => {},
  addNode: () => {}
});

export default MsContext;

export class MsProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ctx: null,
      nodes: {},
      error: null,
      sidebar: false,
      sbContent: "",
      loaded: []
    };
  }

  addNode = (id, audioNode) => {
    let nodes = this.state.nodes;
    nodes[id] = audioNode;
    this.setState({ nodes });
  };

  createCtx = ctx => {
    this.setState({ ctx });
  };

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
      ctx: this.state.ctx,
      nodes: this.state.nodes,
      error: this.state.error,
      sidebar: this.state.sidebar,
      sbContent: this.state.sbContent,
      loaded: this.state.loaded,

      createCtx: this.createCtx,
      addNode: this.addNode,
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
