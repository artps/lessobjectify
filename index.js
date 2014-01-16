"use strict";

var parse = require('css-parse'),
    less = require('less'),
    path = require('path'),
    toCamelCase = require('to-camel-case'),
    through = require('through');

var isCSS = /\.(csso|css|styl|sass|scss|less)$/;

function transformTree(tree) {
  var modExports = {};

  tree.stylesheet.rules.forEach(function(rule) {
    rule.selectors.forEach(function(selector) {
      var styles = (modExports[selector] = modExports[selector] || {});
      rule.declarations.forEach(function(declaration) {
        styles[toCamelCase(declaration.property)] = declaration.value;
      });
    });
  });

  return modExports;
}

module.exports = function(filename) {

  if (!isCSS.exec(filename)) return through();

  var buf = '';
  return through(
    function(chunk) { buf += chunk; },
    function() {
      var tree;

      less.render(buf, { filename: filename, paths: [path.dirname(filename)] }, function(err, css) {
        if (err) {
          this.emit('error', 'error parsing less' + filename + ': ' + err);
        } else {
          try {
            tree = transformTree(parse(css));
          } catch (e) {
            return this.emit('error', 'error parsing css ' + filename + ': ' + e);
          }

          this.queue('module.exports = ' + JSON.stringify(tree) + ';');
        }
        this.queue(null);
      }.bind(this));
    }
  );
}

