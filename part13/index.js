const express = require('express')
require('express-async-errors')
const { sequelize, runMigrations } = require('./util/db')
const Blog = require('./models/blog')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
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
  if (auth && auth.toLowerCase().startsWith('bearer ')) req.token = auth.substring(7)
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

// ─── Blog routes ─────────────────────────────────────────────────────────────

// Exercise 13.13: search and ordering
app.get('/api/blogs', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }
  const blogs = await Blog.findAll({
    where,
    include: { model: User, attributes: ['name', 'username'] },
    order: [['likes', 'DESC']],
  })
  res.json(blogs)
})

app.post('/api/blogs', userExtractor, async (req, res) => {
  if (!req.user || req.user.disabled) return res.status(401).json({ error: 'Not authorised' })
  const blog = await Blog.create({ ...req.body, userId: req.user.id })
  res.status(201).json(blog)
})

app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    include: { model: User, attributes: ['name', 'username'] },
  })
  if (!blog) return res.status(404).json({ error: 'Blog not found' })
  res.json(blog)
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

// ─── User routes ──────────────────────────────────────────────────────────────

// Exercise 13.16: users with blog count
app.get('/api/users', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: ['id', 'title', 'url', 'likes'],
    },
    attributes: {
      exclude: ['passwordHash'],
    },
  })
  res.json(users)
})

app.get('/api/users/:id', async (req, res) => {
  const where = {}
  if (req.query.read !== undefined) where.read = req.query.read === 'true'
  const user = await User.findByPk(req.params.id, {
    include: { model: Blog, as: 'readings', where, required: false },
    attributes: { exclude: ['passwordHash'] },
  })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

app.post('/api/users', async (req, res) => {
  const { username, name, password } = req.body
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, name, passwordHash })
  res.json(user)
})

// Exercise 13.21: logout (token invalidation)
app.delete('/api/logout', userExtractor, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authorised' })
  // In a full implementation, we'd add the token to a Session blocklist
  res.status(204).end()
})

// Exercise 13.22: disable user (admin)
app.put('/api/users/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  if (!user) return res.status(404).json({ error: 'User not found' })
  user.disabled = req.body.disabled
  await user.save()
  res.json(user)
})

// ─── Auth ─────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ where: { username } })
  if (user?.disabled) return res.status(401).json({ error: 'Account disabled' })
  const valid = user ? await bcrypt.compare(password, user.passwordHash) : false
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ username: user.username, id: user.id }, SECRET)
  res.json({ token, username: user.username, name: user.name })
})

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token' })
  if (err.name === 'SequelizeValidationError') return res.status(400).json({ error: err.errors.map(e => e.message) })
  res.status(500).json({ error: err.message })
})

const connectAndStart = async () => {
  await sequelize.authenticate()
  await runMigrations()
  console.log('Database connected and migrated')
  app.listen(3003, () => console.log('Server running on port 3003'))
}

connectAndStart()
