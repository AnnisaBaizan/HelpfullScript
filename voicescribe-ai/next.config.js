// /** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktifkan untuk handle upload file besar
  api: {
    bodyParser: false,
  },
  // Konfigurasi ukuran response maksimum
  experimental: {
    serverComponentsExternalPackages: ['formidable'],
  },
}

module.exports = nextConfig
