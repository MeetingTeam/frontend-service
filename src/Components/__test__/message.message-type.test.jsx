import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import MessageType from '../Message/MessageType.jsx';
import { messageTypes } from '../../Configs/Constraints.js';

describe('MessageType Component', () => {
  const unsendMessage = {
    type: messageTypes.UNSEND,
    createdAt: new Date(),
  };

  test("renders the correct message", () => {
    render(<MessageType message={unsendMessage} />);
    const el = screen.getByText('Message has been deleted');
    expect(el).toBeTruthy();
  });
});