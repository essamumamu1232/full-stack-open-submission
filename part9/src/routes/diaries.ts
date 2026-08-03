import express from 'express'
import * as diaryService from '../services/diaryService'

const router = express.Router()

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries())
})

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id))
  diary ? res.send(diary) : res.sendStatus(404)
})

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = diaryService.toNewDiaryEntry(req.body)
    const addedEntry = diaryService.addDiary(newDiaryEntry)
    res.json(addedEntry)
  } catch (e: unknown) {
    let errorMessage = 'Something went wrong: '
    if (e instanceof Error) errorMessage += e.message
    res.status(400).send(errorMessage)
  }
})

export default router
