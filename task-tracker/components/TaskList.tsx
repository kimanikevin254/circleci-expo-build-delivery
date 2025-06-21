import { Task } from '@/types';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No tasks yet</Text>
        <Text style={styles.emptySubtitle}>Add your first task to get started!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onToggle={() => onToggleTask(item.id)}
          onDelete={() => onDeleteTask(item.id)}
        />
      )}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
});