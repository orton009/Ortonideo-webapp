const express = require('express') ,
    bodyParser = require('body-parser') ,
    session = require('express-session'),
    flash = require('connect-flash'),
    methodOverride = require('method-override')
    path  = require('path') ,
    exphbs  = require('express-handlebars') ,
    mongoose = require('mongoose'),
    passport = require('passport');

var ideas = require('./routes/ideas');
var users = require('./routes/users');
const db = require('./config/database');
var app = express() ;

//registering local strategy
require('./config/passport')(passport);

//body-parser middleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret : 'secret' ,
    resave : true ,
    saveUninitialized : true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash message middleware
app.use(flash());

//connect to  mongodb
mongoose.connect(db.mongoURI)
    .then( console.log("Mongo db is connected") )
    .catch( (err) => {
        console.log(err);
    } ) ;


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



//middleware
app.use(function(req , res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null ;
    next();
});

//static files
app.use(express.static(path.join(__dirname , 'public')));

//routes link
app.use('/ideas' , ideas);
app.use('/users' , users);

//home page and about page
app.get('/' , function(req,res){
    res.render("index" , {title : "Welcome"});
});

app.get('/about' , function(req,res){
    res.render("about");
});

var port = process.env.PORT || 3000 ;

//server listening
app.listen(port , function(req,res){
    console.log("Server is running on port " + port);
});