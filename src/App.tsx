import './App.css'
import { useState, useEffect } from 'react'
import TaskCard from './components/TaskCard'
import { Status, statuses, Task } from './utils/data-tasks'

function App() {
  const [tasks,setTasks] = useState<Task[]>([]) 
  const columns = statuses.map(status => {
    const TaskInColumn = tasks.filter(task => task.status === status)
    return {
      status,
      tasks: TaskInColumn
    }
  })

  useEffect(() => {
    fetch('http://localhost:3000/tasks').then((res) => res.json()).then((data) => {
      setTasks(data)
    })
  }, [])

  const updateTask = (task: Task) => {
    fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const updatedTasks = tasks.map((t) => {
      return t.id === task.id ? task : t
    })
    setTasks(updatedTasks)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: Status) => {
    e.preventDefault()
    setCurrentlyHoveringOver(null)
    const id = e.dataTransfer.getData("id")
    const task = tasks.find((task) => task.id === id)
    if(task) {
      updateTask({...task, status})
    }
  }

  const [currentlyHoveringOver, setCurrentlyHoveringOver] = useState<Status | null>(null)
  const handleDragEnter = (status: Status) => {
    setCurrentlyHoveringOver(status)
  }

  return (
    <div className="flex divide-x">
      {columns.map((column) => (
        <div
          key={column.status}
          onDrop={(e) => handleDrop(e, column.status)}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => handleDragEnter(column.status)}
        >
          <div className="flex justify-between text-3xl p-2 font-bold text-gray-500">
            <h2 className="capitalize">{column.status}</h2>
            {column.tasks.reduce((total, task) => total + (task?.points || 0), 0)}
          </div>
          <div className={`h-full ${currentlyHoveringOver === column.status ? 'bg-gray-200' : ''}`}>
          {column.tasks.map((task) => (
            <TaskCard
              task={task}
              key={task.id}
              updateTask={updateTask}
            />
          ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
