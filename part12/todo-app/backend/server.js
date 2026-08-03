const express = require('express')
const redis = require('redis')

const app = express()
app.use(express.json())

// Redis client (Exercise 12.9)
const redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
redisClient.connect().catch(console.error)

let todos = []

// Exercise 12.5: GET /todos
app.get('/todos', async (req, res) => {
  res.json(todos)
})

// Exercise 12.6: POST /todos
app.post('/todos', async (req, res) => {
  const todo = { id: todos.length + 1, text: req.body.text, done: false }
  todos.push(todo)
  // Exercise 12.9: increment counter in Redis
  await redisClient.incr('added_todos')
  res.status(201).json(todo)
})

// Exercise 12.7: PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id)
  const todo = todos.find(t => t.id === id)
  if (!todo) return res.status(404).json({ error: 'Todo not found' })
  todo.done = req.body.done
  res.json(todo)
})

// Exercise 12.8: DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id)
  todos = todos.filter(t => t.id !== id)
  res.status(204).end()
})

// Exercise 12.9: GET /statistics
app.get('/statistics', async (req, res) => {
  const added = await redisClient.get('added_todos')
  res.json({ added_todos: Number(added) || 0 })
})

app.get('/', (_req, res) => res.send('Todo API'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Todo API on port ${PORT}`))
