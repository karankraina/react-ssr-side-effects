import React from 'react';
import { ssrSideEffectContext } from './Provider.jsx';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export default function withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
  mapStateOnServer
) {
  if (typeof reducePropsToState !== 'function') {
    throw new Error('Expected reducePropsToState to be a function.');
  }
  if (typeof handleStateChangeOnClient !== 'function') {
    throw new Error('Expected handleStateChangeOnClient to be a function.');
  }
  if (typeof mapStateOnServer !== 'undefined' && typeof mapStateOnServer !== 'function') {
    throw new Error('Expected mapStateOnServer to either be undefined or a function.');
  }

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  return function wrap(WrappedComponent) {
    if (typeof WrappedComponent !== 'function') {
      throw new Error('Expected WrappedComponent to be a React component.');
    }

    let mountedInstances = [];

    function SideEffect(props) {
      const firstRender = React.useRef(true);
      const instanceRef = React.useRef({ props });
      const context = React.useContext(ssrSideEffectContext);

      function emitChange() {
        context.state = reducePropsToState(mountedInstances.map(function (instance) {
          return instance.props;
        }));

        if (MemoizedSideEffect.canUseDOM) {
          handleStateChangeOnClient(context.state);
        } else if (mapStateOnServer) {
          context.state = mapStateOnServer(context.state);
        }
      }
      mountedInstances.push(instanceRef.current);
      emitChange();
      React.useEffect(() => {
        if (firstRender.current) {
          firstRender.current = false;
        } else {
          instanceRef.current.props = props
          emitChange();
        }

        return () => {
          const index = mountedInstances.indexOf(instanceRef.current);
          mountedInstances.splice(index, 1);
          emitChange();
        }
      }, props)

      return <WrappedComponent {...props} />;
    }

    const MemoizedSideEffect = React.memo(SideEffect);

    Object.defineProperty(MemoizedSideEffect, "name", { value: `SideEffect(${getDisplayName(WrappedComponent)})` });
    MemoizedSideEffect.canUseDOM = canUseDOM;
    return MemoizedSideEffect;
  }
}