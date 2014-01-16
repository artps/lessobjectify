# lessobjectify

The fork of [cssobjectify][cssobjectify] by [Andrey Popp][andreypopp]. Source transform for [browserify][browserify] or [dcompose][dcompose] which
converts LESS into JSON objects which can be used further by libraries like
[React][React] to assign styles to UI components.

`styles.less`:

    .block {
      font-size: 12px;
      background-color: red;

      &__element {
        &--modifier {
          background-color: blue;
        }
      }
    }

`myapp.js`:

    var React = require('react-tools/build/modules/React');
    var Styles = require('./styles.less');

    var MyComponent = React.createClass({
      render: function() {
        return (
          <div style={Styles['.block__element--modifier']}>
            Hello, world!
          </div>
        )
      }
    });

## Usage

Use npm to install the package:

    % npm install lessobjectify

And use it with browserify:

    % browserify -t lessobjectify ./myapp.js

where `./myapp.js` or its dependencies can reference `*.css` files by
`require(...)` calls.

[browserify]: http://browserify.org
[dcompose]: https://github.com/andreypopp/dcompose
[andreypopp]: https://github.com/andreypopp
[cssobjectify]: https://github.com/andreypopp/cssobjectify
[React]: http://facebook.github.io/react/
