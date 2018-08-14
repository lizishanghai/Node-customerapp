var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;
var app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

// Express Validator Middleware
// const { check, validationResult } = require('express-validator/check');
var check = require('express-validator/check').check;
var validationResult = require('express-validator/check').validationResult;


/*
var people = [
    {
        name: 'Jeff',
        age: 30
    },
    {
        name: 'Sara',
        age: 22
    },
    {
        name: 'Bill',
        age: 45
    }
]
app.get('/',function(req, res){
        res.json(people);
});
*/

app.get('/',function(req, res){
    db.users.find(function (err, docs) {
      // console.log(docs);
        res.render('index', {
            title: 'Customer',
            users: docs
        });
    });    
});



app.post('/users/add', [
    // username must be an email
    check('email').isEmail().withMessage('Must be an email'),
    // password must be at least 5 chars long
    check('first_name').isLength({ min: 5 }).withMessage('first_name minimal length 5')
  ],function(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
//        return res.status(422).json({ errors: errors.array() });
//        return res.json({errors: errors.mapped()});
        res.render('index', {
            title: 'Customer',
           // users: users,
            errors: errors.array()
        });
    }else{
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            emal:req.body.email
        }
        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
        })

       // console.log(newUser);

    }

});

app.delete('/users/delete/:id',function(req, res){
    //console.log(req.params.id);
    db.users.remove({_id:ObjectId(req.params.id)}, function(err){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(3000,function(){
    console.log('Server started on port 3000...');
})