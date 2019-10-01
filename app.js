var   express                              = require("express"),
        mongoose                          = require("mongoose"),
        passport                             = require("passport"),
        bodyParser                        = require("body-parser"),
        LocalStrategy                    = require("passport-local"),
        User                                   = require("./models/user"),
        passportLocalMongoose   = require("passport-local-mongoose"),
        app                                     = express();

//  ===============
// CONFIG
//  ===============
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/authentication", {useNewUrlParser: true, useUnifiedTopology: true}) ;

// NOTE!
// express-session needs to be used BEFORE ANY OF THE PASSPORT STUFF
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
// need these two lines anytime we're using passport
app.use(passport.initialize());
app.use(passport.session());
// always needed when posting some form
app.use(bodyParser.urlencoded({extended: true}));

// using User as credentials
passport.use(new LocalStrategy(User.authenticate()));
// Responsible encoding data in session
passport.serializeUser(User.serializeUser());
// Responsible for reading session and decoding it
passport.deserializeUser(User.deserializeUser());

//  ===============
// HELPER FUNCTIONS
//  ===============
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//  ===============
// ROUTES
//  ===============
app.get("/", function(req, res){
   res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
   res.render("secret");
});

//  ===============
// AUTH ROUTES
//  ===============

// show signup form
app.get("/register", function(req, res){
    res.render("register");
});

//  ===============
// LOGIN ROUTES
//  ===============

app.get("/login", function(req, res){
   res.render("login");
});

// login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) , function(req,res) {
});

// handling user sign up
app.post("/register", function(req,res){
   // req.body.password gets hashed and stored in mongodb
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       }
       passport.authenticate("local")(req, res, function(){
           res.redirect("/secret");
       });
   });
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});




app.listen(5000, function(){
   console.log("Authentication Server Started!");
});
