var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');


// requiring routes
var campgroundRoutes = require('./routes/campgrounds');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

//mongodb://localhost:27017/yelp_camp
mongoose.connect('mongodb+srv://Sarthak:<password>@cluster0.nexjw.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
	useUnifiedTopology: true,
	useNewUrlParser: true
})
.then(() => console.log('Connected to DB'))
.catch(error => console.log(error.message));

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// Passport Configuration
app.use(require('express-session')({
	secret: "That's my secret Cap, I'm always angry.",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});


app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);



app.listen(process.env.PORT || 3000, () => {
	console.log('Server is running....');
});