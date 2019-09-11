let mongoose = require('mongoose');
let morgan = require('morgan');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.engine("html", require('ejs').renderFile);
app.set("viewengine")//rendering
let tasks = require('./models/tasks');
let Developer = require('./models/developer');

app.use(express.static('images'));
app.use(express.static('css')); 
app.use(morgan('common'));
let viewsPath=__dirname+'/views/';//bring current path then attach views

let url='mongodb://localhost:27017/taskDB';

mongoose.connect(url, function (err) {
    if (err) {
        console.log("Could not connect");
        throw err;
    } else {
        console.log("Successfully connected");
    }
});

//Get home page
app.get('/',function(req,res){
    res.sendFile(__dirname + "/views/home.html");
});

//Insert new developer

app.post('/addnewdeveloper', function(req, res){
    let developer = new Developer({
        _id: new mongoose.Types.ObjectId,
    name: {
        firstName: req.body.firstname,
        lastName: req.body.lastname,
    },
    level: req.body.level,
    address:{
        state: req.body.State,
        suburb: req.body.Suburb,
        street: req.body.Street,
        unit: req.body.Unit
    }
    });
   developer.save(function(err){
       if(err){
           console.log(err.message);
           
       }
       res.redirect('/getdevelopers');
//       res.render(viewsPath + 'getdevelopers.html',)
   });

});
  
    

app.get('/addnewdeveloper', function (req,res){
    Developer.find().exec(function (err, data) {
        res.render(viewsPath +'addnewdeveloper.html', {developerDB: data});
    })
});

//app.get('/addnewdeveloper',function(req,res){
//    res.sendFile(__dirname + "/views/addnewdeveloper.html");
//});


app.post('/addnewtask', function(req, res){
    const newtask = new tasks({
    _id: new mongoose.Types.ObjectId,// is not nessary to have mongo db will create it itself
    name: req.body.name,
    assign_to: mongoose.Types.ObjectId(req.body.assign_to),// check again!!!
    duedate: req.body.duedate,
    taskStatus: req.body.taskStatus,
    taskDescription: req.body.taskDescription,
   });
   console.log(newtask);
   
   newtask.save(function(err){
       if(err){
           console.log(err.message);
           
       }
       res.redirect('/listalltasks');
   });
});

app.get('/addnewtask', function (req,res){
    tasks.find().exec(function (err, data) {
        res.render(viewsPath +'addnewtask.html', {taskDb: data});
    });
});
// List all developers details
app.get('/getdevelopers', function(req, res){
    Developer.find().exec(function(err, data){
        res.render(viewsPath+"getdevelopers.html", { developerDB: data });
    })
});

// list all items details
app.get('/listalltasks', function(req, res){
    tasks.find().exec(function(err, data){
        res.render(viewsPath+"listalltasks.html", { taskDb: data });
    })
});
app.get('/deletebyid', function (req,res){
    tasks.find({}, function (err, data) {
        res.render(viewsPath+"deletebyid.html", {taskDb: data});
    });
});
//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/deletebyid', function (req,res){
    let id = new mongoose.Types.ObjectId(req.body.taskId);
    tasks.deleteOne({ '_id': id }, function (err, doc) {
        if (err) throw err;
        console.log(doc);
    })
    res.redirect('/listalltasks');
});


// Remove Complete Tasks Page
app.get("/deletecompletedtasks", function (req, res) {
    tasks.find({'taskStatus':'Complete'}).exec(function(err,data) {
        if (err) throw err;
        res.render(viewsPath+'deletecompletedtasks.html', {taskDb: data});
    });
});

//Remove Complete
app.post('/deletecompletedtasks', function(req, res){
    tasks.deleteMany({'taskStatus':'Complete'}, function (err) {
        if (err) throw err;
    });
    res.redirect('/listalltasks');
});

app.get('/update', function (req,res){
    tasks.find().exec(function(err,data) {
        res.render(viewsPath+'update.html', {taskDb: data});
    });
});
//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/update', function (req,res){
    let id = new mongoose.Types.ObjectId(req.body.taskId);
    tasks.updateOne({ '_id': id }, { $set: { 'taskStatus': req.body.newTaskStatus } }, function (err, doc) {
        console.log(doc);
    })
    res.redirect('/listalltasks');
});

app.get('/sortcomplete', function(req, res){
    tasks.where({ 'taskStatus': 'Complete' }).sort({name: -1}).limit(3).exec(function (err, data) {
        if (err){ throw err};
        res.send(data);
    });

});

app.listen(8080);