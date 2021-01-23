#!/bin/env node
// This file is launch by the js bot index  file
const express = require('express')
const app = express()
const fse = require('fs-extra')
const port = process.env.PORT || 2525
const bodyParser =require('body-parser')
const path =require('path')
const fileUpload = require('express-fileupload');
const authMiddleware = require('./middlewares/auth')
app.use(require('cors')())
app.use(fileUpload({ createParentPath: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1', require('./routes/auth'))
app.use('/api/v1', authMiddleware, require('./routes/channels'))
app.use('/api/v1', authMiddleware, require('./routes/prison'))
app.use('/api/v1', authMiddleware, require('./routes/sounds'))
app.use('/api/v1', authMiddleware, require('./routes/users'))

// /** Serve static front directory */
app.use(express.static(path.resolve(__dirname,'..', 'public')))

// /** Redirect all 404 routes to index.html */
app.use((req, res) => {
  if (fse.existsSync(path.resolve(__dirname, '..', 'public', 'index.html'))) {
    res.redirect('/index.html')
  } else {
    res.status(404).send('Not found.')
  }
})

/** Launch server */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


