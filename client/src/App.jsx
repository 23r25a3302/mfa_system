import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./App.css";
import { SessionProvider } from "./context/sessionContext";

function App() {
  return (
    <div className="bg-slate-800 h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SessionProvider >
            <RouterProvider router={ router } />
          </SessionProvider>
        </div>
      </div>
    </div>
  )
};

export default App
