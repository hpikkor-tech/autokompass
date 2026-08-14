/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Töökodade fotod (meie oma Supabase Storage). Lisa siia oma bucket'i host.
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
export default nextConfig;
