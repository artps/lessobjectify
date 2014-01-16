var browserify = require('browserify'),
    assert = require('assert'),
    vm = require('vm'),
    path = require('path'),
    lessobjectify = require('../index');

function fixture(name) {
  return path.join(__dirname, name);
}

function bundle(name, cb) {
  var filename = fixture(name);
  browserify()
    .require(filename, {expose: name})
    .transform(lessobjectify)
    .bundle(function(err, bundle) {
      if (err) return cb(err);
      var sandbox = {};
      try {
        vm.runInNewContext(bundle, sandbox);
      } catch (err) {
        return cb(err);
      }
      cb(null, sandbox);
    });
}

describe('lessobjectify', function() {
  var comment, hiddenComment;
  before(function() {
    comment = { display: 'block' };
    hiddenComment = { display: 'none' };
  });
  it('transforms stylesheets into JSON objects', function(done) {
    bundle('styles.less', function(err, bundle) {
      if (err) return done(err);
      var styles = bundle.require('styles.less');
      assert.deepEqual(styles['.b-comments__comment'], comment);
      assert.deepEqual(styles['.b-comments__comment--hidden'], hiddenComment);
      done();
    });
  });

  it('transforms stylesheets into JSON objects (as a dependency)', function(done) {
    bundle('app.js', function(err, bundle) {
      if (err) return done(err);
      var styles = bundle.require('app.js');
      assert.deepEqual(styles['.b-comments__comment'], comment);
      assert.deepEqual(styles['.b-comments__comment--hidden'], hiddenComment);
      done();
    });
  });
});
