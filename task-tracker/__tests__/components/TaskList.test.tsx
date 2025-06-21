import TaskList from '@/components/TaskList';
import { Task } from '@/types';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Write code',
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Test code',
    completed: true,
    createdAt: new Date(),
  },
];

describe('TaskList', () => {
  it('renders empty state when there are no tasks', () => {
    const { getByText } = render(
      <TaskList tasks={[]} onToggleTask={jest.fn()} onDeleteTask={jest.fn()} />
    );

    expect(getByText('No tasks yet')).toBeTruthy();
    expect(getByText('Add your first task to get started!')).toBeTruthy();
  });

  it('renders a list of tasks', () => {
    const { getByText } = render(
      <TaskList tasks={sampleTasks} onToggleTask={jest.fn()} onDeleteTask={jest.fn()} />
    );

    expect(getByText('Write code')).toBeTruthy();
    expect(getByText('Test code')).toBeTruthy();
  });

  it('calls onToggleTask and onDeleteTask with correct ids', () => {
    const onToggleTask = jest.fn();
    const onDeleteTask = jest.fn();

    const { getAllByRole } = render(
      <TaskList
        tasks={sampleTasks}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
      />
    );

    // First task, simulate toggle
    fireEvent.press(getAllByRole('button')[0]); // Checkbox
    expect(onToggleTask).toHaveBeenCalledWith('1');

    // Second task, simulate delete (mock Alert)
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(
        (_title, _message, buttons) => {
          // Simulate pressing the "Delete" button
          const destructiveButton = buttons?.find(b => b.style === 'destructive');
          destructiveButton?.onPress?.();
        }
      );

    fireEvent.press(getAllByRole('button')[5]); // Delete button for task 2
    expect(onDeleteTask).toHaveBeenCalledWith('2');

    alertSpy.mockRestore();
  });
});
