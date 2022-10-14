import React from "react";
import { render, waitFor } from "@testing-library/react";
import * as d3 from "d3";
import Line from "../Line";

describe("test Line component", () => {
  const TOTAL_LENGTH = 500;
  const xScale = d3.scaleTime();
  const yScale = d3.scaleLinear();
  const data = [
    { date: new Date("2018-01-01"), value: 100 },
    { date: new Date("2019-01-01"), value: 200 },
    { date: new Date("2020-01-01"), value: 300 }
  ];
  beforeAll(() => {
    // Add getTotalLength support for jsdom
    if (!SVGElement.prototype.getTotalLength) {
      SVGElement.prototype.getTotalLength = () => TOTAL_LENGTH;
    }
  });

  test("should render path with data and default animation", () => {
    const { container } = render(
      <svg>
        <Line xScale={xScale} yScale={yScale} data={data} />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("d")).not.toMatch(
      /[^MmLlHhVvCcSsQqTtAaZz\.\,\s\d]/gi
    );
    expect(path.getAttribute("d")).not.toMatch(/NaN|undefined/);
    expect(path.getAttribute("d")).not.toBe("");
    expect(path.getAttribute("opacity")).toBe("1");
    expect(path.getAttribute("stroke")).toBe("white");
    expect(path.getAttribute("stroke-dasharray")).toBe(
      `${TOTAL_LENGTH},${TOTAL_LENGTH}`
    );
    expect(path.getAttribute("stroke-dashoffset")).toBe(`${TOTAL_LENGTH}`);
  });

  test("should render path with custom color", () => {
    const color = "red";
    const { container } = render(
      <svg>
        <Line xScale={xScale} yScale={yScale} data={data} color={color} />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("d")).not.toMatch(/NaN|undefined/);
    expect(path.getAttribute("d")).not.toBe("");
    expect(path.getAttribute("stroke")).toBe(color);
  });

  test("should render path with isSmooth property", () => {
    const { container } = render(
      <svg>
        <Line xScale={xScale} yScale={yScale} data={data} isSmooth />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("d")).not.toMatch(/NaN|undefined/);
    expect(path.getAttribute("d")).not.toBe("");
  });

  test("should handle fadeIn animation", async () => {
    const { container } = render(
      <svg>
        <Line xScale={xScale} yScale={yScale} data={data} animation="fadeIn" />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("opacity")).toBe("0");
    expect(path.getAttribute("stroke-dasharray")).toBe(null);
    await waitFor(() => expect(path.getAttribute("opacity")).toBe("1"));
  });

  test("should handle left animation", async () => {
    const { container } = render(
      <svg>
        <Line xScale={xScale} yScale={yScale} data={data} animation="left" />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("opacity")).toBe("1");
    expect(path.getAttribute("stroke")).toBe("white");
    expect(path.getAttribute("stroke-dasharray")).toBe(
      `${TOTAL_LENGTH},${TOTAL_LENGTH}`
    );
    expect(path.getAttribute("stroke-dashoffset")).toBe(`${TOTAL_LENGTH}`);

    await waitFor(() => {
      expect(path.getAttribute("opacity")).toBe("1");
      expect(path.getAttribute("stroke-dasharray")).toBe(
        `${TOTAL_LENGTH},${TOTAL_LENGTH}`
      );
      expect(path.getAttribute("stroke-dashoffset")).toBe("0");
    });
  });

  test("should handle none animation", () => {
    const { container } = render(
      <svg>
        <Line xScale={xScale} yScale={yScale} data={data} animation="none" />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("opacity")).toBe("1");
    expect(path.getAttribute("stroke-dasharray")).toBe(null);
  });

  test("should handle invalid data type", () => {
    jest.spyOn(console, "error").mockImplementation();
    const { container } = render(
      <svg>
        <Line xScale={xScale} yScale={yScale} data="data" />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("d")).toBe("");
  });

  test("should handle invalid data content", () => {
    const { container } = render(
      <svg>
        <Line xScale={xScale} yScale={yScale} data={["one", "two"]} />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("d")).toBe("");
  });

  test("should accept other props", () => {
    const className = "my-class";
    const id = "my-id";
    const { container } = render(
      <svg>
        <Line
          xScale={xScale}
          yScale={yScale}
          data={data}
          id={id}
          className={className}
        />
      </svg>
    );

    const path = container.querySelector("path");

    expect(path.getAttribute("id")).toBe(id);
    expect(path.getAttribute("class")).toBe(className);
  });
});
