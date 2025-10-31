import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
// import { store, persistor } from './app/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorProvider, useError } from './context/ErrorContext';
import { setGlobalErrorHandler } from './services/indexService';
import { BrowserRouter } from 'react-router-dom';

import { LoaderProvider  } from './context/LoaderContext';

const ErrorHandlerConnector = () => {
  const { showError } = useError();

  React.useEffect(() => {
    setGlobalErrorHandler(showError);
  }, [showError]);

  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <ErrorProvider>
          <ErrorHandlerConnector />
        </ErrorProvider>
      </LoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
