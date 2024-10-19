import React from "react";

export const ssrSideEffectContext = React.createContext({});

const { Provider: SsrContextProvider } = ssrSideEffectContext;

export default function Provider(props) {
    const contextValue = props.context;

    if (!contextValue) {
        throw new Error("Context value must be a defined object! Received type" + typeof contextValue);
    }

    return (
        <SsrContextProvider value={contextValue}>
            {props.children}
        </SsrContextProvider>
    );

}