import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavScroll from './src/NavScroll'; // Adjust the import path according to your file structure

describe('NavScroll', () => {
  it('renders the room name', () => {
    render(<NavScroll />);
    
    // Example test to check if "No Name" is in the document
    expect(screen.getByText(/No Name/i)).toBeInTheDocument();
  });
});
