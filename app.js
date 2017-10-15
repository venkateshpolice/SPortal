var express = require('express') ;
var bodyParser = require('body-parser');
var path = require('path') ;
var app = express();
var cookieParser = require('cookie-parser') ;
var session = require("express-session") ;
var mongoose = require("mongoose") ;

mongoose.connect('mongodb://root:root@ds117625.mlab.com:17625/studentp');

app.use(bodyParser()) ;
app.use(cookieParser());
var sess;
app.set('view engine','ejs') ;
var jsonParser = bodyParser.json();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.engine('html', require('ejs').renderFile);
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(express.static(__dirname+'/views')) ;

var newsss;
app.get('/',function(req,res) {
  sess = req.session;
  var news =  News.find({}, function(err, user){
        if(err) {
            console.log(err);
        }
        else if(user){
          sess=req.session;
          newsss=user;
          //console.log(user) ;
          //res.render(__dirname+"/views/rem_student.ejs",{sess,user}) ;
          res.render(__dirname+"/views/index.ejs",{sess,user}) ;
        }




  
});
});


//Faculty Login
app.get('/fac_reg',function(req,res){
   sess = req.session ;
   res.render(__dirname+"/views/faculty.ejs",{sess}) ;
});
//Faculty login
app.get('/fac_login',function(req,res)
{
  sess = req.session ;
  res.render(__dirname+"/views/fac_login.ejs",{sess}) ;
});

//Marks

app.get('/fac_marks',function(req,res){
  sess = req.session ;
  res.render(__dirname+"/views/fac_marks.ejs",{sess}) ;
});

app.get('/fac_dash',function(req,res){
  sess = req.session ;
  res.render(__dirname+"/views/faculty_dash.ejs",{sess}) ;
}) ;
app.get('/admin',function(req,res)
{
  sess=req.session;
  res.render(__dirname+"/views/admin_dash.ejs",{sess});
}) ;
app.get('/admin_reg',function(req,res)
{
  sess=req.session;
  res.render(__dirname+"/views/admin_dash.ejs",{sess});
}) ;
app.get('/admin_login',function(req,res)
{
  sess=req.session;
  res.render(__dirname+"/views/admin_dash.ejs",{sess});
}) ;
/*app.get('/rem_faculty',function(req,res)
{
  sess=req.session;
  res.render(__dirname+"/views/rem_faculty.ejs",{sess});
}) ;
app.get('/rem_student',function(req,res)
{
  sess=req.session;
  res.render(__dirname+"/views/rem_student.ejs",{sess});
}) ;*/





//Schema for student registration
var studentSchema = mongoose.Schema({
    uname:String,
    fname :String,
    lname:String,
    email:String,
    sid:String,
    mobile:Number,
    pwd:String,
 });
var Student = mongoose.model("Student", studentSchema);

var marksSchema = mongoose.Schema({
    uname :String,
    subject : String,
    marks : Number,
    fac_name : String,

 });
var Marks = mongoose.model("Marks", marksSchema);

app.post('/stu_reg',function (req,res) {
		var clientInfo = req.body; //Get the parsed information
		if(!clientInfo.uname || !clientInfo.fname || !clientInfo.lname)
		{
			res.end('Fill all the fields');
		}
		else{
		        var newStudent = new Student({

                                  uname :clientInfo.uname,
                                  fname :clientInfo.fname,
                                  lname : clientInfo.lname,
                                  email : clientInfo.email,
                                  sid : clientInfo.sid,
                                  pwd : clientInfo.pwd,
                                  mobile : clientInfo.mobile,

			      });
            newStudent.save(function(err, Student){
			        if(err) res.end('Database Error');
			        else res.redirect('/');
            });
          }
});


//Schema for faculty registration

var facultySchema = mongoose.Schema({
    uname:String,
    email:String,
    mobile:Number,
    pwd:String,
 });
var newsSchema = mongoose.Schema({
    from:String,
    subject:String,
    message:String,
 });

var Faculty = mongoose.model("Faculty",facultySchema);
var News = mongoose.model("News",newsSchema);

//aDMIN sCHEMA
var adminSchema = mongoose.Schema({
    uname:String,
    pwd:String,
 });
var Admin = mongoose.model("Admin",adminSchema);

