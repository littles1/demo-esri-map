import * as React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./components/App.css";

const rootEl: HTMLElement = document.getElementById("root");

render(<App />, rootEl);
