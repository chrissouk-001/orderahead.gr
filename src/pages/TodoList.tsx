import React, { useState } from 'react';
import { Check, Trash2, Plus, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTodo } from '@/contexts/TodoContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TodoList: React.FC = () => {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodo();
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const pendingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Project Management</h1>
              <p className="text-gray-600">Track and manage Smart Canteen project tasks</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-2 bg-gray-100 p-2 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{totalCount}</div>
                      <p className="text-sm text-gray-500">tasks created</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-2 bg-yellow-100 p-2 rounded-full">
                      <Circle className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{pendingCount}</div>
                      <p className="text-sm text-gray-500">tasks remaining</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-2 bg-green-100 p-2 rounded-full">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{completedCount}</div>
                      <p className="text-sm text-gray-500">tasks finished</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-md mb-8">
              <CardHeader className="bg-canteen-teal/10 pb-2">
                <CardTitle>Add New Task</CardTitle>
                <CardDescription>What needs to be done for the Smart Canteen project?</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="Enter a new task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={handleAddTodo} 
                    className="rounded-l-none bg-canteen-teal hover:bg-canteen-teal/90"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                {pendingCount > 0 && (
                  <div className="flex items-center text-yellow-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {pendingCount} tasks need attention
                  </div>
                )}
              </div>
              
              <TabsContent value="all">
                <Card>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {todos.length === 0 ? (
                        <li className="p-4 text-center text-gray-500">No tasks yet. Add some tasks to get started!</li>
                      ) : (
                        todos.map(todo => (
                          <li 
                            key={todo.id} 
                            className="flex items-center justify-between p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant={todo.completed ? "default" : "outline"}
                                className={`h-6 w-6 p-0 rounded-full ${
                                  todo.completed ? 'bg-canteen-teal hover:bg-canteen-teal/90' : 'border-gray-300'
                                }`}
                                onClick={() => toggleTodo(todo.id)}
                              >
                                {todo.completed && <Check className="h-3 w-3" />}
                              </Button>
                              <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                {todo.text}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTodo(todo.id)}
                              className="text-gray-500 hover:text-red-500 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pending">
                <Card>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {todos.filter(todo => !todo.completed).length === 0 ? (
                        <li className="p-4 text-center text-gray-500">No pending tasks. Everything is complete!</li>
                      ) : (
                        todos.filter(todo => !todo.completed).map(todo => (
                          <li 
                            key={todo.id} 
                            className="flex items-center justify-between p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0 rounded-full border-gray-300"
                                onClick={() => toggleTodo(todo.id)}
                              />
                              <span>{todo.text}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTodo(todo.id)}
                              className="text-gray-500 hover:text-red-500 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="completed">
                <Card>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {todos.filter(todo => todo.completed).length === 0 ? (
                        <li className="p-4 text-center text-gray-500">No completed tasks yet. Start checking off tasks!</li>
                      ) : (
                        todos.filter(todo => todo.completed).map(todo => (
                          <li 
                            key={todo.id} 
                            className="flex items-center justify-between p-4 hover:bg-gray-50 bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="default"
                                className="h-6 w-6 p-0 rounded-full bg-canteen-teal hover:bg-canteen-teal/90"
                                onClick={() => toggleTodo(todo.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <span className="line-through text-gray-500">{todo.text}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTodo(todo.id)}
                              className="text-gray-500 hover:text-red-500 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TodoList; 