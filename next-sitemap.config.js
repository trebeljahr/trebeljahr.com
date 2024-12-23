const nextSitemapConfig = {
  siteUrl: "https://ricos.site",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", disallow: "/newsletter/*" },
      { userAgent: "*", allow: "/" },
    ],
  },
  exclude: [
    "/newsletter/*",
    "email-signup-success",
    "email-signup-error",
    "emergency",
  ],
};

export default nextSitemapConfig;
