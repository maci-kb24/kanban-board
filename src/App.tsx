import './App.css'
import { useState } from 'react'
import TaskCard from './components/TaskCard'
import {  statuses, Task } from './utils/data-tasks'

function App() {
  const [tasks,setTasks] = useState<Task[]>([]) 
  const columns = statuses.map(status => {
    const TaskInColumn = tasks.filter(task => task.status === status)
    return {
      status,
      tasks: TaskInColumn
    }
  })

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
