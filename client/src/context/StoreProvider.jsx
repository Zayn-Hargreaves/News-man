import React, { useReducer } from 'react'
import storeReducer from './storeReducer'
import storeContext from './storeContext'
const StoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(storeReducer, {
        account: JSON.parse(localStorage.getItem("AccountInfo")),
        permissions:JSON.parse(localStorage.getItem("Permissions")),
        group: JSON.parse(localStorage.getItem("Group")),
    });

    return (
        <storeContext.Provider value={{ store, dispatch }}>
            {children}
        </storeContext.Provider>
    );
};

export default StoreProvider;
