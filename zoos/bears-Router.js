const knex = require('knex'); 
const router = require('express').Router();
const knexConfig = { 
  client: 'sqlite3',
  connection: {
    filename:'./data/bears.sqlite3' 
  },
  useNullAsDefault: true,
  debug: true 
}
const db = knex(knexConfig); 

// this is /api/bears
// this is SELECT * FROM bears
router.get('/', (req, res) => {
  db('bears') 
  .then(bears => {
    res.status(200).json(bears);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  })
});


// SELECT * FROM bears WHERE ID = :ID
router.get('/:id', (req, res) => {
  db('bears')
  .where({ id: req.params.id })
  .first() // this goes into the array and grabs the first match instead of writing json(bear[0])
  .then(bear => {
    if (bear) {
      res.status(200).json(bear) // you could have this by itself but if you GET an ID That isnt there it wont give an error code that the client can react to, just an empty array
    } else {
      res.status(404).json('bear not found Greg')
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

// INSERT INTO bears (Column Headers/ aka bears) VALUES (Column Values/ aka req.body)
router.post('/', (req, res) => {
  // res.send('Write code to add a bear');
  if(!req.body.name) { // this is a verification of entering a required field, you could just leave the contents of the else statement below but you wouldnt verify
    res.status(400).json({message: 'Please provide a name'})
  } else{
  db('bears')
  .insert(req.body, 'id') // or ['id','name']
  .then(ids => {
    
   return db('bears')
    .where({ id: ids[0] })
    .first() 
    .then(bear => {
      res.status(201).json(bear) 
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
  // update bears FIRST Filter then update
  if(!req.body.name) { // this is a verification of entering a required field, you could just leave the contents of the else statement below but you wouldnt verify
    res.status(400).json({message: 'Please provide a name'})
  } else{
    db('bears')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json({message: `${count} ${count > 1 ? 'records' : 'record'} updated`})
      } else {
        res.status(404).json({message: 'bear does not exist'})
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }
});


// DELETE FROM bears WHERE ID = :ID
router.delete('/:id', (req, res) => {
  // remove bears (inactivate the bear)
  db('bears')
  .where({ id: req.params.id })
  .del(req.body)
  .then(count => {
    if (count > 0) {
      res.status(200).json({message: `${count} ${count > 1 ? 'records' : 'record'} destroyed`})
    } else {
      res.status(404).json({message: 'bear does not exist'})
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

module.exports = router;
