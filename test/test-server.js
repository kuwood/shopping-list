var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on GET', function(done) {
      chai.request(app)
          .get('/items')
          .end(function(err,res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
            done();
          });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                console.log(res.body, " --------------------");
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                chai.request(app)
                    .get('/items')
                    .end(function(err,res) {
                      res.body.should.have.length(4);
                      done();
                    });
                /*storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                storage.items[3].id.should.equal(4);*/

            });
    });
    it('should edit an item on PUT', function(done) {
      chai.request(app)
          .put('/items/:id')
          .send({'name': 'corn', 'id': 3})
          .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            done();
          });
    });
    it('should delete an item on DELETE', function(done) {
        chai.request(app)
            .delete('/items/3')
            .send({'id': 3})
            .end(function(err, res) {
              should.equal(err, null);
              res.should.have.status(204);
              chai.request(app)
                  .get('/items')
                  .end(function(err,res) {
                    res.body.should.have.length(3);
                    done();
                  });
            });
    });
    it('should return a 404 if id fails to delete', function(done) {
      chai.request(app)
          .delete('/items/6')
          .send({'id': 6})
          .end(function(err, res) {
            res.should.have.status(404);
            res.should.be.json;
            done();
          });
    });
    it('should add a new item if the edit id does not exist', function(done) {
      chai.request(app)
          .put('/items/:id')
          .send({'name': 'potato', 'id': 5})
          .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(201);
            res.should.be.json;
            done();
          });
    });
    it('should return 400 if req.body empty', function(done) {
      chai.request(app)
          .post('/items')
          .send()
          .end(function(err, res) {
            res.should.have.status(400);
            done();
          });
    });
});
