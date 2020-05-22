import React from "react";
import { render } from "@testing-library/react";
import PatchListItem from "../components/PatchListItem/PatchListItem";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("PatchListItem component tests", () => {
  let wrapper;
  let item;

  beforeEach(() => {
    item = "patch.wav";
    wrapper = shallow(<PatchListItem />);
  });

  it("renders without crashing", () => {
    expect(wrapper).toHaveLength(1);
  });

  it("renders a list item containing the provided text", () => {
    wrapper = shallow(<PatchListItem item={item} />);
    expect(wrapper.find("li").text()).toBe(item);
  });

  it("renders a button in li when user interaction is true", () => {
    wrapper = shallow(<PatchListItem item={item} ui={true} />);
    expect(wrapper.find("li").find("button")).toHaveLength(1);
  });

  it("runs the call back funciton for a button click", () => {
    const callBack = jest.fn();
    wrapper = shallow(
      <PatchListItem item={item} ui={true} btnClick={callBack} />
    );
    wrapper.find("li").find("button").simulate("click");
    expect(callBack.mock.calls.length).toEqual(1);
  });

  it("runs the call back function for a doubleclick on li", () => {
    const callBack = jest.fn();
    wrapper = shallow(
      <PatchListItem
        item={item}
        ui={true}
        btnClick={() => {}}
        dbClick={callBack}
      />
    );
    wrapper.find("li").simulate("doubleClick");
    expect(callBack.mock.calls.length).toEqual(1);
  });

  it("runs the call back function for a click on the li", () => {
    const callBack = jest.fn();
    wrapper = shallow(
      <PatchListItem
        item={item}
        ui={true}
        btnClick={() => {}}
        click={callBack}
      />
    );
    wrapper.find("li").simulate("click");
    expect(callBack.mock.calls.length).toEqual(1);
  });
});
