import React  from "react"
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Prost from './components/Prost';
import Slozen from './components/Slozen';

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path='/prost-slucaj-koriscenja' element={<Prost/>}/>
          <Route path='/slozen-slucaj-koriscenja' element={<Slozen/>}/>
      </Routes>
    </Router>

  )
}


export default App;
