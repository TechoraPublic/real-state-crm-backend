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

  async fetchLeads() {
    if (!this.accessToken) {
      throw new Error("Facebook access token is required.");
    }

    if (!this.pageId) {
      throw new Error("Facebook page ID is required.");
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.pageId}/leadgen_forms`,
        {
          params: {
            access_token: this.accessToken,
          },
          timeout: 10000,
        }
      );

      return {
        success: true,
        platform: "facebook",
        data: response.data?.data || [],
        paging: response.data?.paging || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to fetch Facebook data.";

      const fetchError = new Error(message);
      fetchError.statusCode = 400;

      throw fetchError;
    }
  }
}

export default FacebookAdapter;