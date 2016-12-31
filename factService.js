app.factory('factService', function() {

  var facts = [];

  var correct = [],
    incorrect = [];



  return {
    generate: function() {
      facts = [];

      var minFactor = 0;
      var maxFactor = 10;

      var range = _.range(minFactor, maxFactor + 1);
      var ctr = 1;
      for (var i = minFactor; i < range.length; i++) {
        for (var j = minFactor; j < range.length; j++) {
          var fact = new Fact(i, j);
          fact.setId(ctr++);
          facts.push(fact);
        }
      }

      facts = _.shuffle(facts);
      correct = [], incorrect = [];
    },
    getNext: function() {
      var fact = _.sample(facts);
      return fact;
    },
    addCorrect: function(fact) {
      correct.push(fact);
      facts = this.remove(fact);
    },
    addIncorrect: function(fact) {
      incorrect.push(fact);
      facts = this.remove(fact);
    },
    getCorrectCount: function() {
      return correct.length;
    },
    getIncorrectCount: function() {
      return incorrect.length;
    },
    remove: function(factToRemove) {
      return _.shuffle(_.reject(facts, function(fact) {
        return factToRemove.getId() === fact.getId();
      }));
    },
    getRemainingCount: function() {
      return facts.length;
    }
  };
});