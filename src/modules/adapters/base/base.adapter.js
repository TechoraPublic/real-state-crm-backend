class BaseAdapter {
  constructor(integration) {
    if (!integration) {
      throw new Error("Integration configuration is required.");
    }

    this.integration = integration;
  }

  async testConnection() {
    throw new Error("testConnection() must be implemented.");
  }

  async fetchLeads() {
    throw new Error("fetchLeads() must be implemented.");
  }
}

export default BaseAdapter;