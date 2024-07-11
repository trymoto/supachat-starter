/** @type {import('next').NextConfig} */
const cspHeader = `
    default-src 'self';
    connect-src 'self' ${process.env.NEXT_PUBLIC_CONNECT_SRC};
    script-src 'self' 'unsafe-inline' ${
      process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""
    } ;
    style-src 'self' 'unsafe-inline';
    img-src 'self' https://*.googleusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};
