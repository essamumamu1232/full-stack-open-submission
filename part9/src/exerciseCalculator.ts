// Exercise 9.3: Exercise calculator
interface ExerciseResult {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export const calculateExercises = (hours: number[], target: number): ExerciseResult => {
  const periodLength = hours.length
  const trainingDays = hours.filter(h => h > 0).length
  const average = hours.reduce((sum, h) => sum + h, 0) / periodLength
  const success = average >= target
  const rating = average < target * 0.75 ? 1 : average < target ? 2 : 3
  const ratingDescription =
    rating === 1 ? 'bad, you need to train more' :
    rating === 2 ? 'not too bad but could be better' :
    'excellent work, target met!'

  return { periodLength, trainingDays, success, rating, ratingDescription, target, average }
}

const parseExerciseArguments = (args: string[]): { daily: number[]; target: number } => {
  if (args.length < 4) throw new Error('Not enough arguments')
  const target = Number(args[2])
  const daily = args.slice(3).map(Number)
  if ([target, ...daily].some(isNaN)) throw new Error('All values must be numbers')
  return { target, daily }
}

try {
  const { daily, target } = parseExerciseArguments(process.argv)
  console.log(calculateExercises(daily, target))
} catch (e: unknown) {
  if (e instanceof Error) console.log('Error:', e.message)
}
