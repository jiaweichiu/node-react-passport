import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

///////////////// Our additions here
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
// For Toast.
import "./animate.min.css"
import "./toastr.min.css"
///////////////// End of of our additions

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
