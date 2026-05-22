import { useState } from 'react';
import Navbar from '../components/Navbar';

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  column: 'todo' | 'inprogress' | 'done';
}

const KanbanPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete frontend design',
      assignee: 'Test User',
      priority: 'high',
      column: 'todo'
    },
    {
      id: '2',
      title: 'Review backend APIs',
      assignee: 'Test User',
      priority: 'medium',
      column: 'inprogress'
    },
    {
      id: '3',
      title: 'Write documentation',
      assignee: 'Test User',
      priority: 'low',
      column: 'done'
    }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assignee: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const columns = [
    { id: 'todo', title: '📋 To Do', color: 'bg-gray-100' },
    { id: 'inprogress', title: '⚡ In Progress', color: 'bg-blue-50' },
    { id: 'done', title: '✅ Done', color: 'bg-green-50' }
  ];

  const getTasksByColumn = (column: string) => {
    return tasks.filter((t) => t.column === column);
  };

  const moveTask = (taskId: string, newColumn: 'todo' | 'inprogress' | 'done') => {
    setTasks(tasks.map((t) =>
      t.id === taskId ? { ...t, column: newColumn } : t
    ));
  };

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      assignee: newTask.assignee || 'Unassigned',
      priority: newTask.priority,
      column: 'todo'
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', assignee: '', priority: 'medium' });
    setShowAdd(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-600';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-600';
    return 'bg-green-100 text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📋 Task Board
          </h2>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Task
          </button>
        </div>

        {/* Add Task Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Add New Task</h3>
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Assignee name"
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({
                  ...newTask,
                  priority: e.target.value as 'low' | 'medium' | 'high'
                })}
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={addTask}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className={`${column.color} rounded-lg p-4`}>
              <h3 className="font-bold mb-4 flex items-center justify-between">
                {column.title}
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {getTasksByColumn(column.id).length}
                </span>
              </h3>

              <div className="space-y-3">
                {getTasksByColumn(column.id).map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-3 shadow-sm"
                  >
                    <p className="font-medium text-gray-800 mb-2">{task.title}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        👤 {task.assignee}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Move buttons */}
                    <div className="flex gap-1 mt-2">
                      {column.id !== 'todo' && (
                        <button
                          onClick={() => moveTask(task.id, 'todo')}
                          className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                        >
                          ← Todo
                        </button>
                      )}
                      {column.id !== 'inprogress' && (
                        <button
                          onClick={() => moveTask(task.id, 'inprogress')}
                          className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          ⚡ Progress
                        </button>
                      )}
                      {column.id !== 'done' && (
                        <button
                          onClick={() => moveTask(task.id, 'done')}
                          className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200"
                        >
                          ✅ Done
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 ml-auto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

                {getTasksByColumn(column.id).length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No tasks here
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanPage;