'use strict'

const { PrismaClient } = require('@prisma/client')
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

// Constants
const PORT = 3000
const HOST = '0.0.0.0'

const saltRounds = 10

// Instantiate objects
const prisma = new PrismaClient()
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.get('/user/:id', async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.findUnique({
    where: { id: Number(id) }
  })
  res.json(user)
})

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true }
  })
  res.json(posts)
})

app.get('/post/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.findUnique({
    where: { id: Number(id) }
  })
  res.json(post)
})

app.post('/user', async (req, res) => {
  const { email, password, name } = req.body

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(`[Error] post /user - Could not generate hash: ${err}`)
      res.statusCode(500)
    }

    const result = await prisma.user.create({
      data: {
        email,
        password: hash,
        name
      }
    })
    res.json(result)
  })
})

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } }
    }
  })
  res.json(result)
})

app.put('/post/publish/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true }
  })
  res.json(post)
})

app.delete('/post/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: { id: Number(id) }
  })
  res.json(post)
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
