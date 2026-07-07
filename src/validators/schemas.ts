// =============================================================================
// ZOD VALIDATION SCHEMAS - Agriculture SaaS Platform
// =============================================================================
import { z } from "zod";

// =============================================================================
// AUTH SCHEMAS
// =============================================================================

export const RegisterSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phone: z.string().optional().refine(
        (v) => !v || /^\+?[0-9]{10,15}$/.test(v),
        { message: "Invalid phone number" }
    ),
    role: z.enum([
        "FARMER", "AGRONOMIST", "SUPPLIER",
        "SUPER_ADMIN",
    ]).optional().default("FARMER"),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8)
        .regex(/[A-Z]/)
        .regex(/[0-9]/)
        .regex(/[^A-Za-z0-9]/),
});

export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8)
        .regex(/[A-Z]/)
        .regex(/[0-9]/)
        .regex(/[^A-Za-z0-9]/),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(1),
});

export const VerifyEmailSchema = z.object({
    token: z.string().min(1),
});

export const RevokeSessionSchema = z.object({
    sessionId: z.string().uuid(),
});

// =============================================================================
// USER / PROFILE SCHEMAS
// =============================================================================

export const UpdateProfileSchema = z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    phone: z.string().optional().refine(
        (v) => !v || /^\+?[0-9]{10,15}$/.test(v),
        { message: "Invalid phone number" }
    ),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    address: z.string().max(200).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    pincode: z.string().regex(/^\d{6}$/).optional(),
});

// =============================================================================
// FARM SCHEMAS
// =============================================================================

export const CreateFarmSchema = z.object({
    name: z.string().min(2).max(100),
    areaHectares: z.number().positive().max(10000),
    address: z.string().min(5).max(200),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    country: z.string().default("India"),
    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    soilType: z.enum(["CLAY", "SANDY", "LOAMY", "SILTY", "PEATY", "CHALKY", "MIXED"]).optional(),
    waterSource: z.string().max(100).optional(),
    irrigationType: z.enum(["DRIP", "SPRINKLER", "FLOOD", "FURROW", "CENTER_PIVOT", "MANUAL"]).optional(),
    certificateUrl: z.string().url().optional(),
});

export const UpdateFarmSchema = CreateFarmSchema.partial();

// =============================================================================
// FARM REGISTRATION MULTI-STEP SCHEMAS
// =============================================================================

