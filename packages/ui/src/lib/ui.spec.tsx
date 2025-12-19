import { render } from '@testing-library/react';

import NxMicrosUi from './ui';

describe('NxMicrosUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NxMicrosUi />);
    expect(baseElement).toBeTruthy();
  });
});
