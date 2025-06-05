// main.jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'; // קובץ CSS גלובלי

import { Provider } from 'react-redux';
import { store } from './redux/store.js'; // ייבוא ה-store שיצרנו

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
// npm install -D tailwindcss@3 postcss autoprefixer
// npx tailwindcss init
// npm i react-router-dom
// npm install axios
// npm install react-chartjs-2 chart.js


// npm run dev