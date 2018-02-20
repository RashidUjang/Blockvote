var vote = require('./controller.js');

module.exports = function(app){
  app.get('/check_votes', function(req, res) {
    vote.check_votes(req, res);
  });

  app.get('/cast_vote', function(req, res) {
    vote.cast_vote(req, res);
  });
}
