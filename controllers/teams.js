/* 
---------------------------------------------------------------------------------------
NOTE: Remember that all routes on this page are prefixed with `localhost:3000/teams`
---------------------------------------------------------------------------------------
*/

/* Require modules
--------------------------------------------------------------- */
const express = require('express')
const router = express.Router()


/* Require the db connection, and models
--------------------------------------------------------------- */
const db = require('../models')

/* Routes
--------------------------------------------------------------- */

// New Route (GET/Read): This route renders a form 
// which the user will fill out to POST (create) a new location
router.get('/new', (req, res) => {
    res.send('You\'ve hit the new route!')
})

// Index Route (GET/Read): Will display all teams
router.get('/', function (req, res) {
    db.Teams.find({})
        .then(teams => {
            res.render('team-index', {
                teams: teams
            })
        })
})

// Show Route (GET/Read): Will display an individual pet document
// using the URL parameter (which is the document _id)
router.get('/:id', function (req, res) {
    db.Teams.findById(req.params.id)
        .then(team => {
            res.render('team-details', {
                team: team
            })
        })
        .catch(() => res.send('404 Error: Page Not Found'))
})



/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router
