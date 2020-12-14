import { createContext } from 'react'

const GlobalContext = createContext({
    isToggle: false,
    setToggle: null,
});

export default GlobalContext