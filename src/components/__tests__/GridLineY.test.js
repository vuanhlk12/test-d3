import React from "react";
import { render, waitFor } from "@testing-library/react";
import * as d3 from "d3";
import GridLine from "../GridLine";

describe("test GridLine component type='horizontal'", () => {
  const data = [
    { date: new Date("2018-01-01"), value: 1.5 },
    { date: new Date("2019-01-01"), value: -1 },
    { date: new Date("2020-01-01"), value: -0.2 },
    { date: new Date("2021-01-01"), value: 2.2 },
    { date: new Date("2022-01-01"), value: 3 }
  ];
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.value))
    .range([0, 1]);

  test("should not render ticks by default", () => {
    const { container } = render(
      <svg>
        <GridLine type="horizontal" scale={yScale} />
      </svg>
    );
    const group = container.querySelector("g");

    expect(group).toBeInTheDocument();
    expect(group.querySelectorAll(".tick")).toHaveLength(0);
  });

  test("should render provided number of ticks", () => {
    const ticks = 5;
    const { container } = render(
      <svg>
        <GridLine type="horizontal" scale={yScale} ticks={ticks} />
      </svg>
    );
    const tickElements = container.querySelectorAll(".tick");

    expect(tickElements).toHaveLength(ticks);
    tickElements.forEach((t) => {
      const line = t.querySelector("line");
      expect(line).toBeInTheDocument();
    });
  });

  test("should not render .domain", () => {
    const { container } = render(
      <svg>
        <GridLine type="horizontal" scale={yScale} ticks={2} />
      </svg>
    );
    const domain = container.querySelector(".domain");

    expect(domain).not.toBeInTheDocument();
  });

  test("should not render text", () => {
    const { container } = render(
      <svg>
        <GridLine type="horizontal" scale={yScale} ticks={2} />
      </svg>
    );
    const textElements = container.querySelectorAll("text");

    expect(textElements).toHaveLength(0);
  });

  test("should render with animation by default", async () => {
    const { container } = render(
      <svg>
        <GridLine type="horizontal" scale={yScale} ticks={5} />
      </svg>
    );
    const tickLine = container.querySelectorAll(".tick")[0];

    const opacityBefore = tickLine.getAttribute("opacity");

    await waitFor(() => {
      const opacityAfter = tickLine.getAttribute("opacity");
      expect(opacityAfter > opacityBefore).toBeTruthy();
    });
  });

  test("should handle disableAnimation", () => {
    const { container } = render(
      <svg>
        <GridLine type="horizontal" scale={yScale} ticks={1} disableAnimation />
      </svg>
    );
    const tickLine = container.querySelectorAll(".tick")[0];

    expect(tickLine.getAttribute("opacity")).toBe("1");
  });

  test("should accept transition property", () => {
    const transition = "translate(10,20)";
    const { container } = render(
      <svg>
        <GridLine type="horizontal" scale={yScale} transition={transition} />
      </svg>
    );

    const group = container.querySelector("g");

    expect(group.getAttribute("transition")).toBe(transition);
  });

  test("should accept width property", () => {
    const width = 400;
    const { container } = render(
      <svg>
        <GridLine type="horizontal" scale={yScale} size={width} ticks={1} />
      </svg>
    );

    const line = container.querySelector("line");

    expect(line.getAttribute("x2")).toBe(`${width}`);
  });

  test("should accept other props", () => {
    const className = "my-class";
    const id = "my-id";
    const { container } = render(
      <svg>
        <GridLine
          type="horizontal"
          scale={yScale}
          id={id}
          className={className}
        />
      </svg>
    );

    const group = container.querySelector("g");

    expect(group.getAttribute("id")).toBe(id);
    expect(group.getAttribute("class")).toBe(className);
  });
});
