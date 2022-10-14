import React from "react";
import { render, waitFor } from "@testing-library/react";
import * as d3 from "d3";
import Axis from "../Axis";

describe("test Axis component type='left'", () => {
  const data = [
    { date: new Date("2018-01-01"), value: 100 },
    { date: new Date("2019-01-01"), value: 200 },
    { date: new Date("2020-01-01"), value: 300 },
    { date: new Date("2021-01-01"), value: 400 },
    { date: new Date("2022-01-01"), value: 500 }
  ];
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.value))
    .range([0, 1]);

  test("should not render ticks by default", () => {
    const { container } = render(
      <svg>
        <Axis type="left" scale={yScale} />
      </svg>
    );
    const group = container.querySelector("g");

    expect(group).toBeInTheDocument();
    expect(group.querySelectorAll(".tick")).toHaveLength(0);
  });

  test("should render provided number of ticks", () => {
    const ticks = 2;
    const { container } = render(
      <svg>
        <Axis type="left" scale={yScale} ticks={ticks} />
      </svg>
    );
    const tickElements = container.querySelectorAll(".tick");

    expect(tickElements).toHaveLength(ticks);
    tickElements.forEach((t) => {
      const line = t.querySelector("line");
      const text = t.querySelector("text");
      expect(line).not.toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(text.getAttribute("font-size")).toBe("0.75rem");
      expect(text.getAttribute("opacity")).toBe("0.5");
    });
  });

  test("should not render .domain", () => {
    const { container } = render(
      <svg>
        <Axis type="left" scale={yScale} ticks={2} />
      </svg>
    );
    const domain = container.querySelector(".domain");

    expect(domain).not.toBeInTheDocument();
  });

  test("should handle tickFormat", async () => {
    const ticks = data.length;
    const tickFormat = d3.format("$");
    const { getByText } = render(
      <svg>
        <Axis
          type="left"
          scale={yScale}
          ticks={ticks}
          tickFormat={tickFormat}
        />
      </svg>
    );

    await waitFor(() => {
      data.forEach(({ value }, i) => {
        if (i !== 0) {
          // skip first tick
          expect(getByText(`$${value}`)).toBeInTheDocument();
        }
      });
    });
  });

  test("should handle disableAnimation", () => {
    const ticks = data.length;
    const { getByText } = render(
      <svg>
        <Axis type="left" scale={yScale} ticks={ticks} disableAnimation />
      </svg>
    );

    data.forEach(({ value }, i) => {
      if (i !== 0) {
        // skip first tick
        expect(getByText(value.toString())).toBeInTheDocument();
      }
    });
  });

  test("should accept transition property", () => {
    const transition = "translate(10,20)";
    const { container } = render(
      <svg>
        <Axis type="left" scale={yScale} transition={transition} />
      </svg>
    );

    const group = container.querySelector("g");

    expect(group.getAttribute("transition")).toBe(transition);
  });

  test("should accept other props", () => {
    const className = "my-class";
    const id = "my-id";
    const { container } = render(
      <svg>
        <Axis type="left" scale={yScale} id={id} className={className} />
      </svg>
    );

    const group = container.querySelector("g");

    expect(group.getAttribute("id")).toBe(id);
    expect(group.getAttribute("class")).toBe(className);
  });
});
