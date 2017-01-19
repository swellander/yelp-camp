 var express       = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    Campground     = require("./models/campground"),
    seedDB         = require("./seeds"),
    Comment        = require("./models/comments")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("veiw engine", "ejs");
app.use(express.static(__dirname + "/public"));






// Campground.create(
//   {
//     name: "Yellow Asterbute",
//     image: "http://www.bellingham.org/wp-content/uploads/2013/08/Yellow-Aster-Butte-view-of-American-Border-Peak.jpg",
//     description: "Goregous, high altitude valley setting featuring sprawling alpine lakes and colorful moss pastures. 7 mile hike from trail head."
//   }, function(err, campground) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log("CAMPGROUND " + campground.name + " ADDED");
//       console.log(campground);
//     }
//   });


//ROUTES
app.get("/", function(req, res) {
  res.render("landing.ejs");
});


//INDEX ROUTE
app.get("/campgrounds", function(req, res) {
  // res.render("campgrounds.ejs", {campgrounds: campgrounds});
  Campground.find({}, function(err, allCampgrounds) {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds});
    }
  });
});

//CREATE ROUTE
app.post("/campgrounds", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var newCampground = {name: name, image: image, description: description}

  Campground.create(newCampground, function(err, newlyCreated) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds")
    }
  });
});

//NEW ROUTE
app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new.ejs");
});

//SHOW ROUTE
app.get("/campgrounds/:id", function(req, res) {
  //find the campground with provided id

  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show.ejs", {campground: foundCampground
      });
    }
  });
});

app.get("/test", function(req, res){
  var test = "IT WORKED"
  res.render("test.ejs", {test: test});
});

//===========================
//COMMENTS ROUTES
//===========================

app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new.ejs", {campground: campground});
    }
  })
});

app.post("/campgrounds/:id/comments", function(req, res){
  //look up campground using id
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  });
  //create new comment
  //connect new comment to campground
  //redirect to show page

});


app.listen(3002, function() {
  console.log("server launched on port 3002");
});