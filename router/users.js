const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtr = require('jsonwebtoken-refresh');
const config = require('../config/database');
const User = require('../models/users');
require('../config/passport')(passport);


router.post('/register', (req, res, next) => {
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  User.getUserByUserame(newUser.username, (err, user) => {
    if(err) throw err;
    if(user){
      res.json({
        success: false, message: 'Ez a felhasználónév már foglalt!'
      });
    } else {
      User.addUser(newUser, (err, success) => {
        if(err) {
          res.json({ success: false, message: 'Nem sikerült regisztrálni a felhasználót!'});
        } else {
          res.json({ success: true, message: 'Sikeres volt a regisztráció! Kérlek jelentkezz be!'});
        }
      });
    }
  })

});
router.post('/addtodo', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log(req.body);
    User.getUserByID(req.user._id, (err, user) => {
      if(err) throw err;
      if(!user) return res.json({success: false,  message: 'Nincs ilyen user!'});
      let todo = {
        name : req.body.todo.todoName,
        desc: req.body.todo.todoDesc,
        due_date: req.body.todo.todoDue,
        priority: req.body.todo.todoPriority,
        category: req.body.todo.todoCategory,
        completed: false
      };

      user.todos.push(todo);
      user.save((err, updatedUser) => {
        if(err) throw err;
        res.json({user: updatedUser, success: true, message: 'Todo sikeresen létrehozva!'});
      })
    })
});

router.delete('/deletetodo', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  User.getUserByID(req.user._id, (err, user) => {
      if(err) throw err;
      if(!user) return res.json({success: false,  message: 'Nincs ilyen user!'});
        user.todos = user.todos.filter(element => {
          return element._id != req.body.todoId;
        })
        user.save((err, updatedUser) => {
          if(err) throw err;
          res.json({user: updatedUser, success: true, message: 'Todo sikeresen törölve!'});
        })
      })
  });

router.put('/edittodo', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log(req.body)
  User.getUserByID(req.user._id, (err, user) => {
      if(err) throw err;
      if(!user) return res.json({success: false,  message: 'Nincs ilyen user!'});

      for(let i = 0; i < user.todos.length; i++) {
        if(user.todos[i]._id == req.body.todo.todoId) {
            user.todos[i] = {
            _id : req.body.todo.todoId,
            created_date: user.todos[i].created_date,
            name: req.body.todo.todoName,
            desc: req.body.todo.todoDesc,
            completed: req.body.todo.todoCompl,
            priority: req.body.todo.todoPriority,
            category: req.body.todo.todoCategory,
            due_date: req.body.todo.todoDue
          }
          console.log(  user.todos[i])
          break;
        }
      }
      user.save((err, updatedUser) => {
        if(err) throw err;
        res.json({
          user: updatedUser,
          success: true,
          message: 'Todo sikeresen megváltoztatva!'
        });
      });
    });
});



router.post('/auth', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.getUserByUserame(username, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({success: false,  message: 'Nincs ilyen user!'});

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(!isMatch) {
        return res.json({success: false, message: 'Nem megfelelő jelszó!'});
      }
      let token = jwt.sign(user, config.secret, {
        expiresIn: 10800
      });
      res.json({
        success: true,
        token: `JWT ${token}`,
        message: 'Sikeresen bejelentkeztél!'
      });
    });
  });
});

router.get('/profil', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    user: {
      username: req.user.username,
      email: req.user.email,
      todos: req.user.todos,
      role: req.user.role
    }
  });
});
//refresh existing token
router.get('/rjwt', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let oldToken = req.headers.authorization.split(' ');
  let oldDecodedToken = jwt.decode(oldToken[1], {complete: true});
  let refreshedToken = jwtr.refresh(oldDecodedToken, 14200, config.secret);
  res.json({
    success: true,
    message: 'Jwt token frissítve!',
    token: `JWT ${refreshedToken}`
  });
});




module.exports = router;
