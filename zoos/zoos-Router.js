const knex = require('knex'); //1 to install knex
const router = require('express').Router();
const knexConfig = { //4knex the object that tells knex what kind of db this is/ what adaptor am I going to use
  client: 'sqlite3',// use this adaptor to connect to db
  connection: {// pass a string or object
    filename:'./data/lambda.sqlite3' // from the root folder!!!  -  on this tool filename is all lowercase instead of camelcase
  },
  useNullAsDefault: true,
  debug: true // whoah! This will console log the SQL version of the calls below (like db zoos = select*from)
}
const db = knex(knexConfig); //3knex a function to call the object in this case is the sql database

// this is /api/zoos
// this is SELECT * FROM zoos
router.get('/', (req, res) => {
  db('zoos') // 2knex <<  - returns a promise with all the rows
  .then(zoos => {
    res.status(200).json(zoos);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  })
});


// SELECT * FROM zoos WHERE ID = :ID
router.get('/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .first() // this goes into the array and grabs the first match instead of writing json(zoo[0])
  .then(zoo => {
    if (zoo) {
      res.status(200).json(zoo) // you could have this by itself but if you GET an ID That isnt there it wont give an error code that the client can react to, just an empty array
    } else {
      res.status(404).json('zoo not found Greg')
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

// INSERT INTO zoos (Column Headers/ aka zoos) VALUES (Column Values/ aka req.body)
router.post('/', (req, res) => {
  // res.send('Write code to add a zoo');
  if(!req.body.name) { // this is a verification of entering a required field, you could just leave the contents of the else statement below but you wouldnt verify
    res.status(400).json({message: 'Please provide a name'})
  } else{
  db('zoos')
  .insert(req.body, 'id') // or ['id','name']
  .then(ids => {
    
   return db('zoos')
    .where({ id: ids[0] })
    .first() 
    .then(zoo => {
      res.status(201).json(zoo) 
    })
    .catch(err => {
      res.status(500).json(err)
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  })
}
});

// UPDATE 
router.put('/:id', (req, res) => {
  // update zoos FIRST Filter then update
  if(!req.body.name) { // this is a verification of entering a required field, you could just leave the contents of the else statement below but you wouldnt verify
    res.status(400).json({message: 'Please provide a name'})
  } else{
    db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({message: `${count} ${count > 1 ? 'records' : 'record'} updated`})
      } else {
        res.status(404).json({message: 'zoo does not exist'})
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }
});


// DELETE FROM zoos WHERE ID = :ID
router.delete('/:id', (req, res) => {
  // remove zoos (inactivate the zoo)
  db('zoos')
  .where({ id: req.params.id })
  .del(req.body)
  .then(count => {
    if (count > 0) {
      res.status(200).json({message: `${count} ${count > 1 ? 'records' : 'record'} destroyed`})
    } else {
      res.status(404).json({message: 'zoo does not exist'})
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

module.exports = router;
