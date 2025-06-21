import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

export default function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');

  const handleAddTask = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      onAddTask(trimmedTitle);
      setTitle('');
    } else {
      Alert.alert('Empty Task', 'Please enter a task title');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Add a new task..."
          placeholderTextColor="#9CA3AF"
          multiline={false}
          returnKeyType="done"
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddTask}
          activeOpacity={0.7}
          accessibilityRole='button'
          accessibilityLabel='Add task'
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});