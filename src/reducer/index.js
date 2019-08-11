const initState = {
  appId: '',
  modalShow: false,
  isAuthenticated:false,
  isLoginIng:false
};

export default function (state = initState, action) {
  switch (action.type) {
    case 'SET_APPID':
      return {
        ...state,
        appId: action.data,
      };
    case 'SHOW_MODAL':
      return {
        ...state,
        modalShow: true,
      };
    default:
      return state;
  }
}
