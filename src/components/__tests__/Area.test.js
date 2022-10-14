import React from "react";
import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import * as d3 from "d3";
import Area from "../Area";

describe("test Area component", () => {
  const xScale = d3.scaleTime();
  const yScale = d3.scaleLinear();
  const data = [
    { date: new Date("2018-01-01"), value: 100 },
    { date: new Date("2019-01-01"), value: 200 },
    { date: new Date("2020-01-01"), value: 300 }
  ];

  test("should render path with data and default color", async () => {
    const { container } = render(
      <svg>
        <Area xScale={xScale} yScale={yScale} data={data} />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("d")).not.toMatch(/NaN|undefined/);
    expect(path.getAttribute("d")).not.toBe("");
    expect(path.getAttribute("opacity")).toBe("0");
    expect(path.getAttribute("fill")).toBe("url(#gradient-white)");
    await waitFor(() => {
      expect(path.getAttribute("opacity")).toBe("1");
    });
  });

  test("should render path with custom color", () => {
    const color = "#ff00bb";
    const { container } = render(
      <svg>
        <Area xScale={xScale} yScale={yScale} data={data} color={color} />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("d")).not.toMatch(/NaN|undefined/);
    expect(path.getAttribute("d")).not.toBe("");
    expect(path.getAttribute("fill")).toBe(`url(#gradient-${color})`);
  });

  test("should render lineargradient with gradient property", () => {
    const color = "#FF00FF";
    const gradientId = `gradient-${color}`;
    const { container } = render(
      <svg>
        <Area
          xScale={xScale}
          yScale={yScale}
          data={data}
          gradient
          color={color}
        />
      </svg>
    );

    const path = container.querySelector("path");
    const gradient = container.querySelector("linearGradient");
    const stopElements = gradient.querySelectorAll("stop");

    expect(path.getAttribute("d")).not.toMatch(/NaN|undefined/);
    expect(path.getAttribute("d")).not.toBe("");
    expect(path.getAttribute("fill")).toBe(`url(#${gradientId})`);

    expect(gradient.getAttribute("id")).toBe(gradientId);

    expect(stopElements).toHaveLength(2);
    expect(stopElements[0].getAttribute("stop-color")).toBe(color);
    expect(stopElements[1].getAttribute("stop-color")).toBe(color);
  });

  test("should handle empty data", () => {
    const { container } = render(
      <svg>
        <Area xScale={xScale} yScale={yScale} />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path).toBeInTheDocument();
    expect(path.getAttribute("d")).toBe(null);
  });

  test("should handle disableAnimation property", () => {
    const { container } = render(
      <svg>
        <Area xScale={xScale} yScale={yScale} data={data} disableAnimation />
      </svg>
    );
    const path = container.querySelector("path");

    expect(path.getAttribute("d")).not.toMatch(/NaN|undefined/);
    expect(path.getAttribute("d")).not.toBe("");
    expect(path.getAttribute("opacity")).toBe("1");
  });

  test("should accept other props", () => {
    const className = "my-class";
    const id = "my-id";
    const { container } = render(
      <svg>
        <Area
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