app.post('/fac_reg',function (req,res) {
		var clientInfo = req.body; //Get the parsed information
		if(!clientInfo.username || !clientInfo.email || !clientInfo.password)
		{
			res.end('Fill all the fields');
		}
		else{
		        var newFaculty = new Faculty({
                                  uname :clientInfo.username,
                                  email : clientInfo.email,
                                  mobile : clientInfo.mobile,
                                  pwd : clientInfo.password,
			      });
            newFaculty.save(function(err, Faculty){
			        if(err) res.end('Database Error');
			        else res.redirect('/fac_login');
            });
          }
});

app.post('/stu_login',function (req,res) {
  //retrieving the values from the database using findone method
var students =  Student.findOne({uname: req.body.username, pwd: req.body.password}, function(err, user){
        if(err) {
            console.log(err);
        }
        else if(user){
          sess=req.session;
          sess.uname=req.body.username;
          sess.pass=req.body.password;
          sess.authenticated = true;

          res.redirect('/');
        }
        else {
            console.log('Invalid1');
        }
    });
});

//Faculty Login
app.post('/fac_login',function (req,res) {
  //retrieving the values from the database using findone method
var students =  Faculty.findOne({uname: req.body.username, pwd: req.body.password}, function(err, user){
        if(err) {
            console.log(err);
        }
        else if(user){
          sess=req.session;
          sess.uname=req.body.username;
          sess.authenticated = true;
          //res.render(__dirname+"/views/faculty_dash.ejs",{sess}) ;
          console.log(sess) ;
          user=newsss;
         res.render(__dirname+"/views/faculty_dash.ejs",{sess}) ;
        }
        else {
            console.log('Invalid1');
        }
    });
});

//Admin login
app.post('/admin_login',function (req,res) {
  //retrieving the values from the database using findone method
var students =  Admin.findOne({uname: req.body.uname, pwd: req.body.passwd}, function(err, user){
        if(err) {
            console.log(err);
        }
        else if(user){
          sess=req.session;
          sess.uname=req.body.uname;
          sess.authenticated = true;
          //res.render(__dirname+"/views/faculty_dash.ejs",{sess}) ;
          console.log(sess) ;
          res.redirect('/admin_login') ;
        }
        else {
            console.log('Invalid1');
        }
    });
});

app.get('/rem_student',function (req,res) {
  //retrieving the values from the database using findone method
var students =  Student.find({}, function(err, user){
        if(err) {
            console.log(err);
        }
        else if(user){
          sess=req.session;
          console.log(user) ;
          res.render(__dirname+"/views/rem_student.ejs",{sess,user}) ;
        }
        else {
            console.log('Invalid1');
        }
    });
});

app.get('/rem_faculty',function (req,res) {
  //retrieving the values from the database using findone method
var students =  Faculty.find({}, function(err, user){
        if(err) {
            console.log(err);
        }
        else if(user){
          sess=req.session ;
          res.render(__dirname+"/views/rem_faculty.ejs",{sess,user}) ;
        }
        else {
            console.log('Invalid1');
        }
    });
});
app.get('/del_stu/:id',function(req,res)
      {
        mongoose.model("Student").remove({_id:req.params.id},function(err,delData)
        {
          res.redirect('/rem_student') ;
          });
      });
app.get('/edit_stu/:id',function(req,res)
      {
        sess = req.session ;
        var id = req.params.id ;
        Student.findOne({'_id':id},function(err,data)
           {
              if(err) throw err;
              res.render(__dirname+"/views/edit.ejs",{id,sess,data});
           });
      });
app.post('/updated/:id',function (req,res) {
    var clientInfo = req.body; //Get the parsed information
    var id = req.params.id ;
    if(!clientInfo.sid)
    {
      res.end('Fill all the fields');
    }
    else{

            var students =  Student.findOneAndUpdate({_id: id},{$set:{sid:clientInfo.sid,uname:clientInfo.sname}}, {new: true}, function(err, user){
            if(err) {
                console.log(err);
            }
            else if(user){
              console.log(user) ;
              /*user.sid = clientInfo.sid ;
              user.uname = clientInfo.sname ;
              console.log(user.uname) ;*/
              //res.render(__dirname+"/views/",{user,sess});
              //res.redirect('/profile.ejs',{user});
              res.redirect("/rem_student") ;
            }
            else {
                console.log('Invalid1');
            }
    });
            
          }
});

