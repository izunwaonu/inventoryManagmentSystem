// /** @type {import('next').NextConfig} */
// const nextConfig = {
    
//         images: {
//           remotePatterns: [
//             {
//               protocol: 'https',
//               hostname: 'res.cloudinary.com',
             
//             },
//             {
//               protocol: 'https',
//               hostname: 'utfs.io',
             
//             },
//           ],
//         },
        
      
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL, // Expose the DATABASE_URL from environment variables
  },
};

export default nextConfig;

