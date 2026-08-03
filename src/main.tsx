import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import 'normalize.css';
import App from './App.tsx';
import { LinkedInCallback } from './components/LinkedInCallback.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);
const isLinkedInCallback = window.location.pathname === '/auth/linkedin';

root.render(
  <StrictMode>
    {isLinkedInCallback ? <LinkedInCallback /> : <App />}
  </StrictMode>,
);
