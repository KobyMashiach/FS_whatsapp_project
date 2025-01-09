const initialState = {
    messages: {},
};


const factoryReducer = (state = initialState, action) => {
    switch (action.type) {


        // Messages
        case "ADD_MESSAGES":
            return { ...state, messages: { ...state.messages, ...action.payload } }

        case "RESET_STORE":
            return initialState;

        default:
            return state;

    }

}

export default factoryReducer