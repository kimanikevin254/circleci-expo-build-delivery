import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { Task } from "@/types";
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <TaskInput onAddTask={addTask} />
      <TaskList
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
      />
    </SafeAreaView>
  );
}
