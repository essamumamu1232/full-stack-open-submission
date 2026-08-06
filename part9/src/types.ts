// ─── Part 9 Exercises 9.8-9.13: Flight Diary types ───────────────────────────

export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy'
export type Visibility = 'great' | 'good' | 'ok' | 'poor'

export interface DiaryEntry {
  id: number
  date: string
  weather: Weather
  visibility: Visibility
  comment: string
}

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>

// ─── Part 9 Exercises 9.19-9.27: Patientor types ─────────────────────────────

export interface Diagnosis {
  code: string
  name: string
  latin?: string
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export interface BaseEntry {
  id: string
  description: string
  date: string
  specialist: string
  diagnosisCodes?: Array<Diagnosis['code']>
}

interface SickLeave {
  startDate: string
  endDate: string
}

interface Discharge {
  date: string
  criteria: string
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare'
  employerName: string
  sickLeave?: SickLeave
}

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital'
  discharge: Discharge
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck'
  healthCheckRating: HealthCheckRating
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry

export interface Patient {
  id: string
  name: string
  ssn: string
  occupation: string
  gender: Gender
  dateOfBirth: string
  entries: Entry[]
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>
