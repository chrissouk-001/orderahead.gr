import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon, Trash2, Plus } from 'lucide-react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem('project-todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('project-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-canteen-dark">Project Tasks</h3>
      
      <div className="flex gap-2 mb-4">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-grow"
        />
        <Button onClick={addTodo} className="bg-canteen-teal hover:bg-canteen-teal/90">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {todos.map(todo => (
          <div 
            key={todo.id} 
            className={`flex items-center p-3 rounded-md border ${
              todo.completed ? 'bg-gray-50 border-gray-200' : 'border-gray-200'
            }`}
          >
            <Checkbox 
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.text}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {todos.length === 0 && (
          <p className="text-gray-500 text-center py-2">No tasks yet. Add some tasks to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Todo; 