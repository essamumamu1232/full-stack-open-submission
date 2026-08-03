import express from 'express'
import diaryRouter from './routes/diaries'

const app = express()
app.use(express.json())

app.get('/api/ping', (_req, res) => {
  res.send('pong')
})

app.use('/api/diaries', diaryRouter)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
