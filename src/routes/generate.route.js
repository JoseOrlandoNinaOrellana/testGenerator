import express from 'express'
import { upload } from '../middlewares/upload.js'
import { generate } from '../controllers/generate.controller.js'

export const generateRouter = express.Router()

generateRouter.post('/generate', upload.single('code'), generate)
