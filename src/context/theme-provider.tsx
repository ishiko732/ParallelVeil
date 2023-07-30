'use client'

import {createContext} from 'react'
import {PageProps} from "@/types/react";

export const ThemeContext = createContext({})

export default function ThemeProvider({children}: PageProps) {
    return <ThemeContext.Provider value="dark">
        {children}
    </ThemeContext.Provider>
}