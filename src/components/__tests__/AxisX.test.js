import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import * as d3 from "d3";
import Axis from "../Axis";

describe("test Axis component type='bottom'", () => {
  const data = [
    { date: new Date("2018-01-01") },
    { date: new Date("2019-01-01") },
    { date: new Date("2020-01-01") },
    { date: new Date("2021-01-01") },
    { date: new Date("2022-01-01") }
  ];
  const width = 200;
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, width]);

  test("should not render ticks by default", () => {
    const { container } = render(
      <svg>
        <Axis type="bottom" scale={xScale} />
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
        <Axis type="bottom" scale={xScale} ticks={ticks} />
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
        <Axis type="bottom" scale={xScale} ticks={2} />
      </svg>
    );
    const domain = container.querySelector(".domain");

    expect(domain).not.toBeInTheDocument();
  });

  test("should handle tickFormat", async () => {
    const ticks = data.length;
    const tickFormat = d3.timeFormat("%Y"); // Year
    const { getByText } = render(
      <svg>
        <Axis
          type="bottom"
          scale={xScale}
          ticks={ticks}
          tickFormat={tickFormat}
        />
      </svg>
    );

    await waitFor(() => {
      data.forEach(({ date }, i) => {
        if (i !== 0) {
          // skip first tick
          const year = date.getFullYear().toString();
          expect(getByText(year)).toBeInTheDocument();
        }
      });
    });
  });

  test("should handle disableAnimation", () => {
    const ticks = data.length;
    const tickFormat = d3.timeFormat("%Y"); // Year
    const { getByText } = render(
      <svg>
        <Axis
          type="bottom"
          scale={xScale}
          ticks={ticks}
          tickFormat={tickFormat}
          disableAnimation
        />
      </svg>
    );

    data.forEach(({ date }, i) => {
      if (i !== 0) {
        // skip first tick
        const year = date.getFullYear().toString();
        expect(getByText(year)).toBeInTheDocument();
      }
    });
  });

  test("should accept transition property", () => {
    const transition = "translate(10,20)";
    const { container } = render(
      <svg>
        <Axis type="bottom" scale={xScale} transition={transition} />
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
        <Axis type="bottom" scale={xScale} id={id} className={className} />
      </svg>
    );

    const group = container.querySelector("g");

    expect(group.getAttribute("id")).toBe(id);
    expect(group.getAttribute("class")).toBe(className);
  });

  test("should handle mousemove and mouseout events", async () => {
    const rect = document.createElement("rect");
    rect.setAttribute("width", width);
    const { container } = render(
      <svg>
        <Axis
          type="bottom"
          anchorEl={rect}
          scale={xScale}
          ticks={data.length}
        />
      </svg>
    );

    const event1 = { clientX: 0, clientY: 0 };

    fireEvent.mouseMove(rect, event1);
    await waitFor(() => {
      const tickElements = container.querySelectorAll(".tick");
      tickElements.forEach((t) => {
        const text = t.querySelector("text");
        expect(text.getAttribute("opacity")).toBe("0.5");
        expect(text.style.fontWeight).toBe("normal");
      });
    });

    const sectionWidth = width / (data.length - 1);
    // mousemove over 1st section
    const event2 = { clientX: sectionWidth, clientY: 0 };

    fireEvent.mouseMove(rect, event2);
    await waitFor(() => {
      const tickElements = container.querySelectorAll(".tick");
      tickElements.forEach((t, i) => {
        const text = t.querySelector("text");
        expect(text.getAttribute("opacity")).toBe(i === 0 ? "1" : "0.5");
        expect(text.style.fontWeight).toBe(i === 0 ? "bold" : "normal");
      });
    });

    // mousemove over 2nd section
    const event3 = { clientX: sectionWidth * 2, clientY: 0 };

    fireEvent.mouseMove(rect, event3);
    await waitFor(() => {
      const tickElements = container.querySelectorAll(".tick");
      tickElements.forEach((t, i) => {
        const text = t.querySelector("text");
        expect(text.getAttribute("opacity")).toBe(i === 1 ? "1" : "0.5");
        expect(text.style.fontWeight).toBe(i === 1 ? "bold" : "normal");
      });
    });

    fireEvent.mouseOut(rect);
    await waitFor(() => {
      const tickElements = container.querySelectorAll(".tick");
      tickElements.forEach((t) => {
        const text = t.querySelector("text");
        expect(text.getAttribute("opacity")).toBe("0.5");
        expect(text.style.fontWeight).toBe("normal");
      });
    });
  });
});
