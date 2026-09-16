import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/js/bootstrap.bundle.js"
import {BrowserRouter} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </BrowserRouter>
)
