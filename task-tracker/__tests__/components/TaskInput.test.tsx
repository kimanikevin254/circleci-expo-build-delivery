import TaskInput from '@/components/TaskInput';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

describe('TaskInput', () => {
  it('renders input field and add button', () => {
    const { getByPlaceholderText, getByRole } = render(
      <TaskInput onAddTask={jest.fn()} />
    );

    expect(getByPlaceholderText('Add a new task...')).toBeTruthy();
    expect(getByRole('button')).toBeTruthy();
  });

  it('calls onAddTask with trimmed title when submitted', () => {
    const mockAdd = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
      <TaskInput onAddTask={mockAdd} />
    );

    const input = getByPlaceholderText('Add a new task...');
    fireEvent.changeText(input, '  Buy milk  ');
    fireEvent.press(getByRole('button'));

    expect(mockAdd).toHaveBeenCalledWith('Buy milk');
  });

  it('clears input after adding a task', async () => {
    const { getByPlaceholderText, getByRole } = render(
      <TaskInput onAddTask={jest.fn()} />
    );

    const input = getByPlaceholderText('Add a new task...');
    fireEvent.changeText(input, 'Do laundry');
    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('shows alert if submitted with empty string', () => {
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    const { getByRole } = render(<TaskInput onAddTask={jest.fn()} />);

    fireEvent.press(getByRole('button'));

    expect(alertSpy).toHaveBeenCalledWith('Empty Task', 'Please enter a task title');
    alertSpy.mockRestore();
  });
});
