import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './ChatMessage';

test('renders learn react link', () => {
    render(<ChatMessage sender='abc' receiver='efg' timestamp='hi' content='jk' />);
    const linkElement = screen.getByText(/abc/i);
    // expect(linkElement).toBeInTheDocument();
});
