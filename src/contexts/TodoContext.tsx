import React, { createContext, useState, useContext } from 'react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoContextType {
  todos: TodoItem[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Finish Smart Canteen application', completed: false },
    { id: 2, text: 'Present project to competition judges', completed: false },
    { id: 3, text: 'Implement eco-friendly options', completed: true },
    { id: 4, text: 'Test order queue system', completed: false },
    { id: 5, text: 'Create admin dashboard', completed: false },
  ]);

  const addTodo = (text: string) => {
    if (text.trim() !== '') {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text,
          completed: false
        }
      ]);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, removeTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext; 