var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.users = [];
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(itemId) {
    var items = this.items;
    console.log(itemId);
    var success = false;
    items.every(function(itemObject, index) {
      console.log(itemObject, itemId);
      if (itemObject.id === parseInt(itemId)) {
        items.splice(index, 1);
        success = true;
        return false;
      }
      return true;
    });
    return success;
};

Storage.prototype.update = function(updateItem) {
    var items = this.items;
    console.log(updateItem);
    var success = false;
    items.every(function(itemObject, index) {
      console.log(itemObject, updateItem);
      if (itemObject.id === parseInt(updateItem.id)) {
        itemObject.name = updateItem.name;
        success = true;
        return false;
      }
      return true;
    });
    if (!success) {
      this.items.push(updateItem);
    }
    return success;
};

Storage.prototype.addUser = function(name) {
  var user = {name: name, items: [], id: this.id};
  storage.users.push(user);
  this.id += 1;
  return user;
};

Storage.prototype.deleteUser = function(userId) {
  console.log(userId);
  var users = this.users;
  var success = false;
  users.every(function(userObject, index) {
    console.log(userObject, userId);
    if (userObject.id === parseInt(userId)) {
      users.splice(index, 1);
      success = true;
      return false;
    }
    return true;
  });
  return success;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');
storage.addUser('Joe');
console.log(storage.deleteUser(3));

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
    if (storage.delete(req.params.id) === false) {
      return res.status(404).json({"error": "Did not find that id"});
    }

    res.sendStatus(204);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (storage.update(req.body) === false) {
      return res.status(201).json(req.body);
    }

    res.status(200).json(req.body);
});
console.log(" ");
console.log(storage);
console.log(" ");
console.log(" ");

app.listen(process.env.PORT || 8080);
