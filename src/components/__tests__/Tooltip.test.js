import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import * as d3 from "d3";
import Tooltip from "../Tooltip";

describe("test Tooltip component", () => {
  const dates = [
    new Date("2018-01-01"),
    new Date("2019-01-01"),
    new Date("2020-01-01"),
    new Date("2021-01-01"),
    new Date("2022-01-01")
  ];
  const values = [100, 200, 300, 400, 500];
  const data = [
    {
      name: "Stocks",
      color: "red",
      items: [
        { date: dates[0], value: values[0] },
        { date: dates[1], value: values[1] },
        { date: dates[2], value: values[2] },
        { date: dates[3], value: values[3] },
        { date: dates[4], value: values[4] }
      ]
    },
    {
      name: "Cash",
      color: "green",
      items: [
        { date: dates[0], value: values[0] + 50 },
        { date: dates[1], value: values[1] + 50 },
        { date: dates[2], value: values[2] + 50 },
        { date: dates[3], value: values[3] + 50 },
        { date: dates[4], value: values[4] + 50 }
      ]
    }
  ];

  const height = 100;
  const width = 200;

  const xScale = d3
    .scaleTime()
    .domain([dates[0], dates[dates.length - 1]])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([values[0], values[values.length - 1] + 50])
    .range([height, 0]);

  test("should render nothing if no data", () => {
    const { container } = render(
      <svg>
        <Tooltip xScale={xScale} yScale={yScale} />
      </svg>
    );

    expect(container.querySelector("svg").children).toHaveLength(0);
  });

  test("should render tooltip elements with proper classNames if data provided", () => {
    const { container } = render(
      <svg>
        <Tooltip xScale={xScale} yScale={yScale} data={data} />
      </svg>
    );

    expect(container.querySelectorAll(".tooltipLine")).toHaveLength(1);
    expect(container.querySelectorAll(".tooltipContent")).toHaveLength(1);
    expect(container.querySelectorAll(".contentBackground")).toHaveLength(1);
    expect(container.querySelectorAll(".contentTitle")).toHaveLength(1);
    expect(container.querySelectorAll(".content")).toHaveLength(1);
    expect(container.querySelectorAll(".tooltipLinePoint")).toHaveLength(
      data.length
    );
  });

  test("should be not visible by default", () => {
    const testId = "tooltip";
    const { getByTestId } = render(
      <svg>
        <Tooltip
          xScale={xScale}
          yScale={yScale}
          data={data}
          data-testid={testId}
        />
      </svg>
    );

    expect(getByTestId(testId)).toBeInTheDocument();
    expect(getByTestId(testId).getAttribute("opacity")).toBe("0");
  });

  test("should handle mouseover and mouseout events", async () => {
    const rect = document.createElement("rect");
    const testId = "tooltip";
    const { getByTestId } = render(
      <svg>
        <Tooltip
          anchorEl={rect}
          xScale={xScale}
          yScale={yScale}
          data={data}
          data-testid={testId}
        />
      </svg>
    );

    expect(getByTestId(testId).getAttribute("opacity")).toBe("0");

    fireEvent.mouseOver(rect);
    await waitFor(() => {
      expect(getByTestId(testId).getAttribute("opacity")).toBe("1");
    });

    fireEvent.mouseOut(rect);
    await waitFor(() => {
      expect(getByTestId(testId).getAttribute("opacity")).toBe("0");
    });
  });

  test("should handle mousemove event and draw tooltip elements", async () => {
    const rect = document.createElement("rect");
    rect.setAttribute("width", height);
    rect.setAttribute("height", width);
    const { container } = render(
      <svg>
        <Tooltip
          height={height}
          width={width}
          anchorEl={rect}
          xScale={xScale}
          yScale={yScale}
          data={data}
        />
      </svg>
    );

    const event1 = { clientX: 0, clientY: 0 };
    const title1 = d3.timeFormat("%b %d, %Y")(dates[0]);

    fireEvent.mouseMove(rect, event1);
    await waitFor(() => {
      const line = container.querySelector(".tooltipLine");
      expect(line.getAttribute("x1")).toBe(`${event1.clientX}`);
      expect(line.getAttribute("x2")).toBe(`${event1.clientX}`);
      expect(line.getAttribute("y1")).toBe("0");
      expect(line.getAttribute("y2")).toBe(`${height}`);

      expect(container.querySelector(".contentTitle").textContent).toBe(title1);

      const points = container.querySelectorAll(".tooltipLinePoint");
      points.forEach((n) => {
        expect(n.getAttribute("opacity")).toBe("1");
      });
    });

    const event2 = { clientX: width, clientY: height };
    const title2 = d3.timeFormat("%b %d, %Y")(dates[dates.length - 1]);

    fireEvent.mouseMove(rect, event2);
    await waitFor(() => {
      const line = container.querySelector(".tooltipLine");
      expect(line.getAttribute("x1")).toBe(`${event2.clientX}`);
      expect(line.getAttribute("x2")).toBe(`${event2.clientX}`);
      expect(line.getAttribute("y1")).toBe("0");
      expect(line.getAttribute("y2")).toBe(`${height}`);

      expect(container.querySelector(".contentTitle").textContent).toBe(title2);
    });
  });
});
