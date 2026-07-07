--
-- PostgreSQL database dump
--

\restrict BM8LRhgz4hF2YrtS92ZrjEoZpBuhYCwpdN2H1vIVNQNAYd0UVvkQMKhYpsqAmdB

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AccountStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccountStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'PENDING_VERIFICATION',
    'LOCKED'
);


ALTER TYPE public."AccountStatus" OWNER TO postgres;

--
-- Name: AuditAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AuditAction" AS ENUM (
    'CREATE',
    'READ',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'APPROVE',
    'REJECT',
    'UPLOAD',
    'DOWNLOAD',
    'EXPORT'
);


ALTER TYPE public."AuditAction" OWNER TO postgres;

--
-- Name: CropCycleStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CropCycleStatus" AS ENUM (
    'PLANNED',
    'ACTIVE',
    'COMPLETED',
    'FAILED',
    'CANCELLED'
);


ALTER TYPE public."CropCycleStatus" OWNER TO postgres;

--
-- Name: CropStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CropStatus" AS ENUM (
    'PLANTED',
    'GROWING',
    'HARVESTED',
    'FAILED',
    'ARCHIVED'
);


ALTER TYPE public."CropStatus" OWNER TO postgres;

--
-- Name: DiseaseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DiseaseStatus" AS ENUM (
    'REPORTED',
    'UNDER_REVIEW',
    'CONFIRMED',
    'TREATED',
    'RESOLVED',
    'ARCHIVED'
);


ALTER TYPE public."DiseaseStatus" OWNER TO postgres;

--
-- Name: EquipmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EquipmentStatus" AS ENUM (
    'AVAILABLE',
    'IN_USE',
    'UNDER_MAINTENANCE',
    'DECOMMISSIONED'
);


ALTER TYPE public."EquipmentStatus" OWNER TO postgres;

--
-- Name: FarmStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FarmStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'ARCHIVED'
);


ALTER TYPE public."FarmStatus" OWNER TO postgres;

--
-- Name: IrrigationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."IrrigationType" AS ENUM (
    'DRIP',
    'SPRINKLER',
    'FLOOD',
    'FURROW',
    'CENTER_PIVOT',
    'MANUAL'
);


ALTER TYPE public."IrrigationType" OWNER TO postgres;

--
-- Name: LoanStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LoanStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'DISBURSED',
    'REPAID',
    'DEFAULTED'
);


ALTER TYPE public."LoanStatus" OWNER TO postgres;

--
-- Name: MarketplaceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MarketplaceStatus" AS ENUM (
    'ACTIVE',
    'SOLD',
    'EXPIRED',
    'REMOVED'
);


ALTER TYPE public."MarketplaceStatus" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'INFO',
    'SUCCESS',
    'WARNING',
    'ERROR',
    'SYSTEM',
    'MARKETING'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'DISPUTED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: RegistrationStep; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RegistrationStep" AS ENUM (
    'STEP_1_BASIC',
    'STEP_2_SOIL',
    'STEP_3_CROP',
    'STEP_4_IRRIGATION',
    'STEP_5_FERTILIZER',
    'STEP_6_FINANCIAL',
    'SUBMITTED'
);


ALTER TYPE public."RegistrationStep" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'FARMER',
    'AGRONOMIST',
    'SUPPLIER',
    'WAREHOUSE_MANAGER',
    'GOVERNMENT_OFFICER',
    'SUPER_ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: SoilType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SoilType" AS ENUM (
    'CLAY',
    'SANDY',
    'LOAMY',
    'SILTY',
    'PEATY',
    'CHALKY',
    'MIXED'
);


ALTER TYPE public."SoilType" OWNER TO postgres;

--
-- Name: SubsidyStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubsidyStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'DISBURSED'
);


ALTER TYPE public."SubsidyStatus" OWNER TO postgres;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionType" AS ENUM (
    'CREDIT',
    'DEBIT',
    'REFUND',
    'ADJUSTMENT'
);