//For removing faculty

app.get('/del_fac/:id',function(req,res)
      {
        mongoose.model("Faculty").remove({_id:req.params.id},function(err,delData)
        {
          res.redirect('/rem_faculty') ;
          });
      });
app.get('/edit_fac/:id',function(req,res)
      {
        sess = req.session ;
        var id = req.params.id ;
        Faculty.findOne({'_id':id},function(err,data)
           {
              if(err) throw err;
              res.render(__dirname+"/views/edit_fac.ejs",{id,sess,data});
           });
      });
app.post('/updated_fac/:id',function (req,res) {
    var clientInfo = req.body; //Get the parsed information
    var id = req.params.id ;
    if(!clientInfo.email)
    {
      res.end('Fill all the fields');
    }
    else{

            var students =  Faculty.findOneAndUpdate({_id: id},{$set:{email:clientInfo.email,uname:clientInfo.uname}}, {new: true}, function(err, user){
            if(err) {
                console.log(err);
            }
            else if(user){
              console.log(user) ;
              /*user.sid = clientInfo.sid ;
              user.uname = clientInfo.sname ;
              console.log(user.uname) ;*/
              //res.render(__dirname+"/views/",{user,sess});
              //res.redirect('/profile.ejs',{user});
              res.redirect("/rem_faculty") ;
            }
            else {
                console.log('Invalid1');
            }
    });
            
          }
});

app.get('/news',function(req,res)
{
      sess=req.session;
      res.render('newsfeed',{sess});

});


app.post('/newsfeed',function (req,res) {

  sess = req.session ;
  var fr=req.body.from;
  var sub=req.body.sub;
  var mess=req.body.message;
  var news = new News({
                                  from:fr,
                                  subject:sub,
                                  message:mess
            });
             news.save(function(err, news){
              if(err) res.end('Database Error');
              else   res.redirect("/newsfeed") ;
            });

    
});













//ended
app.get('/profile',function(req,res){
            sess = req.session ;
            console.log(req.params.id);
            
            var students =  Student.findOne({uname: sess.uname}, function(err, user){
            if(err) {
                console.log(err);
            }
            else if(user){
              console.log(user) ;
              res.render(__dirname+"/views/profile.ejs",{user,sess});
              //res.redirect('/profile.ejs',{user});
            }
            else {
                console.log('Invalid1');
            }
    });
            
  
              
 });

app.get('/marks',function(req,res){
             
           sess = req.session ;
            var students =  Marks.find({uname:sess.uname}, function(err, user){
            if(err) {
                console.log(err);
            }
            else if(user){

              console.log(user) ;
              res.render(__dirname+"/views/marks.ejs",{sess,user}) ;
              //res.redirect('/profile.ejs',{user});
            }
            else {
                console.log('Invalid1');
            }
            
            
    });
            
  
              
 });

app.post('/fac_marks',function (req,res) {

  sess = req.session ;
    var clientInfo = req.body; //Get the parsed information
    if(!clientInfo.sname)
    {
      res.end('Fill all the fields');
    }
    
    else{
            var newMarks = new Marks({

                                  uname :clientInfo.sname,
                                  subject :clientInfo.subname,
                                  marks : clientInfo.marks,
                                  fac_name: sess.uname,

            });
            newMarks.save(function(err, Student){
              if(err) res.end('Database Error');
              else res.redirect('/');
            });
          }
});


//Admin Registraion

app.post('/Admin_reg',function (req,res) {
    var clientInfo = req.body; //Get the parsed information
    if(!clientInfo.passwd)
    {
      res.end('Fill all the fields');
    }
    else{
            var newAdmin = new Admin({
                                  uname :clientInfo.uname,
                                  pwd : clientInfo.passwd,
            });
            newAdmin.save(function(err, Faculty){
              if(err) res.end('Database Error');
              else res.redirect('/fac_login');
            });
          }
});

//Log out Code
app.get('/logout', function(req, res){
  sess = req.session;
  if (sess) {
    req.session.destroy(function(err){
      if(err) throw err ;

      res.redirect('/') ;
    });

  }else {
    res.redirect('/') ;
  }


});
//Log out code ends here


//For Invalid urls
app.get('*',function(req,res) {
  res.end("Invlid URL") ;
});


app.listen(8080) ;
