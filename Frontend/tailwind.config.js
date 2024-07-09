/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                white: {
                    DEFAULT: "#ffffff",
                    1: "#999797",
                    2: "#D9D9D9",
                    3: "#969696",
                    4: "#eeeeee",
                    5: "#FAFAFA"
                },
                dark: {
                    "1": "#222222",
                    "2": "#333333",
                    3: "#5E5E5E"
                },
                newGreen: {
                    1: "#126535",
                    2: "#266B5F",
                },
            },
        },
    },
    plugins: [],
}
