import React from "react";
//import { render } from "@testing-library/react";
import Recordings from "../components/Recordings/Recordings.js";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Recordings component tests", () => {
  const wrapper = shallow(<Recordings />);
  it("renders without crashing", () => {
    expect(wrapper).toHaveLength(1);
  });
});
