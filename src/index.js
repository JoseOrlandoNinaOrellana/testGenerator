import express from 'express'
import cors from 'cors'
import { generateRouter } from './routes/generate.route.js'

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(cors())
app.use(generateRouter)

app.listen(PORT, () => {
  console.log(`Server running at localhost on port: ${PORT}`)
})