ALTER TYPE public."TransactionType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    description text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: ai_recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_recommendations (
    id text NOT NULL,
    "userId" text NOT NULL,
    "farmId" text NOT NULL,
    "cropName" text NOT NULL,
    season text NOT NULL,
    "soilPhRange" text,
    "recommendedCrops" jsonb NOT NULL,
    "fertilizerPlan" jsonb,
    "irrigationPlan" jsonb,
    "estimatedYield" double precision,
    "confidencePct" double precision,
    "modelVersion" text,
    "inputData" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ai_recommendations OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "actorId" text,
    action public."AuditAction" NOT NULL,
    entity text NOT NULL,
    "entityId" text NOT NULL,
    "oldValue" jsonb,
    "newValue" jsonb,
    "ipAddress" text,
    "userAgent" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chats (
    id text NOT NULL,
    "user1Id" text NOT NULL,
    "user2Id" text NOT NULL,
    "lastMessageAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chats OWNER TO postgres;

--
-- Name: crop_cycles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crop_cycles (
    id text NOT NULL,
    "farmId" text NOT NULL,
    "cropId" text NOT NULL,
    "userId" text NOT NULL,
    season text NOT NULL,
    year integer NOT NULL,
    status public."CropCycleStatus" DEFAULT 'PLANNED'::public."CropCycleStatus" NOT NULL,
    "plantingDate" timestamp(3) without time zone,
    "harvestDate" timestamp(3) without time zone,
    "actualHarvestDate" timestamp(3) without time zone,
    "expectedYieldKg" double precision,
    "actualYieldKg" double precision,
    notes text,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.crop_cycles OWNER TO postgres;

--
-- Name: crops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crops (
    id text NOT NULL,
    name text NOT NULL,
    "scientificName" text,
    category text NOT NULL,
    season text NOT NULL,
    description text,
    "imageUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.crops OWNER TO postgres;

--
-- Name: disease_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.disease_reports (
    id text NOT NULL,
    "farmId" text NOT NULL,
    "userId" text NOT NULL,
    "diseaseName" text NOT NULL,
    "affectedCrop" text NOT NULL,
    severity integer DEFAULT 1 NOT NULL,
    status public."DiseaseStatus" DEFAULT 'REPORTED'::public."DiseaseStatus" NOT NULL,
    "symptomsDesc" text NOT NULL,
    "affectedAreaPct" double precision,
    "imageUrls" text[],
    "diagnosisNotes" text,
    "treatmentPlan" text,
    "resolvedAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.disease_reports OWNER TO postgres;

--
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_verification_tokens (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.email_verification_tokens OWNER TO postgres;

--
-- Name: equipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipments (
    id text NOT NULL,
    "farmId" text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    "serialNumber" text,
    manufacturer text,
    "purchaseDate" timestamp(3) without time zone,
    "purchasePrice" numeric(12,2),
    "currentValue" numeric(12,2),
    status public."EquipmentStatus" DEFAULT 'AVAILABLE'::public."EquipmentStatus" NOT NULL,
    "lastServiceDate" timestamp(3) without time zone,
    "nextServiceDate" timestamp(3) without time zone,
    notes text,
    "imageUrls" text[],
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.equipments OWNER TO postgres;

--
-- Name: farm_registration_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.farm_registration_sessions (
    id text NOT NULL,
    "userId" text NOT NULL,
    "farmId" text,
    "currentStep" public."RegistrationStep" DEFAULT 'STEP_1_BASIC'::public."RegistrationStep" NOT NULL,
    "step1Data" jsonb,
    "step2Data" jsonb,
    "step3Data" jsonb,
    "step4Data" jsonb,
    "step5Data" jsonb,
    "step6Data" jsonb,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.farm_registration_sessions OWNER TO postgres;

--
-- Name: farms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.farms (
    id text NOT NULL,
    "ownerId" text NOT NULL,
    name text NOT NULL,
    "registrationNo" text,
    status public."FarmStatus" DEFAULT 'ACTIVE'::public."FarmStatus" NOT NULL,
    "areaHectares" double precision NOT NULL,
    latitude double precision,
    longitude double precision,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    country text DEFAULT 'India'::text NOT NULL,
    pincode text NOT NULL,
    "soilType" public."SoilType",
    "waterSource" text,
    "irrigationType" public."IrrigationType",
    "certificateUrl" text,
    "isVerified" boolean DEFAULT false NOT NULL,
    "verifiedAt" timestamp(3) without time zone,
    "verifiedBy" text,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.farms OWNER TO postgres;

--
-- Name: inventories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventories (
    id text NOT NULL,
    "warehouseId" text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    sku text NOT NULL,
    "quantityKg" double precision DEFAULT 0 NOT NULL,
    "unitPrice" numeric(12,2) NOT NULL,
    "reorderLevel" double precision DEFAULT 0 NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    "batchNumber" text,
    "imageUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.inventories OWNER TO postgres;

--
-- Name: loans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loans (
    id text NOT NULL,
    "userId" text NOT NULL,
    "appNo" text NOT NULL,
    "loanAmount" numeric(12,2) NOT NULL,
    purpose text NOT NULL,
    "tenureMonths" integer NOT NULL,
    "interestRatePct" double precision NOT NULL,
    status public."LoanStatus" DEFAULT 'DRAFT'::public."LoanStatus" NOT NULL,
    "collateralDetails" text,
    documents text[],
    "reviewNotes" text,
    "reviewedBy" text,
    "reviewedAt" timestamp(3) without time zone,
    "disbursedAt" timestamp(3) without time zone,
    "repaidAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.loans OWNER TO postgres;

--
-- Name: marketplace_listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marketplace_listings (
    id text NOT NULL,
    "sellerId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    "pricePerUnit" numeric(12,2) NOT NULL,
    unit text NOT NULL,
    "quantityAvailable" double precision NOT NULL,
    "imageUrls" text[],
    location text NOT NULL,
    status public."MarketplaceStatus" DEFAULT 'ACTIVE'::public."MarketplaceStatus" NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.marketplace_listings OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id text NOT NULL,
    "chatId" text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "fileUrl" text,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" DEFAULT 'INFO'::public."NotificationType" NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "inventoryId" text NOT NULL,
    quantity double precision NOT NULL,
    "unitPrice" numeric(12,2) NOT NULL,
    total numeric(12,2) NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "orderNo" text NOT NULL,
    "buyerId" text NOT NULL,
    "supplierId" text NOT NULL,
    "totalAmount" numeric(12,2) NOT NULL,
    notes text,
    "shippingAddress" jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id text NOT NULL,
    "userId" text NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "orderId" text,
    "userId" text NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    method text NOT NULL,
    "gatewayRef" text,
    "gatewayResponse" jsonb,
    "paidAt" timestamp(3) without time zone,
    "refundedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    "userId" text NOT NULL,
    "listingId" text NOT NULL,
    rating integer NOT NULL,
    comment text,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "userId" text NOT NULL,
    "deviceInfo" text,
    "ipAddress" text,
    "userAgent" text,
    "refreshToken" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "isRevoked" boolean DEFAULT false NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: soil_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.soil_reports (
    id text NOT NULL,
    "farmId" text NOT NULL,
    "userId" text NOT NULL,
    "reportNo" text NOT NULL,
    "testDate" timestamp(3) without time zone NOT NULL,
    "phLevel" double precision NOT NULL,
    "nitrogenPpm" double precision,
    "phosphorusPpm" double precision,
    "potassiumPpm" double precision,
    "organicMatter" double precision,
    "moistureLevel" double precision,
    "soilType" public."SoilType" NOT NULL,
    "recommendationNotes" text,
    "labName" text,
    "reportUrl" text,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.soil_reports OWNER TO postgres;

--
-- Name: subsidies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subsidies (
    id text NOT NULL,
    "userId" text NOT NULL,
    "appNo" text NOT NULL,
    "subsidyType" text NOT NULL,
    "requestedAmount" numeric(12,2) NOT NULL,
    "approvedAmount" numeric(12,2),
    purpose text NOT NULL,
    status public."SubsidyStatus" DEFAULT 'DRAFT'::public."SubsidyStatus" NOT NULL,
    documents text[],
    "reviewNotes" text,
    "reviewedBy" text,
    "reviewedAt" timestamp(3) without time zone,
    "disbursedAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.subsidies OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."TransactionType" NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    description text NOT NULL,
    reference text,
    "balanceBefore" numeric(12,2) NOT NULL,
    "balanceAfter" numeric(12,2) NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    phone text,
    "passwordHash" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    role public."Role" DEFAULT 'FARMER'::public."Role" NOT NULL,
    status public."AccountStatus" DEFAULT 'PENDING_VERIFICATION'::public."AccountStatus" NOT NULL,
    "avatarUrl" text,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "emailVerifiedAt" timestamp(3) without time zone,
    "lastLoginAt" timestamp(3) without time zone,
    "lastLoginIp" text,
    "twoFactorEnabled" boolean DEFAULT false NOT NULL,
    "twoFactorSecret" text,
    "refreshTokenHash" text,
    "passwordChangedAt" timestamp(3) without time zone,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    address text,
    bio text,
    city text,
    country text,
    pincode text,
    state text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    id text NOT NULL,
    "managerId" text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    pincode text NOT NULL,
    "capacityTons" double precision NOT NULL,
    "currentLoad" double precision DEFAULT 0 NOT NULL,
    temperature double precision,
    humidity double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- Name: weather_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weather_logs (
    id text NOT NULL,
    "farmId" text NOT NULL,
    "recordedAt" timestamp(3) without time zone NOT NULL,
    "temperatureC" double precision NOT NULL,
    "humidityPct" double precision NOT NULL,
    "rainfallMm" double precision,
    "windSpeedKmh" double precision,
    "uvIndex" double precision,
    condition text NOT NULL,
    "forecastData" jsonb,
    source text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.weather_logs OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
28a6f3ff-0f35-4aea-a8f2-86fe926cc098	5bd6fb33f96865f97856bbe68d768fbb67cb1ca8964fded4d668de81f58a3c05	2026-07-03 14:56:25.522617+05:30	20260228052117_init	\N	\N	2026-07-03 14:56:25.267726+05:30	1
d56cce6d-a308-4126-ae9d-92960ffa9c7b	24a7ab4f4e87cb70c2d1a4580cda2d4f617b50917832ac906576ed3debdd3da8	2026-07-03 14:56:25.526718+05:30	20260316113241_add_profile_fields	\N	\N	2026-07-03 14:56:25.524036+05:30	1
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, "userId", action, description, "ipAddress", "userAgent", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: ai_recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_recommendations (id, "userId", "farmId", "cropName", season, "soilPhRange", "recommendedCrops", "fertilizerPlan", "irrigationPlan", "estimatedYield", "confidencePct", "modelVersion", "inputData", "createdAt") FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, "actorId", action, entity, "entityId", "oldValue", "newValue", "ipAddress", "userAgent", metadata, "createdAt") FROM stdin;
827a496e-0aef-42ef-8ad0-44d317892cee	f080a508-20a4-4ccb-9bff-253aaa6a064d	LOGIN	User	f080a508-20a4-4ccb-9bff-253aaa6a064d	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 09:30:09.639
f0c70286-5118-4cc8-9228-d18f79b3cade	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 09:30:37.935
7e7b3e56-5a9d-4e98-83a1-42490a21a80b	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	MarketplaceListing	cb892d31-54ca-4dda-a359-c409fe0f1071	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 09:32:21.369
13f0e538-e643-47b8-90b7-b396fd360833	f080a508-20a4-4ccb-9bff-253aaa6a064d	LOGIN	User	f080a508-20a4-4ccb-9bff-253aaa6a064d	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 09:52:03.891
3d437c7b-de30-4960-b82d-2377b587e1c5	f080a508-20a4-4ccb-9bff-253aaa6a064d	CREATE	Order	923f9d5d-fdd3-4418-b0cc-98168f041d97	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 09:52:30.517
10c70e8f-745d-490a-a996-4d27dc12a71e	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 09:53:10.19
ad904bc4-10c0-4a44-a92d-dec9ac41beea	f080a508-20a4-4ccb-9bff-253aaa6a064d	LOGIN	User	f080a508-20a4-4ccb-9bff-253aaa6a064d	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 10:14:17.746
0755b5e8-da5f-47b7-93ac-5e671f100ef2	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 10:15:06.432
12f82760-27f3-4c03-9f42-dd17bae2b728	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 10:54:25.442
a2ddd3de-cc16-488e-8935-e9ae27b3f977	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:10:57.86
4bdbf9aa-672b-4de4-b0a5-c136d133d3eb	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:12:41.12
233d06cb-e670-4f14-b424-d673a58f9a8c	11771808-dc00-4937-b260-72b62804bd38	CREATE	MarketplaceListing	393be01d-6988-44d1-bcea-2392f256068f	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:12:51.368
46fa627e-f82a-4249-b28a-cda7b5b64f5c	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:27:13.472
830bb12f-4d24-4b51-bc72-28e375cc4f2e	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:27:57.678
b7319cdb-c7db-4701-b65d-6984a8c8d47e	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	Order	1fb2f87c-3b91-4eae-862b-385778dbf97f	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:28:32.566
ba7f47c9-2228-4e6d-80ea-f16ae123c759	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	MarketplaceListing	94c2edba-c4cc-4f65-a457-e6326969db34	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:34:47.496
0f4f2362-8372-4feb-bb1e-e4ea753bb92b	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	MarketplaceListing	50ad601e-d487-4394-986d-73bc3691df2d	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:40:18.59
19a392b7-ba55-4d16-bc81-80b66b9beff8	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:51:20.856
473615fe-6df6-48aa-a007-c77cb76e85d9	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:51:51.316
a3d6f4ee-a6d0-4ab0-b1d9-4ae2e34ea5aa	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	Order	d6dbcedb-dbe7-440f-a415-4fc2ed6d5c30	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 11:52:57.339
6e3297fd-2a57-44b5-a9ac-391a873414bb	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	Order	fce41e35-53f0-492f-b051-1579d16b5867	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 12:06:27.577
eccfd75b-1154-46bc-a2ae-8ee173c00dfe	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 12:07:37.688
02737836-7736-4e05-82c4-83130e96bd64	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 12:08:01.829
95d0de4b-5fdf-4e59-9fa1-9b6da90c9cb5	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	MarketplaceListing	db1d0f5c-f4c4-497b-939a-01f180160abe	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 12:15:59.103
2e53d6a5-71a5-46e9-9dba-959995361ed2	f080a508-20a4-4ccb-9bff-253aaa6a064d	LOGIN	User	f080a508-20a4-4ccb-9bff-253aaa6a064d	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 12:16:49.791
c90f195d-f103-4778-974b-c4d2206bf01f	f080a508-20a4-4ccb-9bff-253aaa6a064d	CREATE	MarketplaceListing	9b530e0f-39f6-448b-8899-608685c0e049	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 12:18:00.391
94a6e7d4-a95b-426a-bfc9-f4a953c6c1cd	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 12:46:00.792
04b582d4-e944-4236-b204-f8222977aa05	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 12:55:45.015
65976bb2-9815-4511-8edd-325d1cf05c13	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:07:19.111
4d51b116-fcf1-460c-b32b-71929c3e467e	f080a508-20a4-4ccb-9bff-253aaa6a064d	LOGIN	User	f080a508-20a4-4ccb-9bff-253aaa6a064d	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:08:23.112
e8ab87c9-f075-47bc-ab61-7a6fbcb43c34	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	Order	985b998d-044f-4ff1-9e3d-fbc467b5a91a	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:12:05.678
f6473e7f-de63-43ef-aa29-006787766291	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:13:20.387
dc5fc9c2-185f-4ba7-a39a-e91c788c8f2d	f080a508-20a4-4ccb-9bff-253aaa6a064d	CREATE	Order	2cd5da17-ce23-4f35-bdbf-aa06e5a33944	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:18:53.399
de208d65-fa6a-4cd5-9d55-b09b925978cd	11771808-dc00-4937-b260-72b62804bd38	CREATE	Order	ed04e434-3bea-4e04-a6e3-90f0326b7dbd	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:24:49.951
1cf6dca5-9953-4fd8-a0d4-72f3dda7e9e0	11771808-dc00-4937-b260-72b62804bd38	CREATE	Order	452b78ca-3fff-4a26-8a04-259f730740e7	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:25:41.049
1f5e6139-a2b6-49cc-8af9-b571969f66e9	11771808-dc00-4937-b260-72b62804bd38	CREATE	Order	0a3bbbe9-e4ca-4e96-b060-09c320970289	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:27:07.665
0b29a817-5315-4f8a-b042-58505e31f303	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:27:50.003
c335d709-c21b-4e08-848a-4b339c58259d	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	Order	8f78b7e7-1f38-46b0-b906-e4add3751207	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:34:08.652
e8237a41-ab1f-4d9f-8384-83f58a12f496	f080a508-20a4-4ccb-9bff-253aaa6a064d	LOGIN	User	f080a508-20a4-4ccb-9bff-253aaa6a064d	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 13:34:25.224
cbc723af-94a3-44d6-8a52-198cc7d73e93	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-04 03:39:18.769
8874141b-c03b-4941-90c0-00f754ccdd6d	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-04 03:54:31.361
26f83634-27ed-4983-8264-26eaa2ed3bda	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-04 04:16:32.023
2a9dc11d-9baf-4af8-9d51-7f557b9ee5e1	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-04 04:32:54.918
d85d9f7c-0965-48b5-a2ed-29f4b410fa16	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-04 04:52:49.485
e4e97714-b945-484a-8c84-116103f26e49	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-04 05:09:33.87
b4f33a37-dab6-41dc-a441-ac3a5e547de8	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-04 05:27:26.318
32d58348-c416-4274-939f-24c4d0f58060	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-06 12:12:02.111
8259ca86-2cd5-42ad-a142-9290a10b6b04	11771808-dc00-4937-b260-72b62804bd38	CREATE	Order	6a171546-15d2-474b-8e48-de6488873373	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-06 12:18:43.995
3145df5a-d5ec-49fc-babf-a5cd6033d491	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-06 12:20:12.903
1ad0a207-4ced-42cd-bc5f-dc02d0ca1bac	8ed90378-cd07-4581-adf3-1e2848b8ff99	LOGIN	User	8ed90378-cd07-4581-adf3-1e2848b8ff99	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-06 12:20:50.426
aff389ac-6a89-4226-bda6-efd7f230b024	8ed90378-cd07-4581-adf3-1e2848b8ff99	CREATE	Order	d96b2781-8d9e-412b-9ce7-b3320360e93d	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-06 12:21:55.733
7930c0d8-6f36-41fa-997e-7ebee3eb94af	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-07 04:34:40.073
ae6c9121-1702-4230-b178-e2f7772ddf42	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-07 05:34:24.304
bb68e0f3-ac76-4c38-a7c7-81465661c76a	11771808-dc00-4937-b260-72b62804bd38	LOGIN	User	11771808-dc00-4937-b260-72b62804bd38	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-07 06:32:01.235
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chats (id, "user1Id", "user2Id", "lastMessageAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: crop_cycles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crop_cycles (id, "farmId", "cropId", "userId", season, year, status, "plantingDate", "harvestDate", "actualHarvestDate", "expectedYieldKg", "actualYieldKg", notes, "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: crops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crops (id, name, "scientificName", category, season, description, "imageUrl", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: disease_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.disease_reports (id, "farmId", "userId", "diseaseName", "affectedCrop", severity, status, "symptomsDesc", "affectedAreaPct", "imageUrls", "diagnosisNotes", "treatmentPlan", "resolvedAt", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: email_verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_verification_tokens (id, "userId", token, "expiresAt", "usedAt", "createdAt") FROM stdin;
49e6dd50-a38c-48d6-8bb5-caa660ac12b2	f080a508-20a4-4ccb-9bff-253aaa6a064d	60ce3bd1-fcb7-4e2a-9986-f28023a27bbd	2026-07-04 09:29:26	2026-07-03 09:29:56.936	2026-07-03 09:29:26.002
bce36927-3050-4a9e-ad1a-e6d85cf90bcd	8ed90378-cd07-4581-adf3-1e2848b8ff99	b771e2bc-766c-49dd-926c-94426f24374e	2026-07-04 09:28:10.05	2026-07-03 09:30:33.075	2026-07-03 09:28:10.056
2667249c-6821-4786-856e-0630831d4870	11771808-dc00-4937-b260-72b62804bd38	337be1ed-1212-420c-8f72-1bcac363ff46	2026-07-04 11:10:29.137	2026-07-03 11:10:47.02	2026-07-03 11:10:29.14
\.


--
-- Data for Name: equipments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equipments (id, "farmId", "userId", name, category, "serialNumber", manufacturer, "purchaseDate", "purchasePrice", "currentValue", status, "lastServiceDate", "nextServiceDate", notes, "imageUrls", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: farm_registration_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.farm_registration_sessions (id, "userId", "farmId", "currentStep", "step1Data", "step2Data", "step3Data", "step4Data", "step5Data", "step6Data", "isCompleted", "completedAt", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: farms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.farms (id, "ownerId", name, "registrationNo", status, "areaHectares", latitude, longitude, address, city, state, country, pincode, "soilType", "waterSource", "irrigationType", "certificateUrl", "isVerified", "verifiedAt", "verifiedBy", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: inventories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventories (id, "warehouseId", name, category, sku, "quantityKg", "unitPrice", "reorderLevel", "expiryDate", "batchNumber", "imageUrl", "isActive", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: loans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loans (id, "userId", "appNo", "loanAmount", purpose, "tenureMonths", "interestRatePct", status, "collateralDetails", documents, "reviewNotes", "reviewedBy", "reviewedAt", "disbursedAt", "repaidAt", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: marketplace_listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.marketplace_listings (id, "sellerId", title, description, category, "pricePerUnit", unit, "quantityAvailable", "imageUrls", location, status, "expiresAt", "deletedAt", "createdAt", "updatedAt") FROM stdin;
cb892d31-54ca-4dda-a359-c409fe0f1071	8ed90378-cd07-4581-adf3-1e2848b8ff99	Alsswsw	eeqweqweqwe	🥦 Vegetables	32232.00	quintal	232	{https://res.cloudinary.com/dcealcudn/image/upload/v1783071138/marketplace/nqqnbufhzaqbjym4ftzs.png}	223333	ACTIVE	2026-07-22 00:00:00	\N	2026-07-03 09:32:21.355	2026-07-03 09:32:21.355
393be01d-6988-44d1-bcea-2392f256068f	11771808-dc00-4937-b260-72b62804bd38	Fresh alphonso	dsdneqe EEE	🍎 Fruits	311312.00	box	33	{https://res.cloudinary.com/dcealcudn/image/upload/v1783077170/marketplace/cijhluqklcb5rwau28t6.png}	Nashing maharastra	ACTIVE	2026-07-09 00:00:00	\N	2026-07-03 11:12:51.357	2026-07-03 11:12:51.357
94c2edba-c4cc-4f65-a457-e6326969db34	8ed90378-cd07-4581-adf3-1e2848b8ff99	Fresh oranges	derscribe my prodcject	🍎 Fruits	23323.00	kg	2323	{https://res.cloudinary.com/dcealcudn/image/upload/v1783078486/marketplace/t3wi7ed5cn2hfgwcjr7u.jpg}	Nashik	ACTIVE	2026-07-17 00:00:00	\N	2026-07-03 11:34:47.487	2026-07-03 11:34:47.487
50ad601e-d487-4394-986d-73bc3691df2d	8ed90378-cd07-4581-adf3-1e2848b8ff99	Alphonso Fresh mango	power of this mango is undertand	🍎 Fruits	3131.00	kg	310301	{https://res.cloudinary.com/dcealcudn/image/upload/v1783078816/marketplace/qmva8bctcnp8tvacafin.jpg}	Indore ondia	ACTIVE	2026-07-16 00:00:00	\N	2026-07-03 11:40:18.584	2026-07-03 11:40:18.584
db1d0f5c-f4c4-497b-939a-01f180160abe	8ed90378-cd07-4581-adf3-1e2848b8ff99	mango	describe the waty of 	🍎 Fruits	2133.00	kg	3223	{https://res.cloudinary.com/dcealcudn/image/upload/v1783080958/marketplace/algsmusm4ncrjsf5zgqm.jpg}	Nashik	ACTIVE	2026-07-23 00:00:00	\N	2026-07-03 12:15:59.084	2026-07-03 12:15:59.084
9b530e0f-39f6-448b-8899-608685c0e049	f080a508-20a4-4ccb-9bff-253aaa6a064d	Llalaram	wwewdswdweweew	🍯 Organic & Natural	2323.00	kg	13223	{https://res.cloudinary.com/dcealcudn/image/upload/v1783081079/marketplace/tzam1aqxejkuwqi5djts.jpg}	nashik mh	ACTIVE	2026-07-14 00:00:00	\N	2026-07-03 12:18:00.376	2026-07-03 12:18:00.376
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, "chatId", "senderId", content, "fileUrl", "isRead", "readAt", "deletedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", type, title, body, "isRead", "readAt", metadata, "createdAt") FROM stdin;
df18b3d9-f243-48aa-9cd7-ab8ba81bb795	f080a508-20a4-4ccb-9bff-253aaa6a064d	SUCCESS	New Order!	"Llalaram" was purchased (1 kg) for ₹2323.	f	\N	{"orderId": "985b998d-044f-4ff1-9e3d-fbc467b5a91a"}	2026-07-03 13:12:05.673
3fea901b-1ad7-419d-bd0d-8df9f5f9c68c	11771808-dc00-4937-b260-72b62804bd38	SUCCESS	New Order!	"Fresh alphonso" was purchased (1 box) for ₹311312.	t	2026-07-03 13:17:58.81	{"orderId": "1fb2f87c-3b91-4eae-862b-385778dbf97f"}	2026-07-03 11:28:32.561
f4fa6f58-7c67-4d83-8509-b70b563486da	11771808-dc00-4937-b260-72b62804bd38	SUCCESS	New Order!	"Fresh alphonso" was purchased (1 box) for ₹311312.	t	2026-07-03 13:17:58.81	{"orderId": "d6dbcedb-dbe7-440f-a415-4fc2ed6d5c30"}	2026-07-03 11:52:57.334
b99123dc-12f3-4f0b-939e-4770ea9658a2	11771808-dc00-4937-b260-72b62804bd38	SUCCESS	New Order!	"Fresh alphonso" was purchased (1 box) for ₹311312.	t	2026-07-03 13:17:58.81	{"orderId": "fce41e35-53f0-492f-b051-1579d16b5867"}	2026-07-03 12:06:27.57
53ae9572-8867-4bdb-94d2-086abaa1279b	8ed90378-cd07-4581-adf3-1e2848b8ff99	SUCCESS	New Order!	"Alsswsw" was purchased (1 quintal) for ₹32232.	t	2026-07-03 13:18:15.955	{"orderId": "923f9d5d-fdd3-4418-b0cc-98168f041d97"}	2026-07-03 09:52:30.508
a0675773-c739-4278-a91a-86cdc93a3d5f	8ed90378-cd07-4581-adf3-1e2848b8ff99	SUCCESS	New Order!	"Alphonso Fresh mango" was purchased (1 kg) for ₹3131.	f	\N	{"orderId": "2cd5da17-ce23-4f35-bdbf-aa06e5a33944"}	2026-07-03 13:18:53.393
67d7af8d-4e5f-4226-a777-b2d7d3aea59d	8ed90378-cd07-4581-adf3-1e2848b8ff99	SUCCESS	New Order!	"Fresh oranges" was purchased (1 kg) for ₹23323.	f	\N	{"orderId": "ed04e434-3bea-4e04-a6e3-90f0326b7dbd"}	2026-07-03 13:24:49.931
f68bae7d-37aa-43aa-9ec3-6c7dfea2e8d3	8ed90378-cd07-4581-adf3-1e2848b8ff99	SUCCESS	New Order!	"mango" was purchased (1 kg) for ₹2133.	f	\N	{"orderId": "452b78ca-3fff-4a26-8a04-259f730740e7"}	2026-07-03 13:25:41.044
5020517f-68ec-4e0c-b267-a0998a2b95ee	8ed90378-cd07-4581-adf3-1e2848b8ff99	SUCCESS	New Order!	"mango" was purchased (1 kg) for ₹2133.	f	\N	{"orderId": "0a3bbbe9-e4ca-4e96-b060-09c320970289"}	2026-07-03 13:27:07.66
32b44df9-30ef-46cf-b5ce-27616573b8b1	f080a508-20a4-4ccb-9bff-253aaa6a064d	SUCCESS	New Order!	"Llalaram" was purchased (1 kg) for ₹2323.	f	\N	{"orderId": "8f78b7e7-1f38-46b0-b906-e4add3751207"}	2026-07-03 13:34:08.645
6cf2e3d9-e3df-457c-9beb-41f8154216c3	8ed90378-cd07-4581-adf3-1e2848b8ff99	SUCCESS	New Order!	"Fresh oranges" was purchased (1 kg) for ₹23323.	f	\N	{"orderId": "6a171546-15d2-474b-8e48-de6488873373"}	2026-07-06 12:18:43.924
d6425c69-d64e-4d0f-8f46-020bc9118d65	11771808-dc00-4937-b260-72b62804bd38	SUCCESS	New Order!	"Fresh alphonso" was purchased (1 box) for ₹311312.	f	\N	{"orderId": "d96b2781-8d9e-412b-9ce7-b3320360e93d"}	2026-07-06 12:21:55.692
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, "orderId", "inventoryId", quantity, "unitPrice", total) FROM stdin;
5abdd640-56cf-4b38-bb0f-ee6466c578a9	923f9d5d-fdd3-4418-b0cc-98168f041d97	cb892d31-54ca-4dda-a359-c409fe0f1071	1	32232.00	32232.00
e26cdae5-b719-4fab-88a3-ed5809345440	1fb2f87c-3b91-4eae-862b-385778dbf97f	393be01d-6988-44d1-bcea-2392f256068f	1	311312.00	311312.00
c6bc58e5-a472-48ea-8ea1-397f234ac0e5	d6dbcedb-dbe7-440f-a415-4fc2ed6d5c30	393be01d-6988-44d1-bcea-2392f256068f	1	311312.00	311312.00
3c7124a7-49eb-4417-abb2-a48de68691b0	fce41e35-53f0-492f-b051-1579d16b5867	393be01d-6988-44d1-bcea-2392f256068f	1	311312.00	311312.00
eebeb3c5-3043-4ed9-aa9e-2468306852bc	985b998d-044f-4ff1-9e3d-fbc467b5a91a	9b530e0f-39f6-448b-8899-608685c0e049	1	2323.00	2323.00
99951654-7389-416a-8170-128a3b031aa5	2cd5da17-ce23-4f35-bdbf-aa06e5a33944	50ad601e-d487-4394-986d-73bc3691df2d	1	3131.00	3131.00
4b00f3f9-881e-4f79-820d-2e615c7ad616	ed04e434-3bea-4e04-a6e3-90f0326b7dbd	94c2edba-c4cc-4f65-a457-e6326969db34	1	23323.00	23323.00
92fabd82-b626-4b79-ac4e-28cfb658f32f	452b78ca-3fff-4a26-8a04-259f730740e7	db1d0f5c-f4c4-497b-939a-01f180160abe	1	2133.00	2133.00
f0e0c296-4f3b-4a82-ae79-63d5d86e65a2	0a3bbbe9-e4ca-4e96-b060-09c320970289	db1d0f5c-f4c4-497b-939a-01f180160abe	1	2133.00	2133.00
287bc059-a93e-4d78-b3ef-c4a57e10e9db	8f78b7e7-1f38-46b0-b906-e4add3751207	9b530e0f-39f6-448b-8899-608685c0e049	1	2323.00	2323.00
28fd8347-747b-4848-8c26-5e2d62bf086e	6a171546-15d2-474b-8e48-de6488873373	94c2edba-c4cc-4f65-a457-e6326969db34	1	23323.00	23323.00
9905308b-6d8a-4a73-8870-7e446b93d332	d96b2781-8d9e-412b-9ce7-b3320360e93d	393be01d-6988-44d1-bcea-2392f256068f	1	311312.00	311312.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "orderNo", "buyerId", "supplierId", "totalAmount", notes, "shippingAddress", "createdAt", "updatedAt") FROM stdin;
923f9d5d-fdd3-4418-b0cc-98168f041d97	ORD-1783072350487	f080a508-20a4-4ccb-9bff-253aaa6a064d	8ed90378-cd07-4581-adf3-1e2848b8ff99	32232.00		{"city": "indore", "state": "emp", "street": "123eee", "country": "India", "pincode": "450013"}	2026-07-03 09:52:30.489	2026-07-03 09:52:30.489
1fb2f87c-3b91-4eae-862b-385778dbf97f	ORD-1783078112541	8ed90378-cd07-4581-adf3-1e2848b8ff99	11771808-dc00-4937-b260-72b62804bd38	311312.00		{"city": "indore", "state": "mp", "street": "Vikas Dayma", "country": "India", "pincode": "313313"}	2026-07-03 11:28:32.542	2026-07-03 11:28:32.542
d6dbcedb-dbe7-440f-a415-4fc2ed6d5c30	ORD-1783079577315	8ed90378-cd07-4581-adf3-1e2848b8ff99	11771808-dc00-4937-b260-72b62804bd38	311312.00		{"city": "qeq", "state": "eqeqeq", "street": "adwdqdq", "country": "India", "pincode": "322222"}	2026-07-03 11:52:57.316	2026-07-03 11:52:57.316
fce41e35-53f0-492f-b051-1579d16b5867	ORD-1783080387533	8ed90378-cd07-4581-adf3-1e2848b8ff99	11771808-dc00-4937-b260-72b62804bd38	311312.00		{"city": "indora,ma", "state": "mp", "street": "House of boston", "country": "India", "pincode": "321223"}	2026-07-03 12:06:27.549	2026-07-03 12:06:27.549
985b998d-044f-4ff1-9e3d-fbc467b5a91a	ORD-1783084325652	8ed90378-cd07-4581-adf3-1e2848b8ff99	f080a508-20a4-4ccb-9bff-253aaa6a064d	2323.00	nothing	{"city": "indore", "state": "mp", "street": "Vikas dayma", "country": "India", "pincode": "222222"}	2026-07-03 13:12:05.656	2026-07-03 13:12:05.656
2cd5da17-ce23-4f35-bdbf-aa06e5a33944	ORD-1783084733379	f080a508-20a4-4ccb-9bff-253aaa6a064d	8ed90378-cd07-4581-adf3-1e2848b8ff99	3131.00	andn	{"city": "indore", "state": "3222", "street": "12332", "country": "India", "pincode": "450013"}	2026-07-03 13:18:53.381	2026-07-03 13:18:53.381
ed04e434-3bea-4e04-a6e3-90f0326b7dbd	ORD-1783085089326	11771808-dc00-4937-b260-72b62804bd38	8ed90378-cd07-4581-adf3-1e2848b8ff99	23323.00		{"city": "INDORE", "state": "mp", "street": "Sapphire Girls Hostel,Near Bank of India,Tower Chouraha Indore", "country": "India", "pincode": "452014"}	2026-07-03 13:24:49.331	2026-07-03 13:24:49.331
452b78ca-3fff-4a26-8a04-259f730740e7	ORD-1783085141028	11771808-dc00-4937-b260-72b62804bd38	8ed90378-cd07-4581-adf3-1e2848b8ff99	2133.00		{"city": "INDORE", "state": "MP", "street": "Sapphire Girls Hostel,Near Bank of India,Tower Chouraha Indore", "country": "India", "pincode": "452014"}	2026-07-03 13:25:41.029	2026-07-03 13:25:41.029
0a3bbbe9-e4ca-4e96-b060-09c320970289	ORD-1783085227648	11771808-dc00-4937-b260-72b62804bd38	8ed90378-cd07-4581-adf3-1e2848b8ff99	2133.00		{"city": "INDORE", "state": "mp", "street": "Sapphire Girls Hostel,Near Bank of India,Tower Chouraha Indore", "country": "India", "pincode": "452014"}	2026-07-03 13:27:07.649	2026-07-03 13:27:07.649
8f78b7e7-1f38-46b0-b906-e4add3751207	ORD-1783085648624	8ed90378-cd07-4581-adf3-1e2848b8ff99	f080a508-20a4-4ccb-9bff-253aaa6a064d	2323.00		{"city": "DAMASCUS", "state": "MP", "street": "Area of house", "country": "India", "pincode": "433343"}	2026-07-03 13:34:08.626	2026-07-03 13:34:08.626
6a171546-15d2-474b-8e48-de6488873373	ORD-1783340323573	11771808-dc00-4937-b260-72b62804bd38	8ed90378-cd07-4581-adf3-1e2848b8ff99	23323.00		{"city": "INDORE", "state": "mp", "street": "Sapphire Girls Hostel,Near Bank of India,Tower Chouraha Indore", "country": "India", "pincode": "452014"}	2026-07-06 12:18:43.724	2026-07-06 12:18:43.724
d96b2781-8d9e-412b-9ce7-b3320360e93d	ORD-1783340515553	8ed90378-cd07-4581-adf3-1e2848b8ff99	11771808-dc00-4937-b260-72b62804bd38	311312.00		{"city": "DAMASCUS", "state": "mp", "street": "Area of house", "country": "India", "pincode": "343333"}	2026-07-06 12:21:55.557	2026-07-06 12:21:55.557
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, "userId", token, "expiresAt", "usedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "orderId", "userId", amount, currency, status, method, "gatewayRef", "gatewayResponse", "paidAt", "refundedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, "userId", "listingId", rating, comment, "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, "userId", "deviceInfo", "ipAddress", "userAgent", "refreshToken", "expiresAt", "isRevoked", "revokedAt", "createdAt", "updatedAt") FROM stdin;
3450a5db-ad7c-4548-9520-538d2e1bbea2	f080a508-20a4-4ccb-9bff-253aaa6a064d	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmMDgwYTUwOC0yMGE0LTRjY2ItOWJmZi0yNTNhYWE2YTA2NGQiLCJzZXNzaW9uSWQiOiIzNDUwYTVkYi1hZDdjLTQ1NDgtOTUyMC01MzhkMmUxYmJlYTIiLCJpYXQiOjE3ODMwNzEwMDksImV4cCI6MTc4MzY3NTgwOSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.UiXTDMZFviYx5M0lD5wKyYLELmS3AMAuIuAZr1mB9yY	2026-07-10 09:30:09.616	f	\N	2026-07-03 09:30:09.629	2026-07-03 09:30:09.629
9df61265-a7e6-4c53-9e11-42c447863574	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiI5ZGY2MTI2NS1hN2U2LTRjNTMtOWUxMS00MmM0NDc4NjM1NzQiLCJpYXQiOjE3ODMwNzEwMzcsImV4cCI6MTc4MzY3NTgzNywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.pwBIIecBYxxqTw-EWAQdnMhbgehVJl_NFWJP1sXgU8U	2026-07-10 09:30:37.919	f	\N	2026-07-03 09:30:37.928	2026-07-03 09:30:37.928
9f4632d3-25e8-4422-a50e-cbb9f65ff0f0	f080a508-20a4-4ccb-9bff-253aaa6a064d	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmMDgwYTUwOC0yMGE0LTRjY2ItOWJmZi0yNTNhYWE2YTA2NGQiLCJzZXNzaW9uSWQiOiI5ZjQ2MzJkMy0yNWU4LTQ0MjItYTUwZS1jYmI5ZjY1ZmYwZjAiLCJpYXQiOjE3ODMwNzIzMjMsImV4cCI6MTc4MzY3NzEyMywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.JmmuBrTgrNLAMP6csxvc_K9QCtOn6dXKafV4YmT2J2E	2026-07-10 09:52:03.834	f	\N	2026-07-03 09:52:03.879	2026-07-03 09:52:03.879
a9725e79-585e-455c-8b1e-c109eb038db4	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiJhOTcyNWU3OS01ODVlLTQ1NWMtOGIxZS1jMTA5ZWIwMzhkYjQiLCJpYXQiOjE3ODMwNzIzODksImV4cCI6MTc4MzY3NzE4OSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.Wc9XaoA2Q4FSCAkeTvipHMTpHFWrVDU_PSQZP2VVwkc	2026-07-10 09:53:10.172	f	\N	2026-07-03 09:53:10.18	2026-07-03 09:53:10.18
fde57845-4cbb-43f9-9924-06926384a269	f080a508-20a4-4ccb-9bff-253aaa6a064d	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmMDgwYTUwOC0yMGE0LTRjY2ItOWJmZi0yNTNhYWE2YTA2NGQiLCJzZXNzaW9uSWQiOiJmZGU1Nzg0NS00Y2JiLTQzZjktOTkyNC0wNjkyNjM4NGEyNjkiLCJpYXQiOjE3ODMwNzM2NTcsImV4cCI6MTc4MzY3ODQ1NywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.mrf35PrSj9z-j044edYH2j03W8yoeFHryc4_BX5ssKQ	2026-07-10 10:14:17.702	f	\N	2026-07-03 10:14:17.725	2026-07-03 10:14:17.725
d421b1eb-cd3f-4834-94ae-911083485914	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiJkNDIxYjFlYi1jZDNmLTQ4MzQtOTRhZS05MTEwODM0ODU5MTQiLCJpYXQiOjE3ODMwNzM3MDYsImV4cCI6MTc4MzY3ODUwNiwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.MDNvEVRoCmRx6-ADwhPCEDLmSuzIRXiIUoaXwZEut50	2026-07-10 10:15:06.412	f	\N	2026-07-03 10:15:06.426	2026-07-03 10:15:06.426
02d1dc30-6d80-4a64-bcf1-33f47f3d3175	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiIwMmQxZGMzMC02ZDgwLTRhNjQtYmNmMS0zM2Y0N2YzZDMxNzUiLCJpYXQiOjE3ODMwNzYwNjUsImV4cCI6MTc4MzY4MDg2NSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.RvWVMjx_ZuKkuKusd85JRRECbKMbTF6X_0FdDeVWVlM	2026-07-10 10:54:25.396	f	\N	2026-07-03 10:54:25.418	2026-07-03 10:54:25.418
53b85280-18b7-4a07-a093-7794e9dd6379	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiI1M2I4NTI4MC0xOGI3LTRhMDctYTA5My03Nzk0ZTlkZDYzNzkiLCJpYXQiOjE3ODMwNzcwNTcsImV4cCI6MTc4MzY4MTg1NywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.O7W9rn2ts1Nkh8Y6Y52ifC1MM2QXt-UF_olZjpDH9J8	2026-07-10 11:10:57.847	f	\N	2026-07-03 11:10:57.854	2026-07-03 11:10:57.854
ffdfb7ec-aba3-4d40-9d53-9819fc616fa7	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiJmZmRmYjdlYy1hYmEzLTRkNDAtOWQ1My05ODE5ZmM2MTZmYTciLCJpYXQiOjE3ODMwNzcxNjAsImV4cCI6MTc4MzY4MTk2MCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.fcl1WG9pkzA_blZ_LlAYknj1shAIR6kpV8rmXkZmyFk	2026-07-10 11:12:41.085	f	\N	2026-07-03 11:12:41.1	2026-07-03 11:12:41.1
77d59db9-0f20-4f41-a5d3-71e722073f7d	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiI3N2Q1OWRiOS0wZjIwLTRmNDEtYTVkMy03MWU3MjIwNzNmN2QiLCJpYXQiOjE3ODMwNzgwMzMsImV4cCI6MTc4MzY4MjgzMywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.DnAjXtKnJuKzTvDMhMsSEENgPbWbsEhYSH69571XuQ8	2026-07-10 11:27:13.446	f	\N	2026-07-03 11:27:13.461	2026-07-03 11:27:13.461
b137ad4c-4386-4a58-85db-dfb4c1d4adbd	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiJiMTM3YWQ0Yy00Mzg2LTRhNTgtODVkYi1kZmI0YzFkNGFkYmQiLCJpYXQiOjE3ODMwNzgwNzcsImV4cCI6MTc4MzY4Mjg3NywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.qEJklvl-F9Vq-k4b0lDKWpaV0yLRdzdRwf_1aafv3hU	2026-07-10 11:27:57.652	f	\N	2026-07-03 11:27:57.669	2026-07-03 11:27:57.669
430ceeda-fcf0-4909-bdfd-e41b1e38bb80	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiI0MzBjZWVkYS1mY2YwLTQ5MDktYmRmZC1lNDFiMWUzOGJiODAiLCJpYXQiOjE3ODMwNzk0ODAsImV4cCI6MTc4MzY4NDI4MCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.hcMwbJou1BWJfEFqtHXbQY-keFynFdWperDFZO2XJiI	2026-07-10 11:51:20.82	f	\N	2026-07-03 11:51:20.84	2026-07-03 11:51:20.84
6a3bae4f-7e52-426e-b800-8017441eddc0	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiI2YTNiYWU0Zi03ZTUyLTQyNmUtYjgwMC04MDE3NDQxZWRkYzAiLCJpYXQiOjE3ODMwNzk1MTEsImV4cCI6MTc4MzY4NDMxMSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.hkh1ljgLi-4Hao2TFHl6cBM0PS4uwIPdQnWSjeG4ffY	2026-07-10 11:51:51.299	f	\N	2026-07-03 11:51:51.307	2026-07-03 11:51:51.307
18db80ea-d6df-49f5-ae21-fe33435bef7d	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiIxOGRiODBlYS1kNmRmLTQ5ZjUtYWUyMS1mZTMzNDM1YmVmN2QiLCJpYXQiOjE3ODMwODA0NTcsImV4cCI6MTc4MzY4NTI1NywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.KtF46tZjOwJxqriCgiJgmOpIiV8kUDw4Alpk4BBpHe8	2026-07-10 12:07:37.667	f	\N	2026-07-03 12:07:37.684	2026-07-03 12:07:37.684
0a1b6a24-03db-491b-a49f-536fe07e798b	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiIwYTFiNmEyNC0wM2RiLTQ5MWItYTQ5Zi01MzZmZTA3ZTc5OGIiLCJpYXQiOjE3ODMwODA0ODEsImV4cCI6MTc4MzY4NTI4MSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.qEQnh34km0SFX7gDZf_IyZXXBrpuOO3vut1Gck8IIMY	2026-07-10 12:08:01.804	f	\N	2026-07-03 12:08:01.813	2026-07-03 12:08:01.813
4b098e68-16cd-4523-85a5-e1e45ffa8fec	f080a508-20a4-4ccb-9bff-253aaa6a064d	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmMDgwYTUwOC0yMGE0LTRjY2ItOWJmZi0yNTNhYWE2YTA2NGQiLCJzZXNzaW9uSWQiOiI0YjA5OGU2OC0xNmNkLTQ1MjMtODVhNS1lMWU0NWZmYThmZWMiLCJpYXQiOjE3ODMwODEwMDksImV4cCI6MTc4MzY4NTgwOSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.3wfgShWCMaPaXT2-E_VsNvEZXpfUuEzSLnUs8imP_Ro	2026-07-10 12:16:49.743	f	\N	2026-07-03 12:16:49.779	2026-07-03 12:16:49.779
4417168a-d3ac-499b-afcb-0e98f19df8b0	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiI0NDE3MTY4YS1kM2FjLTQ5OWItYWZjYi0wZTk4ZjE5ZGY4YjAiLCJpYXQiOjE3ODMwODI3NjAsImV4cCI6MTc4MzY4NzU2MCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.F8rd6joQVetHdRnFdAget_baYJjhnTmHc8KpZleQu30	2026-07-10 12:46:00.77	f	\N	2026-07-03 12:46:00.782	2026-07-03 12:46:00.782
3d97202a-c618-42fb-8b56-dc8b03009365	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiIzZDk3MjAyYS1jNjE4LTQyZmItOGI1Ni1kYzhiMDMwMDkzNjUiLCJpYXQiOjE3ODMwODMzNDQsImV4cCI6MTc4MzY4ODE0NCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.ogoTQr-qcopz-D-TqXyZnCi8F8nT54_LRdmsqaPMpzQ	2026-07-10 12:55:44.95	f	\N	2026-07-03 12:55:45.003	2026-07-03 12:55:45.003
49a62963-b29d-45bc-8b35-3d6a465445f4	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiI0OWE2Mjk2My1iMjlkLTQ1YmMtOGIzNS0zZDZhNDY1NDQ1ZjQiLCJpYXQiOjE3ODMwODQwMzgsImV4cCI6MTc4MzY4ODgzOCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.eC0XT9yVLn6ZUkdUggUS7o7qQZDm_N0MhU-IlBrhlhY	2026-07-10 13:07:19.088	f	\N	2026-07-03 13:07:19.103	2026-07-03 13:07:19.103
4088a43a-b723-4813-be87-4a5606519950	f080a508-20a4-4ccb-9bff-253aaa6a064d	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmMDgwYTUwOC0yMGE0LTRjY2ItOWJmZi0yNTNhYWE2YTA2NGQiLCJzZXNzaW9uSWQiOiI0MDg4YTQzYS1iNzIzLTQ4MTMtYmU4Ny00YTU2MDY1MTk5NTAiLCJpYXQiOjE3ODMwODQxMDIsImV4cCI6MTc4MzY4ODkwMiwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.u03hVW_fgpVJMmbMthZX-8-2ujXzGOA2GKHVth8V3Fo	2026-07-10 13:08:23.092	f	\N	2026-07-03 13:08:23.104	2026-07-03 13:08:23.104
a9185e3b-f78c-4228-842a-bde97c1fdc4d	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiJhOTE4NWUzYi1mNzhjLTQyMjgtODQyYS1iZGU5N2MxZmRjNGQiLCJpYXQiOjE3ODMwODQ0MDAsImV4cCI6MTc4MzY4OTIwMCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.vL4c7IFulM0aSQ3BVqrsKFjFia6gumVfpzejEFoXGK8	2026-07-10 13:13:20.371	f	\N	2026-07-03 13:13:20.378	2026-07-03 13:13:20.378
85dae602-a650-49fd-b081-1082cc98eb51	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiI4NWRhZTYwMi1hNjUwLTQ5ZmQtYjA4MS0xMDgyY2M5OGViNTEiLCJpYXQiOjE3ODMwODUyNjksImV4cCI6MTc4MzY5MDA2OSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.ofP_k64io37HEz85BoJPEJ4Gmtn8zhGaBgHTPxSMa14	2026-07-10 13:27:49.981	f	\N	2026-07-03 13:27:49.996	2026-07-03 13:27:49.996
03c7e9f7-11fd-4dce-bfdf-d611f9759659	f080a508-20a4-4ccb-9bff-253aaa6a064d	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmMDgwYTUwOC0yMGE0LTRjY2ItOWJmZi0yNTNhYWE2YTA2NGQiLCJzZXNzaW9uSWQiOiIwM2M3ZTlmNy0xMWZkLTRkY2UtYmZkZi1kNjExZjk3NTk2NTkiLCJpYXQiOjE3ODMwODU2NjUsImV4cCI6MTc4MzY5MDQ2NSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.YJw_4l4mC1CwlLXko4-beRYIZJr81-F2tX-jHFGel1E	2026-07-10 13:34:25.205	f	\N	2026-07-03 13:34:25.215	2026-07-03 13:34:25.215
4e2d3ccf-1e32-46b6-8a94-8bd7a357b806	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiI0ZTJkM2NjZi0xZTMyLTQ2YjYtOGE5NC04YmQ3YTM1N2I4MDYiLCJpYXQiOjE3ODMxMzYzNTgsImV4cCI6MTc4Mzc0MTE1OCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.X2jAZzrYuxVQ9r2OM96czWdVH8I_-kSbJFfgSvZ3Khw	2026-07-11 03:39:18.675	f	\N	2026-07-04 03:39:18.724	2026-07-04 03:39:18.724
ef320199-c388-45b9-b6e6-2d25d8e2161d	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiJlZjMyMDE5OS1jMzg4LTQ1YjktYjZlNi0yZDI1ZDhlMjE2MWQiLCJpYXQiOjE3ODMxMzcyNzEsImV4cCI6MTc4Mzc0MjA3MSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.PlzVMC7pelwGH6m4PrKjbqyGjbx0naOq6UfbU8VA4UM	2026-07-11 03:54:31.326	f	\N	2026-07-04 03:54:31.344	2026-07-04 03:54:31.344
df129cbb-9fbc-424b-9411-ea4b4469e373	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiJkZjEyOWNiYi05ZmJjLTQyNGItOTQxMS1lYTRiNDQ2OWUzNzMiLCJpYXQiOjE3ODMxMzg1OTEsImV4cCI6MTc4Mzc0MzM5MSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.GNAqxFo69HOJ8hKerY2Y1EO9NFS2Yh237NkAOhJnsrs	2026-07-11 04:16:31.975	f	\N	2026-07-04 04:16:32.002	2026-07-04 04:16:32.002
496c0fba-198f-4f51-b309-f2c1d825c8f8	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiI0OTZjMGZiYS0xOThmLTRmNTEtYjMwOS1mMmMxZDgyNWM4ZjgiLCJpYXQiOjE3ODMxMzk1NzQsImV4cCI6MTc4Mzc0NDM3NCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.XYeoBID3b2S6zqiLWZxvT1d63PqOVB_UZqUtCegXrXo	2026-07-11 04:32:54.853	f	\N	2026-07-04 04:32:54.895	2026-07-04 04:32:54.895
8f68744e-5be0-4626-8978-79f7f11b1909	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiI4ZjY4NzQ0ZS01YmUwLTQ2MjYtODk3OC03OWY3ZjExYjE5MDkiLCJpYXQiOjE3ODMxNDA3NjksImV4cCI6MTc4Mzc0NTU2OSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.IX2rUhF3qAuj9QeD3EuCrsAJpqi_bljvjiH0gK0obWc	2026-07-11 04:52:49.389	f	\N	2026-07-04 04:52:49.452	2026-07-04 04:52:49.452
ef84c43f-92db-4014-a200-bcf964ac468d	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiJlZjg0YzQzZi05MmRiLTQwMTQtYTIwMC1iY2Y5NjRhYzQ2OGQiLCJpYXQiOjE3ODMxNDE3NzMsImV4cCI6MTc4Mzc0NjU3MywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.Ss2Xy1BX2KW2zmWoQCg0so2k-_8hh-Fk55qnEwYEqxs	2026-07-11 05:09:33.838	f	\N	2026-07-04 05:09:33.858	2026-07-04 05:09:33.858
a8c118cc-3001-4787-8eb1-29e6631fe1f2	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiJhOGMxMThjYy0zMDAxLTQ3ODctOGViMS0yOWU2NjMxZmUxZjIiLCJpYXQiOjE3ODMxNDI4NDUsImV4cCI6MTc4Mzc0NzY0NSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.FDyGvJX0tC7kQgcWbRfmgtnm0BrPmbRMyDKYBdGZuNg	2026-07-11 05:27:26.202	f	\N	2026-07-04 05:27:26.265	2026-07-04 05:27:26.265
e12d2986-30ac-4120-b5d2-714aa76d404d	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiJlMTJkMjk4Ni0zMGFjLTQxMjAtYjVkMi03MTRhYTc2ZDQwNGQiLCJpYXQiOjE3ODMzMzk5MjEsImV4cCI6MTc4Mzk0NDcyMSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.Q_nKLxzxps26XM6fFwAet3_DuRHwb5eSH5EJ61_CWdk	2026-07-13 12:12:01.882	f	\N	2026-07-06 12:12:02.031	2026-07-06 12:12:02.031
574aafdb-5d5a-4a63-8ab7-3fca49fd3106	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiI1NzRhYWZkYi01ZDVhLTRhNjMtOGFiNy0zZmNhNDlmZDMxMDYiLCJpYXQiOjE3ODMzNDA0MTIsImV4cCI6MTc4Mzk0NTIxMiwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.z2nhoJWcWS52wDYcuYnAN-TEq1bFplIJQPSvBRs5Qwk	2026-07-13 12:20:12.822	f	\N	2026-07-06 12:20:12.877	2026-07-06 12:20:12.877
c1fc7426-c6c0-420f-99ed-3f17756f83b4	8ed90378-cd07-4581-adf3-1e2848b8ff99	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWQ5MDM3OC1jZDA3LTQ1ODEtYWRmMy0xZTI4NDhiOGZmOTkiLCJzZXNzaW9uSWQiOiJjMWZjNzQyNi1jNmMwLTQyMGYtOTllZC0zZjE3NzU2ZjgzYjQiLCJpYXQiOjE3ODMzNDA0NTAsImV4cCI6MTc4Mzk0NTI1MCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.PAd5SNjOQtEjPP2e2Bf-76ppPjyc8GZgOkbO8xEm_qc	2026-07-13 12:20:50.409	f	\N	2026-07-06 12:20:50.419	2026-07-06 12:20:50.419
5a64b74b-f4ca-43d6-ab13-e32347f2849e	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiI1YTY0Yjc0Yi1mNGNhLTQzZDYtYWIxMy1lMzIzNDdmMjg0OWUiLCJpYXQiOjE3ODMzOTg4NzksImV4cCI6MTc4NDAwMzY3OSwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.kzuaB5tFpYEXN-APzDdkQ0huOfY4UXvVeWtIK8GFJQo	2026-07-14 04:34:39.935	f	\N	2026-07-07 04:34:40.025	2026-07-07 04:34:40.025
a5329cf1-b15e-42ec-8486-53c93bf866e2	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiJhNTMyOWNmMS1iMTVlLTQyZWMtODQ4Ni01M2M5M2JmODY2ZTIiLCJpYXQiOjE3ODM0MDI0NjMsImV4cCI6MTc4NDAwNzI2MywiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.lzpjY1aFcbdVZszS3OgYmwglinoFmBX6VX-8u-B7DrI	2026-07-14 05:34:24.191	f	\N	2026-07-07 05:34:24.278	2026-07-07 05:34:24.278
58c852be-e60c-44eb-b5a8-b3190c96ec9f	11771808-dc00-4937-b260-72b62804bd38	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTc3MTgwOC1kYzAwLTQ5MzctYjI2MC03MmI2MjgwNGJkMzgiLCJzZXNzaW9uSWQiOiI1OGM4NTJiZS1lNjBjLTQ0ZWItYjVhOC1iMzE5MGM5NmVjOWYiLCJpYXQiOjE3ODM0MDU5MjAsImV4cCI6MTc4NDAxMDcyMCwiYXVkIjoiYWdyaXNhYXMtY2xpZW50IiwiaXNzIjoiYWdyaXNhYXMifQ.CahJF8iYzOD6JwQuk4KGFpJ1pmEVY0_4pmIDGdBvYwY	2026-07-14 06:32:01.111	f	\N	2026-07-07 06:32:01.201	2026-07-07 06:32:01.201
\.


--
-- Data for Name: soil_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.soil_reports (id, "farmId", "userId", "reportNo", "testDate", "phLevel", "nitrogenPpm", "phosphorusPpm", "potassiumPpm", "organicMatter", "moistureLevel", "soilType", "recommendationNotes", "labName", "reportUrl", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: subsidies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subsidies (id, "userId", "appNo", "subsidyType", "requestedAmount", "approvedAmount", purpose, status, documents, "reviewNotes", "reviewedBy", "reviewedAt", "disbursedAt", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, "userId", type, amount, currency, description, reference, "balanceBefore", "balanceAfter", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, phone, "passwordHash", "firstName", "lastName", role, status, "avatarUrl", "failedLoginAttempts", "lockedUntil", "emailVerified", "emailVerifiedAt", "lastLoginAt", "lastLoginIp", "twoFactorEnabled", "twoFactorSecret", "refreshTokenHash", "passwordChangedAt", "deletedAt", "createdAt", "updatedAt", address, bio, city, country, pincode, state) FROM stdin;
11771808-dc00-4937-b260-72b62804bd38	vikasdayma900@gmail.com	9343552433	$2b$12$93GysAQXrKKcZT3Cn40GXuCmhjHTRImd/IeVR4f0L7P3jIJY8LuMi	Vikas	Dayma	FARMER	ACTIVE	\N	0	\N	t	2026-07-03 11:10:47.019	2026-07-07 06:32:01.111	::1	f	\N	$2b$10$mdpfGQ0NUvrd75UHwWMpp.UgsrteDqa8rMN33JnUQ5kzDF6mQxkkW	\N	\N	2026-07-03 11:10:29.127	2026-07-07 06:32:01.183	\N	\N	\N	\N	\N	\N
f080a508-20a4-4ccb-9bff-253aaa6a064d	tusharjaiswal2290@gmail.com	9843221342	$2b$12$bPC/mSX.XQT9kqEWhivCWOnf2i1Pg3q9jMr6wflLsJDyTnhKx2yVm	Tushar	jaisw	FARMER	ACTIVE	\N	0	\N	t	2026-07-03 09:29:56.936	2026-07-03 13:34:25.205	::1	f	\N	$2b$10$Sm56PrYXeLMTgLpIJRIJpulLmS2/MjGaxcRtJ435V7twvIDKuMK4u	\N	\N	2026-07-03 09:29:25.996	2026-07-03 13:34:25.209	\N	\N	\N	\N	\N	\N
8ed90378-cd07-4581-adf3-1e2848b8ff99	vikasdayma221104@acropolis.in	9343223311	$2b$12$quymTjU5L.wbIm1xmaWom.EMarfcvipYvqv28/A2Nf7JLEL0j3jv6	Vikas	Dayma	FARMER	ACTIVE	\N	0	\N	t	2026-07-03 09:30:33.075	2026-07-06 12:20:50.408	::1	f	\N	$2b$10$P/mXvZbtl.Z873toy9HxU.CrMxgmU1Ghm7QnzeRzAdw2EMGq5xr0C	\N	\N	2026-07-03 09:28:10.042	2026-07-06 12:20:50.414	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (id, "managerId", name, address, city, state, pincode, "capacityTons", "currentLoad", temperature, humidity, "isActive", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: weather_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weather_logs (id, "farmId", "recordedAt", "temperatureC", "humidityPct", "rainfallMm", "windSpeedKmh", "uvIndex", condition, "forecastData", source, "createdAt") FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: ai_recommendations ai_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_recommendations
    ADD CONSTRAINT ai_recommendations_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: crop_cycles crop_cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crop_cycles
    ADD CONSTRAINT crop_cycles_pkey PRIMARY KEY (id);


--
-- Name: crops crops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_pkey PRIMARY KEY (id);


--
-- Name: disease_reports disease_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disease_reports
    ADD CONSTRAINT disease_reports_pkey PRIMARY KEY (id);


--
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: equipments equipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipments
    ADD CONSTRAINT equipments_pkey PRIMARY KEY (id);


--
-- Name: farm_registration_sessions farm_registration_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farm_registration_sessions
    ADD CONSTRAINT farm_registration_sessions_pkey PRIMARY KEY (id);


--
-- Name: farms farms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farms
    ADD CONSTRAINT farms_pkey PRIMARY KEY (id);


--
-- Name: inventories inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT inventories_pkey PRIMARY KEY (id);


--
-- Name: loans loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT loans_pkey PRIMARY KEY (id);


--
-- Name: marketplace_listings marketplace_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT marketplace_listings_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: soil_reports soil_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.soil_reports
    ADD CONSTRAINT soil_reports_pkey PRIMARY KEY (id);


--
-- Name: subsidies subsidies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subsidies
    ADD CONSTRAINT subsidies_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: weather_logs weather_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weather_logs
    ADD CONSTRAINT weather_logs_pkey PRIMARY KEY (id);


--
-- Name: activity_logs_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "activity_logs_userId_idx" ON public.activity_logs USING btree ("userId");


--
-- Name: ai_recommendations_farmId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ai_recommendations_farmId_idx" ON public.ai_recommendations USING btree ("farmId");


--
-- Name: ai_recommendations_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ai_recommendations_userId_idx" ON public.ai_recommendations USING btree ("userId");


--
-- Name: audit_logs_actorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_actorId_idx" ON public.audit_logs USING btree ("actorId");


--
-- Name: audit_logs_entityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_entityId_idx" ON public.audit_logs USING btree ("entityId");


--
-- Name: audit_logs_entity_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX audit_logs_entity_idx ON public.audit_logs USING btree (entity);


--
-- Name: chats_user1Id_user2Id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "chats_user1Id_user2Id_key" ON public.chats USING btree ("user1Id", "user2Id");


--
-- Name: crop_cycles_cropId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "crop_cycles_cropId_idx" ON public.crop_cycles USING btree ("cropId");


--
-- Name: crop_cycles_farmId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "crop_cycles_farmId_idx" ON public.crop_cycles USING btree ("farmId");


--
-- Name: disease_reports_farmId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "disease_reports_farmId_idx" ON public.disease_reports USING btree ("farmId");


--
-- Name: disease_reports_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX disease_reports_status_idx ON public.disease_reports USING btree (status);


--
-- Name: email_verification_tokens_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX email_verification_tokens_token_idx ON public.email_verification_tokens USING btree (token);


--
-- Name: email_verification_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX email_verification_tokens_token_key ON public.email_verification_tokens USING btree (token);


--
-- Name: equipments_farmId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "equipments_farmId_idx" ON public.equipments USING btree ("farmId");


--
-- Name: equipments_serialNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "equipments_serialNumber_key" ON public.equipments USING btree ("serialNumber");


--
-- Name: farm_registration_sessions_farmId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "farm_registration_sessions_farmId_key" ON public.farm_registration_sessions USING btree ("farmId");


--
-- Name: farm_registration_sessions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "farm_registration_sessions_userId_idx" ON public.farm_registration_sessions USING btree ("userId");


--
-- Name: farms_ownerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "farms_ownerId_idx" ON public.farms USING btree ("ownerId");


--
-- Name: farms_registrationNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "farms_registrationNo_key" ON public.farms USING btree ("registrationNo");


--
-- Name: farms_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX farms_status_idx ON public.farms USING btree (status);


--
-- Name: inventories_sku_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX inventories_sku_idx ON public.inventories USING btree (sku);


--
-- Name: inventories_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX inventories_sku_key ON public.inventories USING btree (sku);


--
-- Name: inventories_warehouseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "inventories_warehouseId_idx" ON public.inventories USING btree ("warehouseId");


--
-- Name: loans_appNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "loans_appNo_key" ON public.loans USING btree ("appNo");


--
-- Name: loans_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX loans_status_idx ON public.loans USING btree (status);


--
-- Name: loans_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "loans_userId_idx" ON public.loans USING btree ("userId");


--
-- Name: marketplace_listings_sellerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "marketplace_listings_sellerId_idx" ON public.marketplace_listings USING btree ("sellerId");


--
-- Name: marketplace_listings_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX marketplace_listings_status_idx ON public.marketplace_listings USING btree (status);


--
-- Name: messages_chatId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "messages_chatId_idx" ON public.messages USING btree ("chatId");


--
-- Name: messages_senderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "messages_senderId_idx" ON public.messages USING btree ("senderId");


--
-- Name: notifications_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_isRead_idx" ON public.notifications USING btree ("isRead");


--
-- Name: notifications_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_userId_idx" ON public.notifications USING btree ("userId");


--
-- Name: orders_orderNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "orders_orderNo_key" ON public.orders USING btree ("orderNo");


--
-- Name: password_reset_tokens_token_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX password_reset_tokens_token_idx ON public.password_reset_tokens USING btree (token);


--
-- Name: password_reset_tokens_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX password_reset_tokens_token_key ON public.password_reset_tokens USING btree (token);


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: payments_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_userId_idx" ON public.payments USING btree ("userId");


--
-- Name: reviews_userId_listingId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "reviews_userId_listingId_key" ON public.reviews USING btree ("userId", "listingId");


--
-- Name: sessions_refreshToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sessions_refreshToken_idx" ON public.sessions USING btree ("refreshToken");


--
-- Name: sessions_refreshToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sessions_refreshToken_key" ON public.sessions USING btree ("refreshToken");


--
-- Name: sessions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sessions_userId_idx" ON public.sessions USING btree ("userId");


--
-- Name: soil_reports_farmId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "soil_reports_farmId_idx" ON public.soil_reports USING btree ("farmId");


--
-- Name: soil_reports_reportNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "soil_reports_reportNo_key" ON public.soil_reports USING btree ("reportNo");


--
-- Name: subsidies_appNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "subsidies_appNo_key" ON public.subsidies USING btree ("appNo");


--
-- Name: subsidies_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX subsidies_status_idx ON public.subsidies USING btree (status);


--
-- Name: subsidies_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "subsidies_userId_idx" ON public.subsidies USING btree ("userId");


--
-- Name: transactions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "transactions_userId_idx" ON public.transactions USING btree ("userId");


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_phone_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_phone_key ON public.users USING btree (phone);


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: users_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_status_idx ON public.users USING btree (status);


--
-- Name: warehouses_managerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "warehouses_managerId_idx" ON public.warehouses USING btree ("managerId");


--
-- Name: weather_logs_farmId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "weather_logs_farmId_idx" ON public.weather_logs USING btree ("farmId");


--
-- Name: weather_logs_recordedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "weather_logs_recordedAt_idx" ON public.weather_logs USING btree ("recordedAt");


--
-- Name: activity_logs activity_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ai_recommendations ai_recommendations_farmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_recommendations
    ADD CONSTRAINT "ai_recommendations_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ai_recommendations ai_recommendations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_recommendations
    ADD CONSTRAINT "ai_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_actorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: chats chats_user1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "chats_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: chats chats_user2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "chats_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: crop_cycles crop_cycles_cropId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crop_cycles
    ADD CONSTRAINT "crop_cycles_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES public.crops(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: crop_cycles crop_cycles_farmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crop_cycles
    ADD CONSTRAINT "crop_cycles_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: disease_reports disease_reports_farmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disease_reports
    ADD CONSTRAINT "disease_reports_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: disease_reports disease_reports_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.disease_reports
    ADD CONSTRAINT "disease_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: email_verification_tokens email_verification_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: equipments equipments_farmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipments
    ADD CONSTRAINT "equipments_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: equipments equipments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipments
    ADD CONSTRAINT "equipments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: farm_registration_sessions farm_registration_sessions_farmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farm_registration_sessions
    ADD CONSTRAINT "farm_registration_sessions_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: farm_registration_sessions farm_registration_sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farm_registration_sessions
    ADD CONSTRAINT "farm_registration_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: farms farms_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.farms
    ADD CONSTRAINT "farms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventories inventories_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventories
    ADD CONSTRAINT "inventories_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: loans loans_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loans
    ADD CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: marketplace_listings marketplace_listings_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketplace_listings
    ADD CONSTRAINT "marketplace_listings_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public.chats(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_inventoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES public.marketplace_listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_buyerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: password_reset_tokens password_reset_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payments payments_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public.marketplace_listings(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: soil_reports soil_reports_farmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.soil_reports
    ADD CONSTRAINT "soil_reports_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: soil_reports soil_reports_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.soil_reports
    ADD CONSTRAINT "soil_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: subsidies subsidies_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subsidies
    ADD CONSTRAINT "subsidies_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transactions transactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: weather_logs weather_logs_farmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weather_logs
    ADD CONSTRAINT "weather_logs_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES public.farms(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict BM8LRhgz4hF2YrtS92ZrjEoZpBuhYCwpdN2H1vIVNQNAYd0UVvkQMKhYpsqAmdB

