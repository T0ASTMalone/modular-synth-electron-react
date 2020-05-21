import React from "react";
import { render } from "@testing-library/react";
import PatchList from "../components/PatchList/PatchList";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("PatchList component tests", () => {
  let wrapper;
  let list;

  beforeEach(() => {
    list = ["patch.wav"];
    wrapper = shallow(<PatchList />);
  });

  it("renders without crashing", () => {
    expect(wrapper).toHaveLength(1);
  });

  it("renders a list item containing the provided text", () => {
    wrapper = shallow(<PatchList list={list} />);
    expect(wrapper.find("li").text()).toBe(list[0]);
  });

  it("renders a button in li when user interaction is true", () => {
    wrapper = shallow(<PatchList list={list} ui={true} />);
    expect(wrapper.find("li").find("button")).toHaveLength(1);
  });

  it("runs the call back funciton for a button click", () => {});

  it("runs the call back function for a doubleclick on li", () => {});
});
