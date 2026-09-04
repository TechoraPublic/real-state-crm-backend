import leadSourceService from "./leadsSource.service.js";

class LeadSourceController {
  /**
   * CREATE LEAD SOURCE
   * POST /api/lead-sources/create-lead-source
   */
  async create(req, res, next) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        return res.status(401).json({
          success: false,
          message: "Company information not found.",
        });
      }

      const leadSource = await leadSourceService.create(
        req.body,
        companyId
      );

      return res.status(201).json({
        success: true,
        message: "Lead source created successfully.",
        data: leadSource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET ALL LEAD SOURCES
   * GET /api/lead-sources/get-all-lead-sources
   */
  async getAll(req, res, next) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        return res.status(401).json({
          success: false,
          message: "Company information not found.",
        });
      }

      const query = req.validatedQuery || {};

      const result = await leadSourceService.getAll(
        companyId,
        query
      );

      return res.status(200).json({
        success: true,
        message: "Lead sources fetched successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET ACTIVE LEAD SOURCES
   * GET /api/lead-sources/get-active-lead-sources
   */
  async getActive(req, res, next) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        return res.status(401).json({
          success: false,
          message: "Company information not found.",
        });
      }

      const leadSources = await leadSourceService.getActive(
        companyId
      );

      return res.status(200).json({
        success: true,
        message: "Active lead sources fetched successfully.",
        data: leadSources,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET LEAD SOURCE BY ID
   * GET /api/lead-sources/get-lead-source-by-id/:id
   */
  async getById(req, res, next) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        return res.status(401).json({
          success: false,
          message: "Company information not found.",
        });
      }

      const { id } = req.validatedParams;

      const leadSource = await leadSourceService.getById(
        id,
        companyId
      );

      return res.status(200).json({
        success: true,
        message: "Lead source fetched successfully.",
        data: leadSource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * UPDATE LEAD SOURCE
   * PUT /api/lead-sources/update-lead-source/:id
   */
  async update(req, res, next) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        return res.status(401).json({
          success: false,
          message: "Company information not found.",
        });
      }

      const { id } = req.validatedParams;

      const leadSource = await leadSourceService.update(
        id,
        companyId,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Lead source updated successfully.",
        data: leadSource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * CHANGE LEAD SOURCE STATUS
   * PATCH /api/lead-sources/change-lead-source-status/:id
   */
  async changeStatus(req, res, next) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        return res.status(401).json({
          success: false,
          message: "Company information not found.",
        });
      }

      const { id } = req.validatedParams;
      const { status } = req.body;

      const leadSource = await leadSourceService.changeStatus(
        id,
        companyId,
        status
      );

      return res.status(200).json({
        success: true,
        message: "Lead source status updated successfully.",
        data: leadSource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE LEAD SOURCE
   * DELETE /api/lead-sources/delete-lead-source/:id
   */
  async delete(req, res, next) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        return res.status(401).json({
          success: false,
          message: "Company information not found.",
        });
      }

      const { id } = req.validatedParams;

      await leadSourceService.delete(
        id,
        companyId
      );

      return res.status(200).json({
        success: true,
        message: "Lead source deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LeadSourceController();