export const Step1Schema = z.object({
    name: z.string().min(2).max(100),
    areaHectares: z.number().positive(),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export const Step2Schema = z.object({
    sessionId: z.string().uuid(),
    soilType: z.enum(["CLAY", "SANDY", "LOAMY", "SILTY", "PEATY", "CHALKY", "MIXED"]),
    phLevel: z.number().min(0).max(14),
    nitrogenPpm: z.number().nonnegative().optional(),
    phosphorusPpm: z.number().nonnegative().optional(),
    potassiumPpm: z.number().nonnegative().optional(),
    organicMatter: z.number().nonnegative().optional(),
    moistureLevel: z.number().nonnegative().optional(),
    labName: z.string().optional(),
});

export const Step3Schema = z.object({
    sessionId: z.string().uuid(),
    cropId: z.string().uuid(),
    season: z.string().min(2),
    year: z.number().int().min(2000).max(2100),
    plantingDate: z.string().datetime().optional(),
    harvestDate: z.string().datetime().optional(),
    expectedYieldKg: z.number().positive().optional(),
});

export const Step4Schema = z.object({
    sessionId: z.string().uuid(),
    irrigationType: z.enum(["DRIP", "SPRINKLER", "FLOOD", "FURROW", "CENTER_PIVOT", "MANUAL"]),
    waterSource: z.string().min(2),
    frequencyDays: z.number().int().positive(),
    durationMinutes: z.number().int().positive(),
    notes: z.string().max(500).optional(),
});

export const Step5Schema = z.object({
    sessionId: z.string().uuid(),
    fertilizerType: z.string().min(2),
    applicationRate: z.string().min(2),
    frequency: z.string().min(2),
    organicAdditives: z.array(z.string()).optional(),
    notes: z.string().max(500).optional(),
});

export const Step6Schema = z.object({
    sessionId: z.string().uuid(),
    estimatedBudget: z.number().positive(),
    loanRequired: z.boolean().default(false),
    loanAmount: z.number().positive().optional(),
    subsidyRequired: z.boolean().default(false),
    expectedRevenue: z.number().nonnegative().optional(),
    notes: z.string().max(500).optional(),
});

export const SubmitRegistrationSchema = z.object({
    sessionId: z.string().uuid(),
});

// =============================================================================
// CROP SCHEMAS
// =============================================================================

export const CreateCropSchema = z.object({
    name: z.string().min(2).max(100),
    scientificName: z.string().optional(),
    category: z.string().min(2).max(50),
    season: z.string().min(2).max(50),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional(),
});

export const CreateCropCycleSchema = z.object({
    cropId: z.string().uuid(),
    season: z.string().min(2),
    year: z.number().int().min(2000).max(2100),
    plantingDate: z.string().datetime().optional(),
    harvestDate: z.string().datetime().optional(),
    expectedYieldKg: z.number().positive().optional(),
    notes: z.string().max(500).optional(),
});

export const UpdateCropCycleSchema = CreateCropCycleSchema.partial().extend({
    status: z.enum(["PLANNED", "ACTIVE", "COMPLETED", "FAILED", "CANCELLED"]).optional(),
    actualHarvestDate: z.string().datetime().optional(),
    actualYieldKg: z.number().positive().optional(),
});

// =============================================================================
// SOIL REPORT SCHEMAS
// =============================================================================

export const CreateSoilReportSchema = z.object({
    farmId: z.string().uuid(),
    testDate: z.string().datetime(),
    phLevel: z.number().min(0).max(14),
    nitrogenPpm: z.number().nonnegative().optional(),
    phosphorusPpm: z.number().nonnegative().optional(),
    potassiumPpm: z.number().nonnegative().optional(),
    organicMatter: z.number().nonnegative().optional(),
    moistureLevel: z.number().nonnegative().optional(),
    soilType: z.enum(["CLAY", "SANDY", "LOAMY", "SILTY", "PEATY", "CHALKY", "MIXED"]),
    recommendationNotes: z.string().max(1000).optional(),
    labName: z.string().max(100).optional(),
    reportUrl: z.string().url().optional(),
});

// =============================================================================
// DISEASE REPORT SCHEMAS
// =============================================================================

export const CreateDiseaseReportSchema = z.object({
    farmId: z.string().uuid(),
    diseaseName: z.string().min(2).max(100),
    affectedCrop: z.string().min(2).max(100),
    severity: z.number().int().min(1).max(5),
    symptomsDesc: z.string().min(10).max(2000),
    affectedAreaPct: z.number().min(0).max(100).optional(),
    imageUrls: z.array(z.string().url()).max(10).optional(),
});

export const UpdateDiseaseReportSchema = z.object({
    status: z.enum(["REPORTED", "UNDER_REVIEW", "CONFIRMED", "TREATED", "RESOLVED", "ARCHIVED"]).optional(),
    diagnosisNotes: z.string().max(2000).optional(),
    treatmentPlan: z.string().max(2000).optional(),
});

// =============================================================================
// EQUIPMENT SCHEMAS
// =============================================================================

export const CreateEquipmentSchema = z.object({
    farmId: z.string().uuid(),
    name: z.string().min(2).max(100),
    category: z.string().min(2).max(50),
    serialNumber: z.string().optional(),
    manufacturer: z.string().max(100).optional(),
    purchaseDate: z.string().datetime().optional(),
    purchasePrice: z.number().positive().optional(),
    currentValue: z.number().nonnegative().optional(),
    status: z.enum(["AVAILABLE", "IN_USE", "UNDER_MAINTENANCE", "DECOMMISSIONED"]).optional(),
    lastServiceDate: z.string().datetime().optional(),
    nextServiceDate: z.string().datetime().optional(),
    notes: z.string().max(500).optional(),
    imageUrls: z.array(z.string().url()).optional(),
});

// =============================================================================
// INVENTORY SCHEMAS
// =============================================================================

export const CreateInventorySchema = z.object({
    warehouseId: z.string().uuid(),
    name: z.string().min(2).max(100),
    category: z.string().min(2).max(50),
    sku: z.string().min(2).max(50),
    quantityKg: z.number().nonnegative(),
    unitPrice: z.number().positive(),
    reorderLevel: z.number().nonnegative().optional(),
    expiryDate: z.string().datetime().optional(),
    batchNumber: z.string().optional(),
    imageUrl: z.string().url().optional(),
});

export const AdjustInventorySchema = z.object({
    quantityKg: z.number(),
    reason: z.string().min(2).max(200),
});

// =============================================================================
// ORDER SCHEMAS
// =============================================================================

export const CreateOrderSchema = z.object({
    supplierId: z.string().uuid(),
    items: z.array(z.object({
        inventoryId: z.string().uuid(),
        quantity: z.number().positive(),
    })).min(1, "Order must have at least 1 item"),
    shippingAddress: z.object({
        street: z.string().min(5),
        city: z.string().min(2),
        state: z.string().min(2),
        pincode: z.string().regex(/^\d{6}$/),
        country: z.string().default("India"),
    }),
    notes: z.string().max(500).optional(),
});

export const CancelOrderSchema = z.object({
    reason: z.string().min(5).max(500),
});

// =============================================================================
// MARKETPLACE SCHEMAS
// =============================================================================

export const CreateMarketplaceListingSchema = z.object({
    title: z.string().min(5).max(200),
    description: z.string().min(10).max(2000),
    category: z.string().min(2).max(50),
    pricePerUnit: z.number().positive(),
    unit: z.string().min(1).max(20),
    quantityAvailable: z.number().positive(),
    location: z.string().min(2).max(100),
    imageUrls: z.array(z.string().url()).max(10).optional(),
    expiresAt: z.string().datetime().optional(),
});

// =============================================================================
// LOAN & SUBSIDY SCHEMAS
// =============================================================================

export const CreateLoanSchema = z.object({
    loanAmount: z.number().positive().max(50_000_000),
    purpose: z.string().min(10).max(1000),
    tenureMonths: z.number().int().min(1).max(360),
    interestRatePct: z.number().positive().max(50).optional(),
    collateralDetails: z.string().max(1000).optional(),
    documents: z.array(z.string().url()).optional(),
});

export const ReviewLoanSchema = z.object({
    action: z.enum(["APPROVE", "REJECT"]),
    reviewNotes: z.string().min(5).max(2000),
});

export const CreateSubsidySchema = z.object({
    subsidyType: z.string().min(2).max(100),
    requestedAmount: z.number().positive(),
    purpose: z.string().min(10).max(1000),
    documents: z.array(z.string().url()).optional(),
});

export const ReviewSubsidySchema = z.object({
    action: z.enum(["APPROVE", "REJECT"]),
    approvedAmount: z.number().positive().optional(),
    reviewNotes: z.string().min(5).max(2000),
});

// =============================================================================
// WEATHER LOG SCHEMAS
// =============================================================================

export const CreateWeatherLogSchema = z.object({
    farmId: z.string().uuid(),
    recordedAt: z.string().datetime(),
    temperatureC: z.number().min(-50).max(60),
    humidityPct: z.number().min(0).max(100),
    rainfallMm: z.number().nonnegative().optional(),
    windSpeedKmh: z.number().nonnegative().optional(),
    uvIndex: z.number().nonnegative().optional(),
    condition: z.string().min(2).max(50),
    forecastData: z.record(z.string(), z.unknown()).optional(),
    source: z.string().max(50).optional(),
});

// =============================================================================
// AI RECOMMENDATION SCHEMAS
// =============================================================================

export const CreateAiRecommendationSchema = z.object({
    farmId: z.string().uuid(),
    cropName: z.string().min(2).max(100),
    season: z.string().min(2).max(50),
    soilPhRange: z.string().optional(),
    recommendedCrops: z.record(z.string(), z.unknown()),
    fertilizerPlan: z.record(z.string(), z.unknown()).optional(),
    irrigationPlan: z.record(z.string(), z.unknown()).optional(),
    estimatedYield: z.number().positive().optional(),
    confidencePct: z.number().min(0).max(100).optional(),
    modelVersion: z.string().optional(),
    inputData: z.record(z.string(), z.unknown()).optional(),
});

// =============================================================================
// WAREHOUSE SCHEMAS
// =============================================================================

export const CreateWarehouseSchema = z.object({
    name: z.string().min(2).max(100),
    address: z.string().min(5).max(200),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    pincode: z.string().regex(/^\d{6}$/),
    capacityTons: z.number().positive(),
    temperature: z.number().optional(),
    humidity: z.number().min(0).max(100).optional(),
});

// =============================================================================
// PAYMENT SCHEMAS
// =============================================================================

export const CreatePaymentSchema = z.object({
    orderId: z.string().uuid().optional(),
    amount: z.number().positive(),
    currency: z.string().default("INR"),
    method: z.string().min(2).max(50),
    gatewayRef: z.string().optional(),
});

// =============================================================================
// REVIEW SCHEMAS
// =============================================================================

export const CreateReviewSchema = z.object({
    listingId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
});

// =============================================================================
// CHAT / MESSAGE SCHEMAS
// =============================================================================

export const CreateChatSchema = z.object({
    recipientId: z.string().uuid(),
});

// StartChatSchema — used by POST /api/chats
export const StartChatSchema = z.object({
    participantId: z.string().uuid(),
});

export const SendMessageSchema = z.object({
    content: z.string().min(1).max(5000),
    fileUrl: z.string().url().optional(),
    attachmentUrls: z.array(z.string().url()).max(5).optional(),
});

// =============================================================================
// ADMIN SCHEMAS
// =============================================================================

export const AdminFreezeSchema = z.object({
    reason: z.string().min(5).max(500),
});

export const AdminBroadcastSchema = z.object({
    title: z.string().min(2).max(200),
    body: z.string().min(5).max(1000),
    roles: z.array(
        z.enum(["FARMER", "AGRONOMIST", "SUPPLIER", "WAREHOUSE_MANAGER", "GOVERNMENT_OFFICER", "SUPER_ADMIN"])
    ).optional(),
    sendEmail: z.boolean().default(false),
});

// Admin user update (role + status) — SUPER_ADMIN only
export const AdminUpdateUserSchema = z.object({
    role: z.enum(["FARMER", "AGRONOMIST", "SUPPLIER", "WAREHOUSE_MANAGER", "GOVERNMENT_OFFICER", "SUPER_ADMIN"]).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"]).optional(),
    emailVerified: z.boolean().optional(),
}).refine((d) => Object.keys(d).length > 0, { message: "At least one field required" });

// Marketplace purchase
export const PurchaseListingSchema = z.object({
    quantity: z.number().positive().optional().default(1),
    shippingAddress: z.object({
        street: z.string().min(5),
        city: z.string().min(2),
        state: z.string().min(2),
        pincode: z.string().regex(/^\d{6}$/),
        country: z.string().default("India"),
    }),
    notes: z.string().max(500).optional(),
});

// AI / Agronomist recommendations
export const CreateRecommendationSchema = z.object({
    farmId: z.string().uuid(),
    type: z.string().min(2).max(50),
    title: z.string().min(5).max(200),
    description: z.string().min(10).max(2000),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    estimatedBenefit: z.string().max(500).optional(),
    implementationGuide: z.string().max(2000).optional(),
    validUntil: z.string().datetime().optional(),
});

// =============================================================================
// COMMON QUERY SCHEMAS
// =============================================================================

export const PaginationQuerySchema = z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.string().optional(),
    sortDir: z.enum(["asc", "desc"]).optional(),
    search: z.string().max(100).optional(),
    status: z.string().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
});
