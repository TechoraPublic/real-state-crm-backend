import express from "express";
import cors from "cors";
import helmet from "helmet";
import CompanyRoutes from "./modules/companies/company.routes.js";
import AuthRoutes from "./modules/auth/auth.routes.js";
import UserRoutes from "./modules/users/user.routes.js";
import LeadSourceRoutes from "./modules/leadsSource/leadsSource.routes.js";
import LeadRoutes from "./modules/leads/lead.routes.js";
import LeadActivityRoutes from "./modules/leadActivities/leadActivities.routes.js";
import FollowUpRoutes from "./modules/followUps/followUps.routes.js";
import CustomerRoutes from "./modules/customers/coustmer.routes.js";
import PropertyRoutes from "./modules/properties/properties.routes.js";
import SiteVisitRoutes from "./modules/siteVisits/siteVisit.routes.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| Body Parsers
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real Estate CRM API is running",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
app.use("/api/v1/companies", CompanyRoutes);
app.use("/api/v1/auth",AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/lead-sources", LeadSourceRoutes);
app.use("/api/v1/leads", LeadRoutes);
app.use("/api/v1/lead-activities", LeadActivityRoutes);
app.use("/api/v1/followups", FollowUpRoutes);
app.use("/api/v1/customers", CustomerRoutes);
app.use("/api/v1/properties", PropertyRoutes);
app.use("/api/v1/siteVisit", SiteVisitRoutes);
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real Estate CRM API",
    version: "v1",
  });
});

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;