const express = require("express");
const router = express.Router();
const Todos = require("../../models/todo.model");

/**
 * Get all TODOS:
 * curl http://localhost:8082/v1/todos
 *
 * Get todos with their "startDate" b/w startDateMin and startDateMax
 * curl http://localhost:8082/v1/todos?startDateMin=2020-11-04&startDateMax=2020-12-30
 *
 */
router.get("/", async (req, res) => {
  console.log(
    `URL:  /v1/todos${req.url == "/" ? "" : req.url}, Method:  ${
      req.method
    }, Timestamp: ${new Date()}`
  );

  Todos.find({}, (err, allTodos) => {
    if (err) {
      console.log(err);

      res.status(500).send();
    } else {
      res.send(allTodos);
    }
  });

  //   const allTodos = await Todos.find({});

  //   res.send(allTodos);
});

/**
 * Add a TODO to the list
 * curl -X POST http://localhost:8082/v1/todos \
    -d '{"name": "Learn Nodejs by doing","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
*/
router.post("/", async (req, res) => {
  console.log(req.body);

  // let newTodo = {
  //   name: req.body.name,
  //   startDate: req.body.startDate,
  //   endDate: req.body.endDate,
  // };

  await Todos.create(req.body, (err, newlyCreated) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      console.log("New todo item: ", newlyCreated);
      res.status(201).send(newlyCreated);
    }
  });
});

/**
 * Update an existing TODO
 * curl -v -X PUT http://localhost:8082/v1/todos \
    -d '{"_id": "<id-value>", "name": "Play tennis","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
 * 
 * Nb: You'll need to change the "id" value to that of one of your todo items
*/
router.put("/", (req, res) => {
  const idToUpdate = req.body._id;

  const updatedTodo = {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    pending: req.body.pending,
  };

  Todos.findByIdAndUpdate(idToUpdate, updatedTodo, (err, doc) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else if (doc == null) {
      res.status(400).send({ error: "Resource not found" });
    } else {
      res.status(204).send();
    }
  });
});

/**
 * Delete a TODO from the list
 * curl -v -X "DELETE" http://localhost:8082/v1/todos/<id-value>
 *
 * Nb: You'll need to change "<id-value>" to the "id" value of one of your todo items
 */
router.delete("/:id", (req, res) => {
  const IdToDelete = req.params.id;
  Todos.findByIdAndDelete(IdToDelete, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      res.status(204).send();
    }
  });
});

module.exports = router;
