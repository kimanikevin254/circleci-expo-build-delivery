import TasksScreen from '@/app/index';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

describe('TasksScreen', () => {
  it('renders input and empty state initially', () => {
    const { getByPlaceholderText, getByText } = render(<TasksScreen />);
    
    expect(getByPlaceholderText('Add a new task...')).toBeTruthy();
    expect(getByText('No tasks yet')).toBeTruthy();
  });

  it('adds a task when text is submitted', async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(<TasksScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Add a new task...'), 'Write tests');
    fireEvent.press(getByRole('button')); // The Plus button

    await waitFor(() => {
      expect(getByText('Write tests')).toBeTruthy();
    });
  });
});
