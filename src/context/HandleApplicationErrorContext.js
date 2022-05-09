import { Toast } from "primereact/toast"
import React from "react"

export const ErrorContext = React.createContext({
    errorToastr: <Toast/>
})

const ErrorContextProvider = ({ children }) => {
    const contextValue = {
        errorToastr: <Toast/>,
    }

    return (
        <ErrorContext.Provider value={contextValue}>
            {children}
        </ErrorContext.Provider>
    )
}
 
export default ErrorContextProvider

