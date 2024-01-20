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
    res.render('new-team')
})


// Show Route (GET/Read): Will display an individual pet document
// using the URL parameter (which is the document _id)
router.get('/:id', function (req, res) {
    db.Team.findById(req.params.id)
        .then(team => {
            res.render('team-details', {
                team: team
            })
        })
        .catch(() => res.send('404 Error: Page Not Found'))
})

// Show Route (GET/Read): Will display an individual pet document
// using the URL parameter (which is the document _id)
router.get('/:id/edit', function (req, res) {
    db.Team.findById(req.params.id)
        .then(team => {
            res.render('edit-team', {
                team: team
            })
        })
        .catch(() => res.send('404 Error: Page Not Found'))
})

// Index Route (GET/Read): Will display all teams
router.get('/', function (req, res) {
    db.Team.find({})
        .then(teams => {
            res.render('team-index', {
                teams: teams
            })
        })
        .catch(() => res.send('404 Error: Page Not Found'))
})

// Create Route (POST/Create): This route receives the POST request sent from the new route,
// creates a new team document using the form data, 
// and redirects the user to the new team's show page
router.post('/', (req, res) => {
    db.Team.create(req.body)
        .then(() => {
            res.redirect('/teams')
        })
        .catch(() => res.send('404 Error: Page Not Found'))
})

// Update Route (PUT/Update): This route receives the PUT request sent from the edit route, 
// edits the specified pet document using the form data,
// and redirects the user back to the show page for the updated location.
router.put('/:id', (req, res) => {
    db.Team.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
        .then(() => res.redirect(`/teams/${req.params.id}`))
        .catch(() => res.send('404 Error: Page Not Found'))
})

// router.put('/:id/edit', (req, res) => {
//     db.Team.updateOne(req.body)
//         .then(() => {
//             res.redirect('/teams')
//         })
//         .catch(() => res.send('404 Error: Page Not Found'))
// })

// Destroy Route (DELETE/Delete): This route deletes a pet document 
// using the URL parameter (which will always be the pet document's ID)
router.delete('/:id', (req, res) => {
    db.Team.findByIdAndDelete(req.params.id)
        .then(team => res.send('You\'ve deleted pet ' + team._id))
        .catch(() => res.send('404 Error: Page Not Found'))
})


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router
