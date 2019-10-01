var mongoose = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username: String,
   password: String
});

// adds many methods to the User Shema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
