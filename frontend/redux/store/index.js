import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

// const middleware= [thunk]

// export const store = createStore(
//   rootReducer, 
//   compose (
//     applyMiddleware(...middleware),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// ));

import { composeWithDevTools } from 'redux-devtools-extension';

// const reducer = combineReducers({
//   rootReducer
// })

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(...middleware)
    )
);
