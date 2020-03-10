import React, { Component } from "react";
import shortid from "shortid";

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
    console.log(id, audioNode);
    const { nodes } = this.state;
    nodes[id].node = audioNode;
    this.setState({ nodes });
  };

  createCtx = ctx => {
    this.setState({ ctx });
  };

  load = type => {
    // get nodes object and update from state
    const { nodes, update } = this.state;
    // create id
    const id = shortid.generate();
    // create property in nodes module with the id as the key and properties of type and node
    // type being the type passed in and node being the audio node
    // the audio node will be null until the module is loaded and the node is created by
    // the module
    nodes[id] = {
      type,
      node: null
    };
    // update state
    this.setState({ nodes, update: !update });
    return id;
  };

  unload = id => {
    const { nodes, update } = this.state;
    delete nodes[id];
    this.setState({ nodes, update: !update });
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
