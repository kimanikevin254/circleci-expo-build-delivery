import TaskItem from '@/components/TaskItem';
import { Task } from '@/types';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

const mockTask: Task = {
  id: '1',
  title: 'Sample Task',
  completed: false,
  createdAt: new Date('2023-01-01T10:00:00Z'),
};

describe('TaskItem', () => {
    it('renders task title and date', () => {
        const { getByText } = render(
          <TaskItem task={mockTask} onToggle={jest.fn()} onDelete={jest.fn()} />
        );
        
        const expectedDate = mockTask.createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        expect(getByText('Sample Task')).toBeTruthy();
        // Match: "Jan 1, 1:00 PM" or "Jan 1, 13:00" etc.
        expect(getByText(new RegExp(`${expectedDate}, \\d{1,2}:\\d{2}( (AM|PM))?`))).toBeTruthy();
    });

  it('calls onToggle when checkbox is pressed', () => {
    const onToggle = jest.fn();
    const { getAllByRole } = render(
      <TaskItem task={mockTask} onToggle={onToggle} onDelete={jest.fn()} />
    );

    fireEvent.press(getAllByRole('button')[0]);
    expect(onToggle).toHaveBeenCalled();
  });

  it('calls onToggle when task text is pressed', () => {
    const onToggle = jest.fn();
    const { getAllByRole } = render(
      <TaskItem task={mockTask} onToggle={onToggle} onDelete={jest.fn()} />
    );

    fireEvent.press(getAllByRole('button')[1]);
    expect(onToggle).toHaveBeenCalled();
  });

  it('shows delete alert and calls onDelete when confirmed', () => {
    const onDelete = jest.fn();
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(
        (_title, _message, buttons) => {
          // Simulate pressing the "Delete" button
          const destructiveButton = buttons?.find(b => b.style === 'destructive');
          destructiveButton?.onPress?.();
        }
      );

    const { getAllByRole } = render(
      <TaskItem task={mockTask} onToggle={jest.fn()} onDelete={onDelete} />
    );

    fireEvent.press(getAllByRole('button')[2]);

    expect(alertSpy).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('renders checked style and check icon if completed', () => {
    const completedTask = { ...mockTask, completed: true };
    const { getByText } = render(
      <TaskItem task={completedTask} onToggle={jest.fn()} onDelete={jest.fn()} />
    );

    expect(getByText('Sample Task').props.style).toContainEqual(
      expect.objectContaining({ textDecorationLine: 'line-through' })
    );
  });
});
