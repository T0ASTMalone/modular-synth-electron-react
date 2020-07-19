import * as React from "react";

/// <reference types="index"/>

enum AUDIO_PARAM {
  FREQUENCY = "frequency",
  GAIN = "gain",
  Q = "Q",
  TYPE = "type",
  BUFFER = "buffer",
}

/* Audio Stuff */

type nodes = {
  [nodeId: string]: node;
};

type node = {
  type: string;
  node: AudioNode;
};

type cables = {
  [outputNodeId: string]: input;
};

type input = {
  color: string;
  mod: string;
  input: AUDIO_PARAM;
};

/* Project related types */

type tmpObj = {
  name: string;
  removeCallback: () => {};
};

type project = {
  file: patch;
  path: string;
  tmpobj: { name: string; removeCallback: () => {} };
};

type patch = {
  loadedModuels: loadedMods;
  moduleSettings: allModSettings;
  cables: cables;
};

type loadedMods = {
  mod: mod;
};

type mod = {
  id: string;
  type: string;
};

type allModSettings = {
  [modId: string]: modSettings;
};

/**
 * key should be an AUDIO_PARAM value
 */
type modSettings = {
  [key: string]: number;
};

declare module "react" {
  type Provider<T> = React.ComponentType<{
    value: T;
    children?: ReactNode;
  }>;
  type Consumer<T> = ComponentType<{
    children: (value: T) => ReactNode;
    unstable_observedBits?: number;
  }>;

  interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
  }

  function createContext<T>(
    defaultValue: T,
    calculateChangedBits?: (prev: T, next: T) => number
  ): Context<T>;
}
