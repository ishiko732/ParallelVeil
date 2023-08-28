'use client'

import {useState} from 'react'

export default function Counter() {
    const [count, setCount] = useState(2)

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount((pre) => pre + 1)}>Click me</button>
        </div>
    )
}