
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import About from './pages/About';
import Navbar from './components/Navbar';
import useLocalStorage from './hooks/useLocalStorage';
import MyTickets from './pages/MyTickets';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [greeting, setGreeting, removeGreeting] = useLocalStorage<string>('greeting', '');

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar greeting={greeting} />
        <ToastContainer />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home greeting={greeting} setGreeting={setGreeting} removeGreeting={removeGreeting} />} />
            <Route path="/about" element={<About />} />
            <Route path="/my-tickets" element={<MyTickets />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;