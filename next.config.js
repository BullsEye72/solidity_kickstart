module.exports = {
  async redirects() {
    return [
      {
        source: "/campaigns/:campaignAddress",
        destination: "/campaigns/:campaignAddress/show",
        permanent: true,
      },
    ];
  },
};
