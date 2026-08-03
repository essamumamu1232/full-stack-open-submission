import { DiaryEntry, NonSensitiveDiaryEntry, NewDiaryEntry, Weather, Visibility } from '../types'

let diaries: DiaryEntry[] = [
  { id: 1, date: '2017-01-01', weather: 'rainy', visibility: 'poor', comment: 'Pretty scary flying!' },
  { id: 2, date: '2017-04-01', weather: 'sunny', visibility: 'good', comment: 'Feeling great!' },
  { id: 3, date: '2017-04-15', weather: 'windy', visibility: 'good', comment: 'Good day for flying' },
]

export const getEntries = (): DiaryEntry[] => diaries

export const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] =>
  diaries.map(({ id, date, weather, visibility }) => ({ id, date, weather, visibility }))

export const findById = (id: number): DiaryEntry | undefined =>
  diaries.find(d => d.id === id)

export const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newDiary = { id: Math.max(...diaries.map(d => d.id)) + 1, ...entry }
  diaries = diaries.concat(newDiary)
  return newDiary
}

const isWeather = (param: string): param is Weather =>
  ['sunny', 'rainy', 'cloudy', 'windy', 'stormy'].includes(param)

const isVisibility = (param: string): param is Visibility =>
  ['great', 'good', 'ok', 'poor'].includes(param)

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data')
  const obj = object as Record<string, unknown>
  if (!('comment' in obj) || !('date' in obj) || !('weather' in obj) || !('visibility' in obj))
    throw new Error('Some fields are missing')
  if (!isWeather(String(obj.weather))) throw new Error('Incorrect weather: ' + obj.weather)
  if (!isVisibility(String(obj.visibility))) throw new Error('Incorrect visibility: ' + obj.visibility)
  return {
    comment: String(obj.comment),
    date: String(obj.date),
    weather: obj.weather as Weather,
    visibility: obj.visibility as Visibility,
  }
}
