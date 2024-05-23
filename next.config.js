module.exports = {
  async redirects() {
    return [
      {
        source: "/campaigns/new",
        destination: "/campaigns/new",
        permanent: true,
      },
      {
        source: "/campaigns/:campaignAddress",
        destination: "/campaigns/:campaignAddress",
        permanent: true,
      },
    ];
  },
};
