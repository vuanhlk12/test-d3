import React from "react";
import { render, waitFor } from "@testing-library/react";
import * as d3 from "d3";
import GridLine from "../GridLine";

describe("test GridLine component type='vertical'", () => {
  const data = [
    { date: new Date("2018-01-01") },
    { date: new Date("2019-01-01") },
    { date: new Date("2020-01-01") },
    { date: new Date("2021-01-01") },
    { date: new Date("2022-01-01") }
  ];
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, 1]);

  test("should not render ticks by default", () => {
    const { container } = render(
      <svg>
        <GridLine type="vertical" scale={xScale} />
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
        <GridLine type="vertical" scale={xScale} ticks={ticks} />
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
        <GridLine type="vertical" scale={xScale} ticks={2} />
      </svg>
    );
    const domain = container.querySelector(".domain");

    expect(domain).not.toBeInTheDocument();
  });

  test("should not render text", () => {
    const { container } = render(
      <svg>
        <GridLine type="vertical" scale={xScale} ticks={2} />
      </svg>
    );
    const textElements = container.querySelectorAll("text");

    expect(textElements).toHaveLength(0);
  });

  test("should render with animation by default", async () => {
    const { container } = render(
      <svg>
        <GridLine type="vertical" scale={xScale} ticks={1} />
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
        <GridLine type="vertical" scale={xScale} ticks={1} disableAnimation />
      </svg>
    );
    const tickLine = container.querySelectorAll(".tick")[0];

    expect(tickLine.getAttribute("opacity")).toBe("1");
  });

  test("should accept transition property", () => {
    const transition = "translate(10,20)";
    const { container } = render(
      <svg>
        <GridLine type="vertical" scale={xScale} transition={transition} />
      </svg>
    );

    const group = container.querySelector("g");

    expect(group.getAttribute("transition")).toBe(transition);
  });

  test("should accept size property", () => {
    const height = 400;
    const { container } = render(
      <svg>
        <GridLine type="vertical" scale={xScale} size={height} ticks={1} />
      </svg>
    );

    const line = container.querySelector("line");

    expect(line.getAttribute("y2")).toBe(`${-height}`);
  });

  test("should accept other props", () => {
    const className = "my-class";
    const id = "my-id";
    const { container } = render(
      <svg>
        <GridLine
          type="vertical"
          scale={xScale}
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
