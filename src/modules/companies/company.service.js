import companyRepository from "./company.repositaies.js";

class CompanyService {
  /**
   * Create Company
   */
  async createCompany(data) {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      status,
    } = data;

    // --------------------------------------------------
    // Validate required field
    // --------------------------------------------------

    if (!name || !name.trim()) {
      throw new Error("Company name is required.");
    }

    // --------------------------------------------------
    // Check duplicate email
    // --------------------------------------------------

    if (email) {
      const existingCompany = await companyRepository.findByEmail(email);

      if (existingCompany) {
        throw new Error("A company with this email already exists.");
      }
    }

    // --------------------------------------------------
    // Check duplicate company name
    // --------------------------------------------------

    const existingCompanyByName =
      await companyRepository.findByName(name.trim());

    if (existingCompanyByName) {
      throw new Error("A company with this name already exists.");
    }

    // --------------------------------------------------
    // Create company
    // --------------------------------------------------

    const company = await companyRepository.create({
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      country: country?.trim() || "India",
      status: status || "active",
    });

    return company;
  }

  /**
   * Get Company By ID
   */
  async getCompanyById(id) {
    if (!id) {
      throw new Error("Company ID is required.");
    }

    const company = await companyRepository.findById(id);

    if (!company) {
      throw new Error("Company not found.");
    }

    return company;
  }

  /**
   * Get All Companies
   */
  async getCompanies({
    page = 1,
    limit = 10,
    search = "",
    status,
  } = {}) {
    // --------------------------------------------------
    // Normalize pagination
    // --------------------------------------------------

    page = Math.max(Number(page) || 1, 1);

    limit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    // --------------------------------------------------
    // Get companies
    // --------------------------------------------------

    const { count, rows } =
      await companyRepository.findAll({
        page,
        limit,
        search: search?.trim() || "",
        status,
      });

    const totalPages = Math.ceil(count / limit);

    return {
      companies: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Update Company
   */
  async updateCompany(id, data) {
    if (!id) {
      throw new Error("Company ID is required.");
    }

    // --------------------------------------------------
    // Check company exists
    // --------------------------------------------------

    const existingCompany =
      await companyRepository.findById(id);

    if (!existingCompany) {
      throw new Error("Company not found.");
    }

    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      status,
    } = data;

    // --------------------------------------------------
    // Validate company name
    // --------------------------------------------------

    if (name !== undefined && !name.trim()) {
      throw new Error("Company name cannot be empty.");
    }

    // --------------------------------------------------
    // Check duplicate email
    // --------------------------------------------------

    if (
      email !== undefined &&
      email &&
      email !== existingCompany.email
    ) {
      const companyWithEmail =
        await companyRepository.findByEmail(email.trim());

      if (
        companyWithEmail &&
        Number(companyWithEmail.id) !== Number(id)
      ) {
        throw new Error(
          "A company with this email already exists."
        );
      }
    }

    // --------------------------------------------------
    // Check duplicate name
    // --------------------------------------------------

    if (
      name !== undefined &&
      name.trim() !== existingCompany.name
    ) {
      const companyWithName =
        await companyRepository.findByName(name.trim());

      if (
        companyWithName &&
        Number(companyWithName.id) !== Number(id)
      ) {
        throw new Error(
          "A company with this name already exists."
        );
      }
    }

    // --------------------------------------------------
    // Prepare update data
    // --------------------------------------------------

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email?.trim() || null;
    }

    if (phone !== undefined) {
      updateData.phone = phone?.trim() || null;
    }

    if (address !== undefined) {
      updateData.address = address?.trim() || null;
    }

    if (city !== undefined) {
      updateData.city = city?.trim() || null;
    }

    if (state !== undefined) {
      updateData.state = state?.trim() || null;
    }

    if (country !== undefined) {
      updateData.country = country?.trim() || null;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    // --------------------------------------------------
    // Update company
    // --------------------------------------------------

    const updatedCompany =
      await companyRepository.update(
        id,
        updateData
      );

    return updatedCompany;
  }

  /**
   * Delete Company
   */
  async deleteCompany(id) {
    if (!id) {
      throw new Error("Company ID is required.");
    }

    // --------------------------------------------------
    // Check company exists
    // --------------------------------------------------

    const existingCompany =
      await companyRepository.findById(id);

    if (!existingCompany) {
      throw new Error("Company not found.");
    }

    // --------------------------------------------------
    // Delete company
    // --------------------------------------------------

    await companyRepository.delete(id);

    return {
      message: "Company deleted successfully.",
    };
  }

  /**
   * Check Company Exists
   */
  async companyExists(id) {
    if (!id) {
      return false;
    }

    return await companyRepository.exists(id);
  }
}

export default new CompanyService();