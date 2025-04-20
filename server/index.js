require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Example route
app.get('/', (req, res) => res.send('Typing App Backend'))

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000')
})


