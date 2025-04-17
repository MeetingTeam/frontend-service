import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MessageType from '../Message/MessageType.js';
import { messageTypes } from '../../Utils/Constraints.js';

describe('MessageType Component', () => {
          const unsendMessage={
                    type: messageTypes.UNSEND,
                    createdAt: new Date(),
          }
          it("renders the correct message", () => {
            render(<MessageType message={unsendMessage} />);
            const content = screen.getByText("Message has been deleted");
            expect(content).toBeInTheDocument();
          });
});