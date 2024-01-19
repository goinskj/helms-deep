/* Require modules
--------------------------------------------------------------- */
require('dotenv').config()
const path = require('path');
const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override');



/* Require the db connection, models, and seed data
--------------------------------------------------------------- */
const db = require('./models');

/* Require the routes in the controllers folder
--------------------------------------------------------------- */
const teamsCtrl = require('./controllers/teams')

/* Create the Express app
--------------------------------------------------------------- */
const app = express();


/* Configure the app to refresh the browser when nodemon restarts
--------------------------------------------------------------- */
// Detect if running in a dev environment
if (process.env.ON_HEROKU === 'false') {
    // Configure the app to refresh the browser when nodemon restarts
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once("connection", () => {
        // wait for nodemon to fully restart before refreshing the page
        setTimeout(() => {
        liveReloadServer.refresh("/");
        }, 100);
    });
    app.use(connectLiveReload());
}


/* Configure the app (app.set)
--------------------------------------------------------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/* Middleware (app.use)
--------------------------------------------------------------- */
// Body parser: used for POST/PUT/PATCH routes: 
// this will take incoming strings from the body that are URL encoded and parse them 
// into an object that can be accessed in the request parameter as a property called body (req.body).
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
// Allows us to interpret POST requests from the browser as another request type: DELETE, PUT, etc.
app.use(methodOverride('_method'));


/* Mount routes
--------------------------------------------------------------- */
app.get('/', function (req, res) {
    db.Team.find({ isFeatured: true })
        .then(teams => {
            res.render('home', {
                teams: teams
            })
        })
})

app.get('/about', function (req, res) {
    res.send('You\'ve hit the about route')
})

// When a GET request is sent to `/seed`, the team collection is seeded
if (process.env.ON_HEROKU === 'false') {
    app.get(`/seed`, function( req, res) {
        // Remove any existing teams
        db.Team.deleteMany({})
            .then(removedTeams => {
                console.log(`Removed ${removedTeams.deletedCount} teams`)
                // Seed the teams collection with the seed data
                db.Team.insertMany(db.seedTeams)
                    .then(addedTeams => {
                        console.log(`Added ${addedTeams.length} teams to the database`)
                        res.json(addedTeams)
                    })
        })
    })
}

// This tells our app to look at the `controllers/teams.js` file 
// to handle all routes that begin with `localhost:3000/teams`
app.use('/teams', teamsCtrl)

// The "catch-all" route: Runs for any other URL that doesn't match the above routes
app.get('*', function (req, res) {
    res.send('404 Error: Page Not Found')
})

/* Tell the app to listen on the specified port
--------------------------------------------------------------- */
app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});
