function Fact(x, y) {
  var _x = x;
  var _y = y;
  var _id;
  this.answer = _x * _y;

  this.guess = function(guess) {
    return guess === this.answer();
  }

  this.getId = function() {
    return _id;
  }

  this.setId = function(id) {
    _id = id;
  }

  this.question = _x + " x " + _y;
}