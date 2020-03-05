import React, { Component } from "react";

const MsContext = React.createContext({
  error: null,
  update: false,
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
      update: false,
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
    const { loaded, update } = this.state;
    const openSlot = loaded.indexOf(undefined);
    console.log(openSlot);
    if (openSlot >= 0) {
      loaded[openSlot] = name;
      this.setState({ loaded, update: !update });
    } else {
      this.setState({
        loaded: [...(loaded ? loaded : []), name],
        update: !update
      });
    }
  };

  unload = (index, id) => {
    const { loaded, nodes, update } = this.state;
    if (loaded.length < 1) {
      return;
    } else if (loaded.length === 1) {
      this.setState({ loaded: [], nodes: {}, update: !update });
    } else {
      delete nodes[id];
      loaded[index] = undefined;
      this.setState({ loaded, nodes, update: !update });
    }
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
      update: this.state.update,
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
      unload: this.unload,
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
