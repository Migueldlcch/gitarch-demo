import { Buffer } from "buffer";
import process from "process";

// Polyfills globales
window.Buffer = Buffer;
window.process = process;

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Render principal
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontró el elemento raíz #root");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
