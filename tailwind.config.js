/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        './src/pages/*.{js,ts,jsx,tsx,mdx}',
        './src/components/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                'text': '#050505',
                'background': '#fafafa',
                'primary': '#575e66',
                'secondary': '#e6e6e6',
                'accent': '#767f89'
            },
        },
        darkMode: ['class', '[data-mode="dark"]'],
        textColor: {
            'light': '#050505',
            'dark': '#fafafa'
        },
        backgroundColor: {
            'light': '#fafafa',
            'dark': '#050505',
        },
    },
    plugins: [],
}
