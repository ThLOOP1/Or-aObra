/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Evita que jspdf/fflate sejam processados no SSR (usa Node Worker, incompatível)
  serverExternalPackages: ["jspdf", "jspdf-autotable", "fflate"],
}

export default nextConfig
