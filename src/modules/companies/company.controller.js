import companyService from "./company.service.js";

class CompanyController {
  /**
   * Create Company
   * POST /api/companies
   */
  async createCompany(req, res, next) {
    try {
      const company = await companyService.createCompany(req.body);

      return res.status(201).json({
        success: true,
        message: "Company created successfully.",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get All Companies
   * GET /api/companies
   */
  async getCompanies(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        status,
      } = req.query;

      const result = await companyService.getCompanies({
        page,
        limit,
        search,
        status,
      });

      return res.status(200).json({
        success: true,
        message: "Companies fetched successfully.",
        data: result.companies,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Company By ID
   * GET /api/companies/:id
   */
  async getCompanyById(req, res, next) {
    try {
      const { id } = req.params;

      const company = await companyService.getCompanyById(id);

      return res.status(200).json({
        success: true,
        message: "Company fetched successfully.",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Company
   * PUT /api/companies/:id
   */
  async updateCompany(req, res, next) {
    try {
      const { id } = req.params;

      const company = await companyService.updateCompany(
        id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Company updated successfully.",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Company
   * DELETE /api/companies/:id
   */
  async deleteCompany(req, res, next) {
    try {
      const { id } = req.params;

      const result = await companyService.deleteCompany(id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CompanyController();