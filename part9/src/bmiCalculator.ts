// Exercise 9.1 - 9.3: BMI calculator and exercise calculator

interface BmiValues {
  height: number
  weight: number
}

const parseBmiArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments')
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return { height: Number(args[2]), weight: Number(args[3]) }
  }
  throw new Error('Provided values were not numbers!')
}

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2)
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal (healthy weight)'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

if (require.main === module) {
  try {
    const { height, weight } = parseBmiArguments(process.argv)
    console.log(calculateBmi(height, weight))
  } catch (e: unknown) {
    if (e instanceof Error) console.log('Error:', e.message)
  }
}
