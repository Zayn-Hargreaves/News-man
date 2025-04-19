const storeReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'login_success':
            return {
                ...state,
                token: payload.token,
                account: payload.account,
                permissions: payload.permissions,
                privateKey: payload.privateKey,
                group: payload.group,
            };
        case 'logout':
            return {
                token: '',
                account: '',
                permissions: '',
                privateKey: '',
                group: '',
            };
        default:
            return state;
    }
};

export default storeReducer;
