import 'dotenv/config'
import { createApp } from './app.js'

const port = process.env.PORT || 4000
const app = await createApp()

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
