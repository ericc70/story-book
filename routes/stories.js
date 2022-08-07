const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

// const Story = require('../models/Story')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add')
})

// @desc    process add form
// @route   GET /stories/
router.post('/', ensureAuth, async (req, res) => {
  
  try {
    req.body.User = req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard')

  } catch (error) {
    console.log(error)
    res.render('error/500')
  }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('User')
      .sort({ createdAt: 'desc' })
      .lean()

      console.log(stories)
    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})



module.exports = router
