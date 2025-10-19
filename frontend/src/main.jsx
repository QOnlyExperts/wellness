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
      {/* <Provider>
        <PersistGate loading={null} persistor={persistor}> */}
    <BrowserRouter>
          <ErrorProvider>
            <ErrorHandlerConnector />
          </ErrorProvider>
    </BrowserRouter>
        {/* </PersistGate>
      </Provider> */}
  </React.StrictMode>
);
