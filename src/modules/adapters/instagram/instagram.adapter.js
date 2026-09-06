import axios from "axios";
import BaseAdapter from "../base/base.adapter.js";

class InstagramAdapter extends BaseAdapter {
  constructor(integration) {
    super(integration);

    this.config = integration.config || {};

    this.accessToken = this.config.access_token;
    this.instagramAccountId = this.config.instagram_account_id;

    this.baseUrl = "https://graph.facebook.com";
  }

  /**
   * Test Instagram integration connection.
   */
  async testConnection() {
    if (!this.accessToken) {
      throw new Error("Instagram access token is required.");
    }

    if (!this.instagramAccountId) {
      throw new Error("Instagram account ID is required.");
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.instagramAccountId}`,
        {
          params: {
            fields: "id,username,name",
            access_token: this.accessToken,
          },
          timeout: 10000,
        }
      );

      return {
        success: true,
        platform: "instagram",
        account: {
          id: response.data.id,
          username: response.data.username,
          name: response.data.name || null,
        },
      };
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.message ||
        "Instagram connection failed.";

      const connectionError = new Error(message);
      connectionError.statusCode = 400;

      throw connectionError;
    }
  }

  /**
   * Fetch leads/data from Instagram.
   */
  async fetchLeads() {
    if (!this.accessToken) {
      throw new Error("Instagram access token is required.");
    }

    if (!this.instagramAccountId) {
      throw new Error("Instagram account ID is required.");
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/${this.instagramAccountId}`,
        {
          params: {
            fields: "id,username,name",
            access_token: this.accessToken,
          },
          timeout: 10000,
        }
      );

      return {
        success: true,
        platform: "instagram",
        data: response.data || null,
      };
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to fetch Instagram data.";

      const fetchError = new Error(message);
      fetchError.statusCode = 400;

      throw fetchError;
    }
  }
}

export default InstagramAdapter;