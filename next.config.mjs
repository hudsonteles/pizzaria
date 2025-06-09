/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        BASE_URL: "https://api.example.com",
        BASE_URL_LOCAL: "http://127.0.0.1:8000",
        NEXTAUTH_SECRET: "vwuvsnHmnywgI82swh8OromFFxkwxC0RiaCFqi42h3I="
    }
};

export default nextConfig;
