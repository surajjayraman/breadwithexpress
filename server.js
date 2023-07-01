const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3005;

app.use(morgan('dev'));
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
  
// Browse GET breads
app.get('/breads', (req,res) => {
  //res.json(breads);
  const templateVars = {
    breads: breads
  };
  res.render('browse', templateVars);
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});