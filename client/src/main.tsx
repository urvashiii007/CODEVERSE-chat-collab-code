//import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import AppProvider from "./context/AppProvider"
import "@/styles/global.css"

const container = document.getElementById("root")

if (container) {
    createRoot(container).render(
        //<React.StrictMode>
            <AppProvider>
                <App />
            </AppProvider>
       // </React.StrictMode>
    )
}
