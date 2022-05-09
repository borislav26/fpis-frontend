import React from "react"
import './Header.css'

const Header = props => {
    return (
        <>
            <h1>{props.label}</h1>
        </>
    )
}

export default Header