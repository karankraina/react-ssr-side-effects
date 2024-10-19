# React SSR Side Effects [![Downloads](https://img.shields.io/npm/dm/react-ssr-side-effects.svg)](https://npmjs.com/react-ssr-side-effects) [![npm version](https://img.shields.io/npm/v/react-ssr-side-effects.svg?style=flat)](https://www.npmjs.com/package/react-ssr-side-effects)

<p>
    <a href="https://twitter.com/karankraina" target="_blank">
        <img alt="Twitter: karankraina" src="https://img.shields.io/twitter/follow/karankraina.svg?style=social" />
    </a>
</p>

Thread safe fork of [react-side-effect](https://github.com/gaearon/react-side-effect). Can be used safely during Server Side Rendering.

## Key Features

- Thread-Safe SSR: Each request gets its own state instance during SSR, ensuring that side effects are isolated between different SSR requests.
- Client-Side Consistency: On the client side, behavior remains consistent with the original react-side-effect package.
- Provider-Based API: Easily integrate the library by wrapping your app in a provider.

## Installation

```
npm install --save react-ssr-side-effects
```


### As a script tag

#### Development

```html
<script src="https://unpkg.com/react/umd/react.development.js" type="text/javascript"></script>
<script src="https://unpkg.com/react-side-effect/lib/index.esm.js" type="text/javascript"></script>
```

#### Production

```html
<script src="https://unpkg.com/react/umd/react.production.min.js" type="text/javascript"></script>
<script src="https://unpkg.com/react-side-effect/lib/index.esm.min.js" type="text/javascript"></script>
```

## Use Cases

* Everything `react-side-effect` can do.
* Send customised response status and headers conditionally via React components during Server Side Rendering.
* Extract any information from react components during render to be used in the current request cycle.

## How It Works

The main difference between this package and the original `react-side-effect` is that it provides thread safety during Server Side Rendering. This means that each SSR request gets its own isolated state, preventing shared state pollution between concurrent requests.

Example

```jsx
import { withSideEffect } from 'react-ssr-side-effects';

export function ResponseComponent(props) {
	// Component that will receive props.
	return (null);
}

function reducePropsToState(props) {
	// Logic to reduce all instance props to state

	// Return only last instance's props
	return props.at(-1);
}

function handleStateChangeOnClient(state) {
	// Handle state changes on client.
}

export const Response = withSideEffect(
	reducePropsToState,
	handleStateChangeOnClient,
)(ResponseComponent);
```


```jsx

function Home() {
    return (
        <>
            <Response statusCode={200} />
            {
                // Home component code
            }
        </>
    )
}

function PageNotFound() {
    return (
        <>
            <Response statusCode={404} />
            {
                // 404 code
            }
        </>
    )
}
```

```jsx
import { SsrProvider } from 'react-ssr-side-effects';


const context = { };

const jsx = (
    <SsrProvider context={context}>
        {
            // Application code here
        }
    </SsrProvider>
);


const html = renderToString(jsx);

console.log(context.state.statusCode) // Component state collected in context
```

## API

#### `withSideEffect: (reducePropsToState, handleStateChangeOnClient, [mapStateOnServer]) -> ReactComponent -> ReactComponent`

A [higher-order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) that, when mounting, unmounting or receiving new props, calls `reducePropsToState` with `props` of **each mounted instance**. It is up to you to return some state aggregated from these props.

On the client, every time the returned component is (un)mounted or its props change, `reducePropsToState` will be called, and the recalculated state will be passed to `handleStateChangeOnClient` where you may use it to trigger a side effect.

On the server, `handleStateChangeOnClient` will not be called. You will be able to retrieve the current state in the `context` passed into the `SsrProvider` after a `renderToString()` call.


#### `SsrContextProvider(context) -> ReactComponent`

The provider that needs to be wrapped on your application code to collect state during instance rendering. On server, after `renderToString()` is called, `context.state` will hold the accumulated state.

## Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request describing the changes you've made.

## Reporting Issues
If you encounter any bugs, have questions, or have suggestions for improvements, please open an issue on the [GitHub repository](https://github.com/karankraina/react-ssr-side-effects/issues).


## Author

👤 **Karan Raina <karanraina1996@gmail.com>**

* Website: https://karanraina.tech/
* Twitter: [@karankraina](https://twitter.com/karankraina)
* Github: [@karankraina](https://github.com/karankraina)
* LinkedIn: [@karankraina](https://linkedin.com/in/karankraina)