/**
 * Base URL của backend API.
 * Production: dùng VITE_API_BASE_URL (Vercel env), fallback sang backend Render.
 * Development: dùng VITE_API_BASE_URL hoặc localhost:8080.
 * Luôn trim và bỏ dấu / cuối để tránh URL sai khi env có newline/space.
 */
const PRODUCTION_API = "https://cns-backend-8v53.onrender.com";

export function getApiBaseUrl() {
    const raw = import.meta.env.VITE_API_BASE_URL;
    const isProd = import.meta.env.PROD;
    const base = (raw && String(raw).trim()) || (isProd ? PRODUCTION_API : "http://localhost:8080");
    return base.trim().replace(/\/$/, "");
}

/** URL cho đăng ký: production dùng máy chủ ảo (proxy) /api/register, dev dùng backend trực tiếp */
export function getAuthRegisterUrl() {
    return import.meta.env.PROD ? "/api/register" : getApiBaseUrl() + "/auth/register";
}

/** URL cho đăng nhập: production dùng máy chủ ảo (proxy) /api/login, dev dùng backend trực tiếp */
export function getAuthLoginUrl() {
    return import.meta.env.PROD ? "/api/login" : getApiBaseUrl() + "/auth/login";
}
