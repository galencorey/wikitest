var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;

chai.use(spies);
//expect(2 + 2).to.be.equal(4);
describe('Testing suite capabilities', function () {
  it('confirms basic arithmetic', function () {
    expect(2+2).to.equal(4);
  });
});

describe('async stufff happens', function () {
it('confirms setTimeout\'s timer accuracy', function (done) {
  var start = new Date();
  setTimeout(function () {
    var duration = new Date() - start;
    expect(duration).to.be.closeTo(1000, 50);
    done();
  }, 1000);
});
});


describe('It can spy', function () {


  it('Spies on a function', function () {

    function timesTwo (ele) { return ele*2; }
    var timesTwo = chai.spy(timesTwo);

    var arr = [1, 2, 3, 4];
    arr.forEach(timesTwo);

    expect(timesTwo).to.have.been.called();

  });
});







