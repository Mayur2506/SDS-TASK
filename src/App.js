import { Toaster } from "react-hot-toast";
import Login from "./Components/Login";
import {BrowserRouter,Routes,Route} from 'react-router-dom'


function App() {
  return (
    <div className="App">
        <div>
          <Toaster
            position="top-center"
          />
        </div>
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Login/>} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
