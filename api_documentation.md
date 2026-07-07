# API Documentation

This document lists all the API endpoints available in the backend, categorized by their functionality. All endpoints use a consistent JSON response format.

## Standard Response Format

```json
{
  "success": true,
  "message": "Information message",
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 100 } // Optional
}
```

---

## [Authentication](file:///home/tushar/Desktop/project/my-app/app/api/auth)
Endpoints for user identity, sessions, and security.

- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Authenticate and receive access/refresh tokens.
- **POST** `/api/auth/logout`: Invalidate the current session.
- **POST** `/api/auth/refresh`: Get a new access token using a refresh token.
- **POST** `/api/auth/forgot-password`: Initiative password recovery.
- **POST** `/api/auth/reset-password`: Set a new password with a token.
- **POST** `/api/auth/verify-email`: Confirm user email address.
- **GET**  `/api/auth/sessions`: List active sessions for the user.
- **POST** `/api/auth/revoke-session`: Terminate a specific session.

## [Farms](file:///home/tushar/Desktop/project/my-app/app/api/farms)
Manage agricultural property and related data.

- **GET**  `/api/farms`: List all farms (with pagination, search, and filtering).
- **POST** `/api/farms`: Create a new farm.
- **GET**  `/api/farms/[id]`: Get details of a specific farm.
- **PATCH** `/api/farms/[id]`: Update farm information.
- **DELETE** `/api/farms/[id]`: Soft-delete a farm.
- **GET**  `/api/farms/[id]/stats`: Get performance statistics for a farm.

## [Farm Registration](file:///home/tushar/Desktop/project/my-app/app/api/farm-registration)
Multi-step process for onboarding a new farm.

- **POST** `/api/farm-registration/step1` to `/step6`: Save progress for each registration step.
- **POST** `/api/farm-registration/submit`: Finalize and submit the registration.

## [Crops & Cycles](file:///home/tushar/Desktop/project/my-app/app/api/crops)
Lifecycle management for agriculture.

- **GET/POST** `/api/crops`: List or add crop types.
- **GET/PATCH/DELETE** `/api/crops/[id]`: Manage specific crop details.
- **GET** `/api/crops/[id]/cycles`: List growth cycles for a crop.

## [Inventory](file:///home/tushar/Desktop/project/my-app/app/api/inventory)
Tracking seeds, fertilizers, and equipment.

- **GET/POST** `/api/inventory`: List or add inventory items.
- **GET/PATCH** `/api/inventory/[id]`: Manage inventory item.
- **POST** `/api/inventory/[id]/adjust`: Record stock adjustments.

## [Loans & Subsidies](file:///home/tushar/Desktop/project/my-app/app/api/loans)
Financial assistance management.

- **GET/POST** `/api/loans`: Manage loan applications.
- **POST** `/api/loans/[id]/approve`: Approve a loan (Admin).
- **POST** `/api/loans/[id]/reject`: Reject a loan (Admin).
- **GET/POST** `/api/subsidies`: Manage subsidy applications.

## [Marketplace](file:///home/tushar/Desktop/project/my-app/app/api/marketplace)
Buy and sell agricultural products.

- **GET** `/api/marketplace`: Search for available products/listings.
- **POST** `/api/marketplace`: Create a listing.
- **POST** `/api/marketplace/[id]/purchase`: Execute a purchase.

## [Administration](file:///home/tushar/Desktop/project/my-app/app/api/admin)
System-wide management tools.

- **GET** `/api/admin/dashboard`: High-level system statistics.
- **GET** `/api/admin/audit-logs`: System activity history.
- **GET/POST** `/api/admin/users`: User management.
- **POST** `/api/admin/users/[id]/ban`: Ban a user.
- **POST** `/api/admin/users/[id]/unban`: Restore a user.

## [Miscellaneous](file:///home/tushar/Desktop/project/my-app/app/api)
- `/api/chats`: Communication messaging endpoints.
- `/api/notifications`: User alert management.
- `/api/disease-reports`: Tracking and reporting crop diseases.
- `/api/soil-reports`: Soil health data and analysis.
- `/api/ai-recommendations`: Smart suggestions based on farm data.
- `/api/weather-logs`: Historical and forecast weather data.
- `/api/activity-logs`: Detailed user action logs.
- `/api/health`: System status heartbeat.
