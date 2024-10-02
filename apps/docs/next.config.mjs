/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

import nextra from 'nextra'
 
const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  readingTime: true,
  mdxOptions:{
    rehypePrettyCodeOptions:{
      theme:{
        dark: "one-dark-pro",
        light: "one-light",
      }
      
    }
  }
})
 
export default withNextra(nextConfig)