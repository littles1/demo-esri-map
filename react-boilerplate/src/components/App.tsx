import * as React from "react";
import { hot } from "react-hot-loader";

// ---Sample Configuration--- //
//
// import Component from "@[org]/[package-name]"
//
// class App extends React.Component<{}, undefined> {
//     public rendor() {
//         <div className="app">
//             <Component [props] />
//         </div>
//     }
// }
//
// declare let module: object;
//
// export default hot(module)(App);

import WebMapView from "littles1-modules";

class App extends React.Component<{}, undefined> {
    public render() {
        return (
            <div className='app'>
                <WebMapView />
            </div>
        );
    }
}

declare let module: object;

export default hot(module)(App);
