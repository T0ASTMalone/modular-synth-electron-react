import React, { Component } from "react";

const MsContext = React.createContext({
  error: null,
  ctx: null,
  nodes: {},
  cables: {},
  input: null,
  output: null,
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
      cables: {},
      input: null,
      output: null,
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

  _createConnection = (input, output) => {
    const { cables } = this.state;
    cables[output] = input;

    this.setState({ cables, input: null, output: null });
  };

  createInput = (mod, inputId) => {
    const { output } = this.state;

    const input = {
      mod,
      input: inputId
    };

    this.setState({ input });

    if (output && output !== input.mod) {
      this._createConnection(input, output);
    }
  };

  createOutput = output => {
    const { input } = this.state;
    this.setState({ output });

    if (input && output !== input.mod) {
      this._createConnection(input, output);
    }
  };

  removeInput = (mod, inputId) => {
    const { cables } = this.state;
    const output = Object.keys(cables).find(
      key => cables[key].mod === mod && cables[key].input === inputId
    );
    delete cables[output];
    this.setState({ cables, input: null, output });
  };

  removeOutput = id => {
    const { cables } = this.state;
    const input = cables[id];
    delete cables[id];
    this.setState({ cables, input, output: null });
  };

  clearContext = () => {
    console.log("cleared context");
  };

  render() {
    const value = {
      // state
      ctx: this.state.ctx,
      nodes: this.state.nodes,
      cables: this.state.cables,
      error: this.state.error,
      sidebar: this.state.sidebar,
      sbContent: this.state.sbContent,
      loaded: this.state.loaded,
      //output only for testing
      output: this.state.output,
      input: this.state.input,

      // methods
      createCtx: this.createCtx,
      addNode: this.addNode,
      createInput: this.createInput,
      createOutput: this.createOutput,
      removeInput: this.removeInput,
      removeOutput: this.removeOutput,
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
