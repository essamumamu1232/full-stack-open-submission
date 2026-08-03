const express = require('express')
require('express-async-errors')
const { sequelize } = require('./util/db')
const Blog = require('./models/blog')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const SECRET = process.env.SECRET || 'secret'
const app = express()
app.use(express.json())

// Associations
User.hasMany(Blog, { foreignKey: 'userId' })
Blog.belongsTo(User, { foreignKey: 'userId' })

// Token middleware
const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  }
  next()
}
app.use(tokenExtractor)

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const decoded = jwt.verify(req.token, SECRET)
    req.user = await User.findByPk(decoded.id)
  }
  next()
}

// Routes
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll({ include: { model: User, attributes: ['name', 'username'] } })
  res.json(blogs)
})

app.post('/api/blogs', userExtractor, async (req, res) => {
  if (!req.user || req.user.disabled) return res.status(401).json({ error: 'Not authorised' })
  const blog = await Blog.create({ ...req.body, userId: req.user.id })
  res.status(201).json(blog)
})

app.put('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) return res.status(404).json({ error: 'Blog not found' })
  blog.likes = req.body.likes
  await blog.save()
  res.json(blog)
})

app.delete('/api/blogs/:id', userExtractor, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authorised' })
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) return res.status(404).json({ error: 'Blog not found' })
  if (blog.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
  await blog.destroy()
  res.status(204).end()
})

app.get('/api/users', async (req, res) => {
  const users = await User.findAll({ include: { model: Blog, attributes: ['id', 'title', 'url', 'likes'] } })
  res.json(users)
})

app.post('/api/users', async (req, res) => {
  const { username, name, password } = req.body
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, name, passwordHash })
  res.json(user)
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ where: { username } })
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ username: user.username, id: user.id }, SECRET)
  res.json({ token, username: user.username, name: user.name })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token' })
  res.status(500).json({ error: err.message })
})

const connectAndStart = async () => {
  await sequelize.authenticate()
  await sequelize.sync({ alter: true })
  console.log('Database connected and synced')
  app.listen(3003, () => console.log('Server running on port 3003'))
}

connectAndStart()
