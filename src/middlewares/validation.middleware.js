export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    // IMPORTANT:
    // req.query is read-only/getter in the current Express setup.
    // Do NOT do: req[property] = value

    if (property === "query") {
      // Put validated query data into a custom property
      req.validatedQuery = value;
    } else if (property === "body") {
      req.body = value;
    } else if (property === "params") {
      req.validatedParams = value;
    } else {
      req[property] = value;
    }

    next();
  };
};