import axios from "axios";
import BaseAdapter from "../base/base.adapter.js";

class FacebookAdapter extends BaseAdapter {
  constructor(integration) {
    super(integration);

    this.config = integration.config || {};

    this.accessToken = this.config.access_token;
    this.pageId = this.config.page_id;

    this.baseUrl = "https://graph.facebook.com";
  }

  async testConnection() {
    if (!this.accessToken) {
      throw new Error("Facebook access token is required.");
    }

    if (!this.pageId) {
      throw new Error("Facebook page ID is required.");
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.pageId}`,
        {
          params: {
            fields: "id,name",
            access_token: this.accessToken,
          },
          timeout: 10000,
        }
      );

      return {
        success: true,
        platform: "facebook",
        page: {
          id: response.data.id,
          name: response.data.name,
        },
      };
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.message ||
        "Facebook connection failed.";

      const connectionError = new Error(message);
      connectionError.statusCode = 400;

      throw connectionError;
    }
  }

  // async fetchLeads() {
  //   if (!this.accessToken) {
  //     throw new Error("Facebook access token is required.");
  //   }

  //   if (!this.pageId) {
  //     throw new Error("Facebook page ID is required.");
  //   }

  //   try {
  //     const response = await axios.get(
  //       `${this.baseUrl}/${this.pageId}/leadgen_forms`,
  //       {
  //         params: {
  //           access_token: this.accessToken,
  //         },
  //         timeout: 10000,
  //       }
  //     );

  //     return {
  //       success: true,
  //       platform: "facebook",
  //       data: response.data?.data || [],
  //       paging: response.data?.paging || null,
  //     };
  //   } catch (error) {
  //     const message =
  //       error.response?.data?.error?.message ||
  //       error.message ||
  //       "Failed to fetch Facebook data.";

  //     const fetchError = new Error(message);
  //     fetchError.statusCode = 400;

  //     throw fetchError;
  //   }
  // }

  async fetchLeads() {
  /*
  |--------------------------------------------------------------------------
  | TEST MODE
  |--------------------------------------------------------------------------
  */

  if (this.config.test_mode === true) {
    return {
      success: true,
      platform: "facebook",
      test_mode: true,

      data: [
        {
          id: "facebook_test_lead_001",

          created_time:
            new Date().toISOString(),

          field_data: [
            {
              name: "full_name",
              values: ["Rahul Sharma"],
            },
            {
              name: "email",
              values: ["rahul@example.com"],
            },
            {
              name: "phone_number",
              values: ["9876543210"],
            },
            {
              name: "city",
              values: ["Delhi"],
            },
          ],
        },
      ],

      paging: null,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | REAL FACEBOOK API
  |--------------------------------------------------------------------------
  */

  if (!this.accessToken) {
    throw new Error(
      "Facebook access token is required."
    );
  }

  if (!this.pageId) {
    throw new Error(
      "Facebook page ID is required."
    );
  }

  try {
    const response =
      await axios.get(
        `${this.baseUrl}/${this.pageId}/leadgen_forms`,
        {
          params: {
            access_token:
              this.accessToken,
          },
          timeout: 10000,
        }
      );

    return {
      success: true,
      platform: "facebook",
      test_mode: false,
      data:
        response.data?.data || [],
      paging:
        response.data?.paging || null,
    };
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Failed to fetch Facebook data.";

    const fetchError =
      new Error(message);

    fetchError.statusCode = 400;

    throw fetchError;
  }
}
}

export default FacebookAdapter;