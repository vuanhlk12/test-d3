import React from 'react';
import { render } from '@testing-library/react';
import Overlay from '../Overlay';

describe('test Overlay component', () => {
  test('should forward ref and return wrapped component', () => {
    const width = 200;
    const height = 100;
    const children = <text>Child</text>;
    const ref = React.createRef();
    const { container, getByText } = render((
      <svg>
        <Overlay width={width} height={height} ref={ref}>
          {children}
        </Overlay>
      </svg>
    ));

    expect(container.querySelector('rect')).toEqual(ref.current);
    expect(ref.current.getAttribute('width')).toBe(`${width}`);
    expect(ref.current.getAttribute('height')).toBe(`${height}`);
    expect(ref.current.getAttribute('opacity')).toBe('0');
    expect(getByText(children.props.children)).toBeInTheDocument();
    expect(getByText(children.props.children).nextSibling).toEqual(ref.current);
  });
});
