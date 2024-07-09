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

  return (
    <div className='flex divide-x'>
      {columns.map(column => (
        <div>
          <h1>{column.title}</h1>
          {column.tasks.map(task => <TaskCard task={task} updateTask={updateTask} />)}
        </div>
      ))}
    </div>
  )
}

export default App
