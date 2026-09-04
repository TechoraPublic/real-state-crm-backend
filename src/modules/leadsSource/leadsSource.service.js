import leadSourceRepository from "./leads.respositories.js";

class LeadSourceService {
  /**
   * CREATE LEAD SOURCE
   */
  async create(data, companyId) {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    const name = data.name?.trim();
    const code = data.code?.trim().toUpperCase();
    const description = data.description?.trim() || null;

    const status = data.status
      ? String(data.status).trim().toLowerCase()
      : "active";

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name) {
      throw new Error("Lead source name is required.");
    }

    if (!code) {
      throw new Error("Lead source code is required.");
    }

    if (!["active", "inactive"].includes(status)) {
      throw new Error("Invalid lead source status.");
    }

    // -----------------------------
    // CHECK DUPLICATE NAME
    // -----------------------------

    const existingName = await leadSourceRepository.findByName(
      name,
      companyId
    );

    if (existingName) {
      throw new Error(
        "A lead source with this name already exists."
      );
    }

    // -----------------------------
    // CHECK DUPLICATE CODE
    // -----------------------------

    const existingCode = await leadSourceRepository.findByCode(
      code,
      companyId
    );

    if (existingCode) {
      throw new Error(
        "A lead source with this code already exists."
      );
    }

    // -----------------------------
    // CREATE
    // -----------------------------

    return await leadSourceRepository.create({
      company_id: companyId,
      name,
      code,
      description,
      status,
    });
  }

  /**
   * GET LEAD SOURCE BY ID
   */
  async getById(id, companyId) {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    if (!id) {
      throw new Error("Lead source ID is required.");
    }

    const leadSource = await leadSourceRepository.findById(
      id,
      companyId
    );

    if (!leadSource) {
      throw new Error("Lead source not found.");
    }

    return leadSource;
  }

  /**
   * GET ALL LEAD SOURCES
   */
  async getAll(companyId, options = {}) {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    // -----------------------------
    // PAGINATION
    // -----------------------------

    let page = Number(options.page) || 1;
    let limit = Number(options.limit) || 20;

    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 20;
    }

    // Maximum 100 records per request
    if (limit > 100) {
      limit = 100;
    }

    // -----------------------------
    // STATUS FILTER
    // -----------------------------

    let status;

    if (options.status) {
      status = String(options.status)
        .trim()
        .toLowerCase();

      if (!["active", "inactive"].includes(status)) {
        throw new Error(
          "Invalid lead source status."
        );
      }
    }

    // -----------------------------
    // SEARCH
    // -----------------------------

    const search = options.search
      ? String(options.search).trim()
      : undefined;

    // -----------------------------
    // SORTING
    // -----------------------------

    const allowedOrderFields = [
      "id",
      "name",
      "code",
      "created_at",
      "updated_at",
    ];

    const order = allowedOrderFields.includes(
      options.order
    )
      ? options.order
      : "created_at";

    const direction =
      String(options.direction || "DESC").toUpperCase() ===
      "ASC"
        ? "ASC"
        : "DESC";

    // -----------------------------
    // FETCH
    // -----------------------------

    return await leadSourceRepository.findAll(
      companyId,
      {
        status,
        search,
        page,
        limit,
        order,
        direction,
      }
    );
  }

  /**
   * GET ACTIVE LEAD SOURCES
   */
  async getActive(companyId) {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    return await leadSourceRepository.findActive(
      companyId
    );
  }

  /**
   * UPDATE LEAD SOURCE
   */
  async update(id, companyId, data) {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    if (!id) {
      throw new Error("Lead source ID is required.");
    }

    // -----------------------------
    // FIND EXISTING SOURCE
    // -----------------------------

    const existingSource =
      await leadSourceRepository.findById(
        id,
        companyId
      );

    if (!existingSource) {
      throw new Error("Lead source not found.");
    }

    const updateData = {};

    // -----------------------------
    // NAME
    // -----------------------------

    if (data.name !== undefined) {
      const name = String(data.name).trim();

      if (!name) {
        throw new Error(
          "Lead source name cannot be empty."
        );
      }

      const duplicateName =
        await leadSourceRepository.findByName(
          name,
          companyId,
          id
        );

      if (duplicateName) {
        throw new Error(
          "A lead source with this name already exists."
        );
      }

      updateData.name = name;
    }

    // -----------------------------
    // CODE
    // -----------------------------

    if (data.code !== undefined) {
      const code = String(data.code)
        .trim()
        .toUpperCase();

      if (!code) {
        throw new Error(
          "Lead source code cannot be empty."
        );
      }

      const duplicateCode =
        await leadSourceRepository.findByCode(
          code,
          companyId,
          id
        );

      if (duplicateCode) {
        throw new Error(
          "A lead source with this code already exists."
        );
      }

      updateData.code = code;
    }

    // -----------------------------
    // DESCRIPTION
    // -----------------------------

    if (data.description !== undefined) {
      updateData.description =
        data.description?.trim() || null;
    }

    // -----------------------------
    // STATUS
    // -----------------------------

    if (data.status !== undefined) {
      const status = String(data.status)
        .trim()
        .toLowerCase();

      if (!["active", "inactive"].includes(status)) {
        throw new Error(
          "Invalid lead source status."
        );
      }

      updateData.status = status;
    }

    // -----------------------------
    // NO DATA
    // -----------------------------

    if (Object.keys(updateData).length === 0) {
      throw new Error(
        "No valid fields provided for update."
      );
    }

    // -----------------------------
    // UPDATE
    // -----------------------------

    await leadSourceRepository.update(
      id,
      companyId,
      updateData
    );

    // Return updated record
    return await leadSourceRepository.findById(
      id,
      companyId
    );
  }

  /**
   * CHANGE STATUS
   */
  async changeStatus(id, companyId, status) {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    if (!id) {
      throw new Error("Lead source ID is required.");
    }

    const normalizedStatus = String(status)
      .trim()
      .toLowerCase();

    if (!["active", "inactive"].includes(normalizedStatus)) {
      throw new Error(
        "Status must be either active or inactive."
      );
    }

    // -----------------------------
    // FIND SOURCE
    // -----------------------------

    const existingSource =
      await leadSourceRepository.findById(
        id,
        companyId
      );

    if (!existingSource) {
      throw new Error("Lead source not found.");
    }

    // -----------------------------
    // ALREADY SAME STATUS
    // -----------------------------

    if (
      existingSource.status === normalizedStatus
    ) {
      return existingSource;
    }

    // -----------------------------
    // UPDATE STATUS
    // -----------------------------

    await leadSourceRepository.changeStatus(
      id,
      companyId,
      normalizedStatus
    );

    // Return updated record
    return await leadSourceRepository.findById(
      id,
      companyId
    );
  }

  /**
   * DELETE LEAD SOURCE
   */
  async delete(id, companyId) {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    if (!id) {
      throw new Error("Lead source ID is required.");
    }

    // -----------------------------
    // FIND SOURCE
    // -----------------------------

    const existingSource =
      await leadSourceRepository.findById(
        id,
        companyId
      );

    if (!existingSource) {
      throw new Error("Lead source not found.");
    }

    // -----------------------------
    // DELETE
    // -----------------------------

    const deletedRows =
      await leadSourceRepository.delete(
        id,
        companyId
      );

    if (!deletedRows) {
      throw new Error(
        "Failed to delete lead source."
      );
    }

    return true;
  }
}

export default new LeadSourceService();