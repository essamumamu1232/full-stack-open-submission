import express from 'express'
import diaryRouter from './routes/diaries'
import { calculateBmi } from './bmiCalculator'
import { calculateExercises } from './exerciseCalculator'

export const app = express()
app.use(express.json())

// Exercise 9.4-9.7: HTTP endpoints for calculators
app.get('/api/ping', (_req, res) => {
  res.send('pong')
})

// Exercise 9.5: BMI endpoint
app.get('/api/bmi', (req, res) => {
  const height = Number(req.query.height)
  const weight = Number(req.query.weight)
  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' })
  }
  return res.json({ weight, height, bmi: calculateBmi(height, weight) })
})

// Exercise 9.6: Exercise endpoint
app.post('/api/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body as { daily_exercises: unknown; target: unknown }
  if (!daily_exercises || !target) {
    return res.status(400).json({ error: 'parameters missing' })
  }
  if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    return res.status(400).json({ error: 'malformatted parameters' })
  }
  const result = calculateExercises(daily_exercises as number[], Number(target))
  return res.json(result)
})

app.use('/api/diaries', diaryRouter)

if (require.main === module) {
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
