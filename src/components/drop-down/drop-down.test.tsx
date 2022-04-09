import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropDown } from './drop-down';
import { TEST_OPTIONS_SMALL } from './options.mock';
import { noop } from '../../helpers/func';

const TEST_LABEL = 'TEST_LABEL';
const TEST_BUTTON_LABEL = 'TEST_BUTTON_LABEL';

describe('BubbleDivider', () => {
  it('should render correctly with default props', () => {
    render(
      <DropDown
        label={TEST_LABEL}
        options={TEST_OPTIONS_SMALL}
        onOptionSelect={noop}
        buttonLabel={TEST_BUTTON_LABEL}
      />
    );
    expect(screen.queryByText(TEST_LABEL)).toBeInTheDocument();
  });

  //     }
  //       expect(screen.queryByText(value?.toString())).not.toBeInTheDocument()
  //     );
  //     expect(screen.queryByText(TEST_)).not.toBeInTheDocument();
  //   });

  //   it('should show children when variantType is drop-down and is clicked', () => {
  //     render(<BubbleDivider label={TEST_LABEL} variantType="drop-down" children={TEST_CHILDREN} />);
  //     clickDropDown();
  //     expect(screen.queryByText(TEST_CHILDREN)).toBeInTheDocument();
  //   });

  //   it('should not show children when variantType is divider and is clicked', () => {
  //     render(<BubbleDivider label={TEST_LABEL} variantType="divider" children={TEST_CHILDREN} />);
  //     clickDropDown();
  //     expect(screen.queryByText(TEST_CHILDREN)).not.toBeInTheDocument();
  //   });

  //   function clickDropDown() {
  //     userEvent.click(screen.getByText(TEST_LABEL));
  //   }

  //   function
});
