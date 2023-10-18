import { SET_First_Time,SET_ORDERS,SET_USER_INFO } from '../actions/userActions';

const initialState = {
  user: {token: null},
  orders: [],
  firstTime: true
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_INFO: {
      return {
        ...state,
        user: action.payload
      };
    }
    case SET_First_Time: {
      return {
        ...state,
        firstTime: action.payload
      };
    }
    case SET_ORDERS: {
      return {
        ...state,
        orders: action.payload
      };
    }
    default:
      return state;
  }
}

export default userReducer;