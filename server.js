const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || 3005;

// middleware
app.use(morgan('dev'));
// populates req.body
app.use(express.urlencoded({ extended: false}));
// cookie encryption middleware
app.use(cookieSession({
  name: 'my-cookie-name',
  keys: ['secret'],
}));


app.set('view engine', 'ejs');

const breads = {
  abcd: {
    name: 'rye',
    yeast: 5,
    flour: 3,
    expiryDate: 'Aug 22, 2022'
  },
  efgh: {
    name: 'baguette',
    yeast: 2,
    flour: 6,
    expiryDate: 'Oct 22, 2022'
  },
  ijkl: {
    name: 'sour dough',
    yeast: 1,
    flour: 5,
    expiryDate: 'Sep 9, 2022'
  },
  mnop: {
    name: 'NaN bread',
    yeast: 2,
    flour: 4,
    expiryDate: 'Sep 21, 2022'
  },
}; // add, edit, delete
  
// users global object
const users = {
  abc: {
    id: "abc",
    username: "alice",
    password: "1234",
  },
  def: {
    id: "def",
    username: "bob",
    password: "5678",
  },
};
// login  endpoints
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/protected', (req, res) => {
  console.log(req.session.userId);
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).send('You must be logged in to see this page');
  }
  const user = users[userId];
  const templateVars = {
    user: user
  };
  res.render('protected', templateVars);
});

app.post('/login', (req, res) => {
  console.log(req.body);
  // pull data off the body
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).send('Please provide a username and password');
    return;
  }

  // look up the user based off their username
  let foundUser = null;
  for (const userId in users) {
    const user = users[userId];
    if (user['username'] === username) {
      console.log('User Found');
      foundUser = user;
    }
  }

  // check credentials
  if (!foundUser) {
    res.status(400).send('no user with that username found');
    return;
  }
  
  if (!bcrypt.compareSync(password, foundUser['password'])) {
    res.status(400).send('password do not match');
    return;
  }

  // set an encrypted cookie
  req.session.userId = foundUser['id'];

  // redirect user
  res.redirect('/protected');
});

// logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// registration endpoints
app.get('/register', (req,res) => {
  res.render('register');
});

app.post('/register', (req,res) => {

  const newId = Math.random().toString(36).substring(2, 5);
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).send('Please provide a username and password');
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  users[newId] = {
    id : newId,
    username: username,
    password: hash
  };
  res.redirect('/login');
});

// Browse GET breads
app.get('/breads', (req,res) => {
  const templateVars = {
    breads: breads
  };
  res.render('browse', templateVars);
});

// ADD - GET  /breads/new
app.get('/breads/new', (req, res) => {
  res.render('new-bread-form');
});

// Read - GET /breads/:breadId
app.get('/breads/:breadId', (req,res) => {
  const breadId = req.params.breadId;
  const bread = breads[breadId];
  const templateVars = {
    bread: bread
  };
  res.render('read', templateVars);
});

// Edit - GET /breads/:breadId/edit
app.get('/breads/:breadId/edit', (req, res) => {
  const breadId = req.params.breadId;
  const bread = breads[breadId];
  const templateVars = {
    bread: bread,
    breadId: breadId
  };
  res.render('edit-form', templateVars);

});

// Edit - POST /breads/:breadId
app.post('/breads/:breadId', (req,res) => {
  const breadId = req.params.breadId;
  const newBreadName = req.body.newBreadName;
  breads[breadId].name = newBreadName;
  console.log(breads);
  res.redirect(`/breads/${breadId}`);
    
});

// ADD - POST / /breads
app.post('/breads', (req, res) => {
  const name = req.body.name;
  const yeast = req.body.yeast;
  const flour = req.body.flour;
  const expiryDate = req.body.expiryDate;

  const newBread = {
    name: name,
    yeast: yeast,
    flour: flour,
    expiryDate: expiryDate
  };

  const newId = Math.random().toString(36).substring(2, 6);
  breads[newId] = newBread;

  console.log(breads);
  res.redirect('/breads');
});

// DELETE - POST /breads/:breadId/delete
app.post('/breads/:breadId/delete', (req, res) => {
  const breadId = req.params.breadId;
  delete breads[breadId];
  res.redirect('/breads');
});

// page not found
app.get('*', (req, res) => {
  res.render('error');
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});