// import FacebookAdapter from "../facebook/facebook.adapter.js";
// import InstagramAdapter from "../instagram/instagram.adapter.js";
// import GoogleAdapter from "../google/google.adapter.js";
// import PortalAdapter from "../portal/portal.adapter.js";
// import WebsiteAdapter from "../website/website.adapter.js";

// const adapters = {
//   facebook: FacebookAdapter,
//   instagram: InstagramAdapter,
//   google: GoogleAdapter,
//   portal: PortalAdapter,
//   website: WebsiteAdapter,
// };

// export const getAdapter = (platform, integration) => {
//   const normalizedPlatform = String(platform).trim().toLowerCase();

//   const AdapterClass = adapters[normalizedPlatform];

//   if (!AdapterClass) {
//     const error = new Error(
//       `No adapter found for platform: ${normalizedPlatform}`
//     );

//     error.statusCode = 400;

//     throw error;
//   }

//   return new AdapterClass(integration);
// };

// export default adapters;


import FacebookAdapter from "../facebook/facebook.adapter.js";
import InstagramAdapter from "../instagram/instagram.adapter.js";

const adapters = {
  facebook: FacebookAdapter,
  instagram: InstagramAdapter,
};

export const getAdapter = (
  platform,
  integration
) => {
  const normalizedPlatform =
    String(platform)
      .trim()
      .toLowerCase();

  const AdapterClass =
    adapters[normalizedPlatform];

  if (!AdapterClass) {
    const error = new Error(
      `No adapter found for platform: ${normalizedPlatform}`
    );

    error.statusCode = 400;

    throw error;
  }

  return new AdapterClass(
    integration
  );
};

export default adapters;