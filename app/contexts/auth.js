import React from "react"

const AuthContext = React.createContext()

export default AuthContext
export const AuthProvider = AuthContext.Provider
export const AuthConsumer = AuthContext.Consumer 
