import { Toaster } from "react-hot-toast";
import Login from "./Components/Login";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from "./Components/Home"
import EditorPage from "./Components/EditorPage"

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
              <Route path='/home' element={<Home/>}></Route>
              <Route path="/editor/:roomId" element={<EditorPage />}></Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
