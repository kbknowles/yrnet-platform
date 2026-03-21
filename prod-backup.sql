--
-- PostgreSQL database dump
--

\restrict yxGv17fbwrV9DvjFKimt1QQvN5LNTIHNb7JiS7OH0aWaNlzpflWvLb7lzDxneMt

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg12+1)
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
-- Name: public; Type: SCHEMA; Schema: -; Owner: yrnet_db_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO yrnet_db_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: yrnet_db_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AthleteEvent; Type: TYPE; Schema: public; Owner: yrnet_db_user
--

CREATE TYPE public."AthleteEvent" AS ENUM (
    'BAREBACK',
    'SADDLE_BRONC',
    'BULL_RIDING',
    'BARREL_RACING',
    'POLE_BENDING',
    'GOAT_TYING',
    'BREAKAWAY_ROPING',
    'TIE_DOWN_ROPING',
    'TEAM_ROPING',
    'STEER_WRESTLING',
    'RANCH_SADDLE_BRONC',
    'REINED_COW'
);


ALTER TYPE public."AthleteEvent" OWNER TO yrnet_db_user;

--
-- Name: ContentType; Type: TYPE; Schema: public; Owner: yrnet_db_user
--

CREATE TYPE public."ContentType" AS ENUM (
    'ATHLETE',
    'RODEO',
    'LOCATION',
    'GALLERY',
    'ANNOUNCEMENT',
    'SEASON'
);


ALTER TYPE public."ContentType" OWNER TO yrnet_db_user;

--
-- Name: DocumentCategory; Type: TYPE; Schema: public; Owner: yrnet_db_user
--

CREATE TYPE public."DocumentCategory" AS ENUM (
    'GOVERNANCE',
    'MEMBERSHIP',
    'PROGRAMS'
);


ALTER TYPE public."DocumentCategory" OWNER TO yrnet_db_user;

--
-- Name: OfficerRole; Type: TYPE; Schema: public; Owner: yrnet_db_user
--

CREATE TYPE public."OfficerRole" AS ENUM (
    'PRESIDENT',
    'VICE_PRESIDENT',
    'SECOND_VICE_PRESIDENT',
    'SECRETARY',
    'TREASURER',
    'POINTS_SECRETARY',
    'NATIONAL_DIRECTOR',
    'STATE_DIRECTOR',
    'REGION_DIRECTOR',
    'BOARD_MEMBER',
    'STUDENT_PRESIDENT',
    'STUDENT_VICE_PRESIDENT',
    'STUDENT_SECRETARY',
    'QUEEN',
    'JH_PRINCESS'
);


ALTER TYPE public."OfficerRole" OWNER TO yrnet_db_user;

--
-- Name: OfficerType; Type: TYPE; Schema: public; Owner: yrnet_db_user
--

CREATE TYPE public."OfficerType" AS ENUM (
    'EXECUTIVE',
    'DIRECTOR',
    'STUDENT',
    'STAFF'
);


ALTER TYPE public."OfficerType" OWNER TO yrnet_db_user;

--
-- Name: PlacementZone; Type: TYPE; Schema: public; Owner: yrnet_db_user
--

CREATE TYPE public."PlacementZone" AS ENUM (
    'HEADER',
    'STRIP',
    'SIDEBAR',
    'FOOTER',
    'INLINE'
);


ALTER TYPE public."PlacementZone" OWNER TO yrnet_db_user;

--
-- Name: SponsorshipLevel; Type: TYPE; Schema: public; Owner: yrnet_db_user
--

CREATE TYPE public."SponsorshipLevel" AS ENUM (
    'PREMIER',
    'FEATURED',
    'STANDARD',
    'SUPPORTER'
);


ALTER TYPE public."SponsorshipLevel" OWNER TO yrnet_db_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Announcement" (
    id integer NOT NULL,
    "seasonId" integer,
    title text NOT NULL,
    content text,
    mode text DEFAULT 'STANDARD'::text NOT NULL,
    "imageUrl" text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    extras jsonb,
    published boolean DEFAULT false NOT NULL,
    "publishAt" timestamp(3) without time zone,
    "expireAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" integer NOT NULL,
    "rodeoId" integer
);


ALTER TABLE public."Announcement" OWNER TO yrnet_db_user;

--
-- Name: Announcement_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Announcement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Announcement_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Announcement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Announcement_id_seq" OWNED BY public."Announcement".id;


--
-- Name: Athlete; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Athlete" (
    id integer NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    school text,
    grade text,
    hometown text,
    bio text,
    slug text NOT NULL,
    "headshotUrl" text,
    "seasonId" integer NOT NULL,
    events public."AthleteEvent"[],
    standings text,
    awards jsonb,
    "futureGoals" text,
    "socialLinks" jsonb,
    "isActive" boolean DEFAULT true NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" integer NOT NULL,
    "actionPhotos" text[] DEFAULT ARRAY[]::text[],
    videos text[] DEFAULT ARRAY[]::text[],
    "profileEnabled" boolean DEFAULT false NOT NULL,
    "profilePublished" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Athlete" OWNER TO yrnet_db_user;

--
-- Name: Athlete_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Athlete_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Athlete_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Athlete_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Athlete_id_seq" OWNED BY public."Athlete".id;


--
-- Name: CallInPolicy; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."CallInPolicy" (
    id integer NOT NULL,
    platform text NOT NULL,
    "entryOpen" timestamp(3) without time zone NOT NULL,
    "entryClose" timestamp(3) without time zone NOT NULL,
    "lateOpen" timestamp(3) without time zone,
    "lateClose" timestamp(3) without time zone,
    "lateContact" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);


ALTER TABLE public."CallInPolicy" OWNER TO yrnet_db_user;

--
-- Name: CallInPolicy_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."CallInPolicy_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CallInPolicy_id_seq" OWNER TO yrnet_db_user;

--
-- Name: CallInPolicy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."CallInPolicy_id_seq" OWNED BY public."CallInPolicy".id;


--
-- Name: CustomPage; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."CustomPage" (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    status text NOT NULL,
    "showInMenu" boolean DEFAULT false NOT NULL,
    "showInFooter" boolean DEFAULT false NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isPlaceholder" boolean DEFAULT false NOT NULL,
    "layoutType" text DEFAULT 'standard'::text NOT NULL,
    sections jsonb,
    "heroImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" integer NOT NULL,
    "heroSubtitle" text
);


ALTER TABLE public."CustomPage" OWNER TO yrnet_db_user;

--
-- Name: CustomPage_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."CustomPage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."CustomPage_id_seq" OWNER TO yrnet_db_user;

--
-- Name: CustomPage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."CustomPage_id_seq" OWNED BY public."CustomPage".id;


--
-- Name: Document; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Document" (
    id integer NOT NULL,
    "tenantId" integer NOT NULL,
    title text NOT NULL,
    description text,
    category public."DocumentCategory" NOT NULL,
    "fileUrl" text NOT NULL,
    "isPublic" boolean DEFAULT true,
    "sortOrder" integer DEFAULT 0,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Document" OWNER TO yrnet_db_user;

--
-- Name: Document_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Document_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Document_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Document_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Document_id_seq" OWNED BY public."Document".id;


--
-- Name: GalleryAlbum; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."GalleryAlbum" (
    id integer NOT NULL,
    title text NOT NULL,
    "seasonId" integer NOT NULL,
    "coverImage" text,
    published boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);


ALTER TABLE public."GalleryAlbum" OWNER TO yrnet_db_user;

--
-- Name: GalleryAlbum_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."GalleryAlbum_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GalleryAlbum_id_seq" OWNER TO yrnet_db_user;

--
-- Name: GalleryAlbum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."GalleryAlbum_id_seq" OWNED BY public."GalleryAlbum".id;


--
-- Name: GalleryImage; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."GalleryImage" (
    id integer NOT NULL,
    "albumId" integer NOT NULL,
    "imageUrl" text NOT NULL,
    caption text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."GalleryImage" OWNER TO yrnet_db_user;

--
-- Name: GalleryImage_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."GalleryImage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GalleryImage_id_seq" OWNER TO yrnet_db_user;

--
-- Name: GalleryImage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."GalleryImage_id_seq" OWNED BY public."GalleryImage".id;


--
-- Name: Location; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Location" (
    id integer NOT NULL,
    name text NOT NULL,
    "streetAddress" text,
    city text,
    state text,
    zip text,
    "venueInfo" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);


ALTER TABLE public."Location" OWNER TO yrnet_db_user;

--
-- Name: Location_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Location_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Location_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Location_id_seq" OWNED BY public."Location".id;


--
-- Name: Officer; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Officer" (
    id integer NOT NULL,
    name text NOT NULL,
    role public."OfficerRole" NOT NULL,
    type public."OfficerType" NOT NULL,
    email text,
    phone text,
    "seasonId" integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);


ALTER TABLE public."Officer" OWNER TO yrnet_db_user;

--
-- Name: Officer_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Officer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Officer_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Officer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Officer_id_seq" OWNED BY public."Officer".id;


--
-- Name: PointsEntry; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."PointsEntry" (
    id integer NOT NULL,
    "tenantId" integer NOT NULL,
    "seasonId" integer NOT NULL,
    "rodeoId" integer NOT NULL,
    "athleteId" integer NOT NULL,
    "entryId" integer NOT NULL,
    event public."AthleteEvent" NOT NULL,
    "goNumber" integer DEFAULT 1 NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PointsEntry" OWNER TO yrnet_db_user;

--
-- Name: PointsEntry_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."PointsEntry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PointsEntry_id_seq" OWNER TO yrnet_db_user;

--
-- Name: PointsEntry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."PointsEntry_id_seq" OWNED BY public."PointsEntry".id;


--
-- Name: Rodeo; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Rodeo" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "tenantId" integer NOT NULL,
    "seasonId" integer NOT NULL,
    "locationId" integer NOT NULL,
    "callInPolicyId" integer,
    "generalInfo" text,
    specials jsonb,
    "isStateFinals" boolean DEFAULT false NOT NULL,
    status text DEFAULT 'published'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "goCount" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Rodeo" OWNER TO yrnet_db_user;

--
-- Name: RodeoContact; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."RodeoContact" (
    id integer NOT NULL,
    "rodeoId" integer NOT NULL,
    "contactRole" text NOT NULL,
    "officerRole" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RodeoContact" OWNER TO yrnet_db_user;

--
-- Name: RodeoContact_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."RodeoContact_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RodeoContact_id_seq" OWNER TO yrnet_db_user;

--
-- Name: RodeoContact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."RodeoContact_id_seq" OWNED BY public."RodeoContact".id;


--
-- Name: RodeoEntry; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."RodeoEntry" (
    id integer NOT NULL,
    "tenantId" integer NOT NULL,
    "seasonId" integer NOT NULL,
    "rodeoId" integer NOT NULL,
    "athleteId" integer NOT NULL,
    event public."AthleteEvent" NOT NULL,
    "goNumber" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RodeoEntry" OWNER TO yrnet_db_user;

--
-- Name: RodeoEntry_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."RodeoEntry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RodeoEntry_id_seq" OWNER TO yrnet_db_user;

--
-- Name: RodeoEntry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."RodeoEntry_id_seq" OWNED BY public."RodeoEntry".id;


--
-- Name: RodeoScheduleItem; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."RodeoScheduleItem" (
    id integer NOT NULL,
    "rodeoId" integer NOT NULL,
    label text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "startTime" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RodeoScheduleItem" OWNER TO yrnet_db_user;

--
-- Name: RodeoScheduleItem_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."RodeoScheduleItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RodeoScheduleItem_id_seq" OWNER TO yrnet_db_user;

--
-- Name: RodeoScheduleItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."RodeoScheduleItem_id_seq" OWNED BY public."RodeoScheduleItem".id;


--
-- Name: Rodeo_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Rodeo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Rodeo_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Rodeo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Rodeo_id_seq" OWNED BY public."Rodeo".id;


--
-- Name: Season; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Season" (
    id integer NOT NULL,
    year text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    active boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tenantId" integer NOT NULL
);


ALTER TABLE public."Season" OWNER TO yrnet_db_user;

--
-- Name: Season_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Season_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Season_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Season_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Season_id_seq" OWNED BY public."Season".id;


--
-- Name: Sponsor; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Sponsor" (
    id integer NOT NULL,
    name text NOT NULL,
    "logoUrl" text,
    "bannerUrl" text,
    website text,
    description text,
    "contactName" text,
    "contactEmail" text,
    "contactPhone" text,
    active boolean DEFAULT true NOT NULL,
    "internalNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "tenantId" integer NOT NULL
);


ALTER TABLE public."Sponsor" OWNER TO yrnet_db_user;

--
-- Name: Sponsor_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Sponsor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Sponsor_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Sponsor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Sponsor_id_seq" OWNED BY public."Sponsor".id;


--
-- Name: Sponsorship; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Sponsorship" (
    id integer NOT NULL,
    "sponsorId" integer NOT NULL,
    level public."SponsorshipLevel" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "contentType" public."ContentType",
    "contentId" integer,
    priority integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Sponsorship" OWNER TO yrnet_db_user;

--
-- Name: Sponsorship_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Sponsorship_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Sponsorship_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Sponsorship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Sponsorship_id_seq" OWNED BY public."Sponsorship".id;


--
-- Name: Tenant; Type: TABLE; Schema: public; Owner: yrnet_db_user
--

CREATE TABLE public."Tenant" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    domain text,
    "primaryColor" text,
    "accentColor" text,
    "logoUrl" text,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "secondaryColor" text,
    theme text,
    "heroCtaLink" text,
    "heroCtaText" text,
    "heroEnabled" boolean DEFAULT true NOT NULL,
    "heroImageUrl" text,
    "heroSubtitle" text,
    "heroTitle" text
);


ALTER TABLE public."Tenant" OWNER TO yrnet_db_user;

--
-- Name: Tenant_id_seq; Type: SEQUENCE; Schema: public; Owner: yrnet_db_user
--

CREATE SEQUENCE public."Tenant_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tenant_id_seq" OWNER TO yrnet_db_user;

--
-- Name: Tenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: yrnet_db_user
--

ALTER SEQUENCE public."Tenant_id_seq" OWNED BY public."Tenant".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: yrnet_db_user
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


ALTER TABLE public._prisma_migrations OWNER TO yrnet_db_user;

--
-- Name: Announcement id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Announcement" ALTER COLUMN id SET DEFAULT nextval('public."Announcement_id_seq"'::regclass);


--
-- Name: Athlete id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Athlete" ALTER COLUMN id SET DEFAULT nextval('public."Athlete_id_seq"'::regclass);


--
-- Name: CallInPolicy id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."CallInPolicy" ALTER COLUMN id SET DEFAULT nextval('public."CallInPolicy_id_seq"'::regclass);


--
-- Name: CustomPage id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."CustomPage" ALTER COLUMN id SET DEFAULT nextval('public."CustomPage_id_seq"'::regclass);


--
-- Name: Document id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Document" ALTER COLUMN id SET DEFAULT nextval('public."Document_id_seq"'::regclass);


--
-- Name: GalleryAlbum id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."GalleryAlbum" ALTER COLUMN id SET DEFAULT nextval('public."GalleryAlbum_id_seq"'::regclass);


--
-- Name: GalleryImage id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."GalleryImage" ALTER COLUMN id SET DEFAULT nextval('public."GalleryImage_id_seq"'::regclass);


--
-- Name: Location id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Location" ALTER COLUMN id SET DEFAULT nextval('public."Location_id_seq"'::regclass);


--
-- Name: Officer id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Officer" ALTER COLUMN id SET DEFAULT nextval('public."Officer_id_seq"'::regclass);


--
-- Name: PointsEntry id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."PointsEntry" ALTER COLUMN id SET DEFAULT nextval('public."PointsEntry_id_seq"'::regclass);


--
-- Name: Rodeo id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Rodeo" ALTER COLUMN id SET DEFAULT nextval('public."Rodeo_id_seq"'::regclass);


--
-- Name: RodeoContact id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoContact" ALTER COLUMN id SET DEFAULT nextval('public."RodeoContact_id_seq"'::regclass);


--
-- Name: RodeoEntry id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoEntry" ALTER COLUMN id SET DEFAULT nextval('public."RodeoEntry_id_seq"'::regclass);


--
-- Name: RodeoScheduleItem id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoScheduleItem" ALTER COLUMN id SET DEFAULT nextval('public."RodeoScheduleItem_id_seq"'::regclass);


--
-- Name: Season id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Season" ALTER COLUMN id SET DEFAULT nextval('public."Season_id_seq"'::regclass);


--
-- Name: Sponsor id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Sponsor" ALTER COLUMN id SET DEFAULT nextval('public."Sponsor_id_seq"'::regclass);


--
-- Name: Sponsorship id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Sponsorship" ALTER COLUMN id SET DEFAULT nextval('public."Sponsorship_id_seq"'::regclass);


--
-- Name: Tenant id; Type: DEFAULT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Tenant" ALTER COLUMN id SET DEFAULT nextval('public."Tenant_id_seq"'::regclass);


--
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Announcement" (id, "seasonId", title, content, mode, "imageUrl", "sortOrder", extras, published, "publishAt", "expireAt", "createdAt", "updatedAt", "tenantId", "rodeoId") FROM stdin;
3	\N	PCA Finals	We have a booth at the finals. Stop by to see us and learn more about your association	STANDARD	\N	0	\N	t	2026-01-29 04:01:00	2026-02-02 04:02:00	2026-01-29 12:36:54.391	2026-01-30 04:02:11.494	2	\N
5	2	Barrel Jackpot		POSTER	1773751212844-poster.jpeg	1	null	t	2026-02-11 01:00:00	2026-02-24 14:00:00	2026-02-09 23:40:46.786	2026-03-17 12:40:23.473	2	12
6	2	Junior Patriot		POSTER	1773751235434-poster.jpeg	2	null	t	2026-02-14 17:43:00	2026-02-23 06:00:00	2026-02-09 23:42:23.234	2026-03-17 12:40:46.28	2	12
8	1	SLE Youth Rodeo Showdown	SLE Youth Rodeo Showdown - AHSRA\nLearn More - https://www.slerodeo.com/events/2025/sle-youth-rodeo-showdown22\n\nThis is a free event for the public to attend.\nWe encourage you to come out and support our youth rodeo contestants!	STANDARD	\N	0	\N	t	\N	2026-03-16 23:00:00	2026-02-27 16:23:23.352	2026-02-27 18:24:55.843	2	13
4	2	February Rodeo		POSTER	1773760942118-poster.jpeg	0	null	t	2026-02-12 14:00:00	2026-02-23 19:00:00	2026-02-09 19:52:23.038	2026-03-17 15:22:28.961	2	12
10	1	SLE Montgomery		POSTER	10-poster.png	0	null	t	\N	2026-03-17 15:00:00	2026-03-02 00:17:23.213	2026-03-17 19:15:29.553	2	13
12	2	April 18th Newsletter		POSTER	1773795029705-poster.png	0	null	t	2026-04-07 15:06:00	2026-04-19 15:06:00	2026-03-18 00:36:52.841	2026-03-19 15:06:42.233	2	6
13	2	Barrel Jackpot Fundraiser		POSTER	1774053287823-poster.png	0	null	t	2026-03-21 01:35:00	2026-04-13 01:35:00	2026-03-21 00:34:46.854	2026-03-21 02:24:23.41	2	17
11	2	April Makeup Rodeo Newsletter		POSTER	1773760849501-poster.png	1	null	t	2026-03-03 05:00:00	2026-04-15 06:00:00	2026-03-17 01:08:20.967	2026-03-21 02:24:40.05	2	17
\.


--
-- Data for Name: Athlete; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Athlete" (id, "firstName", "lastName", school, grade, hometown, bio, slug, "headshotUrl", "seasonId", events, standings, awards, "futureGoals", "socialLinks", "isActive", "isFeatured", "sortOrder", "createdAt", "updatedAt", "tenantId", "actionPhotos", videos, "profileEnabled", "profilePublished") FROM stdin;
8	John	Doe	Home Academy	12	Somewhere Al	\N	john-doe	athlete-john-doe-headshot.png	1	{STEER_WRESTLING,TIE_DOWN_ROPING,TEAM_ROPING}	\N	\N	\N	\N	t	f	0	2026-02-07 21:58:23.976	2026-02-14 12:59:02.182	2	{}	{}	f	f
7	Jane	Doe	Hometown	11	Somewhere, Florida	Jane Doe is a dedicated rodeo athlete.	jane-doe	athlete-jane-doe-headshot.png	1	{BREAKAWAY_ROPING,POLE_BENDING,GOAT_TYING}	\N	\N	\N	\N	t	f	0	2026-02-07 20:40:17.129	2026-02-13 16:23:16.127	2	{}	{}	f	f
3	Chanlee	Turner	homeSchool	12	Harpersville, Alabama	Chanlee strives to be a competitor younger athletes look up to — admired for both her performance and her character. Her goals are to challenge the competition, make a name for herself in the sport, and be known as the fun, friendly presence everyone enjoys being around, inside and outside the arena.    Favorite Quote: “Courage is being scared to death and saddling up anyway.” — John Wayne	chanlee-turner	1772308104701-490599747.png	1	{POLE_BENDING,BREAKAWAY_ROPING,TEAM_ROPING,GOAT_TYING,BARREL_RACING}		\N		\N	t	f	0	2026-02-05 05:21:09.08	2026-03-19 15:51:05.685	2	{1772152557518-593953884.jpeg,1772152557574-675385191.jpeg,1772152557586-160573258.jpeg}	{1772152557596-436002602.mov,1772152557686-752630535.mov,1772152557766-502066634.mov,1772308210906-299415370.mov}	f	f
\.


--
-- Data for Name: CallInPolicy; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."CallInPolicy" (id, platform, "entryOpen", "entryClose", "lateOpen", "lateClose", "lateContact", notes, "createdAt", "tenantId") FROM stdin;
\.


--
-- Data for Name: CustomPage; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."CustomPage" (id, title, slug, content, status, "showInMenu", "showInFooter", "sortOrder", "isPlaceholder", "layoutType", sections, "heroImage", "createdAt", "updatedAt", "tenantId", "heroSubtitle") FROM stdin;
1	Welcome	welcome	<p><p><p><p><p><p>Everyone returning for another year of Rodeo and everyone coming to compete with us for the very first time. We really hope that you all have the best High School Rodeo season and are looking forward to some great sportsmanship and competition this year. We all love this sport because of what it represents while promoting our Western Way of Life. Honesty, Integrity, Humility, are just a few words to describe every Cowboy and Cowgirl competing within the gates of our Rodeo venues. Please remember to treat others as you wish to be treated and keep a positive attitude, whether you have a good run or not. You can learn so much more in defeat than in victory if you allow yourself to see the positive in everyone and everything.</p><p><strong>Student Athletes can get work hours</strong><li>One hour for carrying a flag for BOTH days of the event</li><li>By helping with the banners each day of the event</li></p><p><strong>AHSRA is a rodeo family.</strong></p><p>There should never be a question that goes unanswered. Please reach out to any of the Board members and Directors, if you have any questions about anything. If they cannot answer your question will know someone who does. If, for some reason, it is not the answer you are looking for, we can get together as a group and work it out or help explain why that answer must stand. We are all here for the benefit of these contestants and the betterment of the rodeo career.</p><p><a href="/leadership">Board of Directors Contact Info</a></p></p></p></p></p></p>	published	f	f	0	f	standard	\N	\N	2026-03-05 12:53:07.731	2026-03-05 12:54:30.359	2	\N
3	Privacy Policy	privacy	<main class="max-w-4xl mx-auto px-4 py-10 space-y-6">\n\n<h1 class="text-2xl font-bold text-ahsra-blue">\nPrivacy Policy\n</h1>\n\n<p class="text-sm text-gray-600">\n<strong>Effective Date:</strong> February 9, 2026\n</p>\n\n<p>\nThe Alabama High School Rodeo Association ("AHSRA," "we," "our," or "us") respects your privacy.\nThis policy explains what information we collect, how it is used, and how it is protected when you visit our website.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nInformation We Collect\n</h2>\n<ul class="list-disc pl-6 space-y-1">\n<li>Contact information (name, email address, phone number)</li>\n<li>Basic website usage data (pages visited, device type, browser)</li>\n<li>Information voluntarily submitted through forms or registrations</li>\n</ul>\n\n<p>\nWe do <strong>not</strong> collect sensitive personal information such as Social Security numbers or payment details through this website.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nHow We Use Information\n</h2>\n<ul class="list-disc pl-6 space-y-1">\n<li>Communicate with members, parents, sponsors, and volunteers</li>\n<li>Manage events, registrations, and association activities</li>\n<li>Improve website functionality and content</li>\n<li>Respond to inquiries and requests</li>\n</ul>\n\n<p>\nAHSRA does not sell or rent personal information.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nCookies & Analytics\n</h2>\n<p>\nThis site may use cookies or basic analytics tools to understand site usage.\nThese tools do not personally identify visitors.\n</p>\n\n<p>\nYou may disable cookies in your browser settings.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nThird-Party Links\n</h2>\n<p>\nThis website may contain links to third-party websites, including sponsors or social platforms.\nAHSRA is not responsible for the privacy practices of those sites.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nChildren's Privacy\n</h2>\n<p>\nThis site is intended for parents, guardians, and association members.\nWe do not knowingly collect personal information from children under 13 without parental consent.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nData Security\n</h2>\n<p>\nReasonable safeguards are used to protect information, but no online system can be guaranteed to be fully secure.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nYour Choices\n</h2>\n<p>\nYou may request to view, update, or remove your information from our records by contacting us.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nPolicy Updates\n</h2>\n<p>\nThis Privacy Policy may be updated periodically. Updates will be posted on this page with a revised effective date.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nContact Information\n</h2>\n<p>\n<strong>Alabama High School Rodeo Association</strong><br />\nEmail: [insert email]<br />\nPhone: [insert phone number]\n</p>\n\n</main>	published	f	t	0	f	standard	\N	\N	2026-03-05 12:53:07.731	2026-03-05 12:59:52.058	2	\N
4	Membership	membership	<div class="max-w-4xl mx-auto space-y-6">\n\n<h1 class="text-2xl font-bold text-ahsra-blue">\nMembership\n</h1>\n\n<p>\nMembership in the Alabama High School Rodeo Association (AHSRA) provides student-athletes the opportunity to compete in organized rodeos, develop leadership skills, and participate in a community built around the traditions of rodeo and Western heritage.\n</p>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nWho Can Join\n</h2>\n\n<ul class="list-disc pl-6 space-y-1">\n<li>Junior High students interested in rodeo competition</li>\n<li>High School students competing in sanctioned rodeo events</li>\n<li>Student-athletes committed to sportsmanship and academic responsibility</li>\n</ul>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nMembership Benefits\n</h2>\n\n<ul class="list-disc pl-6 space-y-1">\n<li>Eligibility to compete in AHSRA rodeos</li>\n<li>Opportunities to qualify for state and national finals</li>\n<li>Recognition for accomplishments and awards</li>\n<li>Connection with sponsors, volunteers, and rodeo supporters</li>\n</ul>\n\n<h2 class="text-lg font-semibold text-ahsra-blue">\nHow to Join\n</h2>\n\n<p>\nStudents interested in becoming members should complete the required membership forms and submit all necessary documentation before the start of the rodeo season.\n</p>\n\n<p>\nAdditional details regarding membership requirements, deadlines, and documentation will be provided through official AHSRA communications.\n</p>\n\n</div>	published	t	f	1	f	standard	\N	\N	2026-03-05 12:53:07.731	2026-03-10 14:56:00.109	2	Compete. Grow. Represent the Western way of life.
2	About AHSRA	about	<p><p><p><p><p><p><p><p><p><p><div class="max-w-4xl mx-auto mb-3"><h2 class="text-lg font-semibold text-ahsra-blue mb-1">Our Mission</h2><p class="text-gray-700 leading-snug">AHSRA provides student-athletes the opportunity to compete in professional-style rodeo events while developing responsibility, discipline, and respect for the Western way of life. Through competition, education, and community involvement, AHSRA prepares youth for success both inside and outside the arena.</p></div><div class="max-w-5xl mx-auto mb-3"><h2 class="text-lg font-semibold text-ahsra-blue mb-2">Divisions</h2><div class="grid grid-cols-2 gap-3"><div class="border rounded bg-white p-4"><h3 class="font-semibold text-sm mb-1">Junior High Division</h3><p class="text-sm text-gray-700">Designed for younger competitors to learn rodeo fundamentals, sportsmanship, and competition in a supportive environment.</p></div><div class="border rounded bg-white p-4"><h3 class="font-semibold text-sm mb-1">High School Division</h3><p class="text-sm text-gray-700">Competitive rodeo events for high school athletes, serving as a pathway to state finals, national competition, and scholarship opportunities.</p></div></div></div><div class="max-w-4xl mx-auto"><h2 class="text-lg font-semibold text-ahsra-blue mb-1">Governance & Leadership</h2><p class="text-gray-700 leading-snug">AHSRA is governed by elected officers, board members, and volunteers who work together to uphold the association's bylaws, manage events, and ensure a fair and positive experience for all members.</p></div></div></p></p></p></p></p></p></p></p></p></p>	published	t	t	2	f	standard	null	\N	2026-03-05 12:53:07.731	2026-03-10 14:56:00.86	2	We are dedicated to promoting youth rodeo, leadership, and sportsmanship throughout Alabama.
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Document" (id, "tenantId", title, description, category, "fileUrl", "isPublic", "sortOrder", "createdAt") FROM stdin;
1	2	NHSRA Rulebook	\N	GOVERNANCE	/uploads/tenants/ahsra/documents/1773958753387-2024-26-NHSRA-Rulebook.pdf	t	0	2026-03-19 22:20:42.867
2	2	How To Become A Member	\N	MEMBERSHIP	/uploads/tenants/ahsra/documents/1773964773088-AHSRA-member-howto.pdf	t	0	2026-03-19 23:59:35.69
3	2	AHSRA Bylaws	\N	GOVERNANCE	/uploads/tenants/ahsra/documents/1773964800591-AHSRA-By-Laws-Updated-080117.pdf	t	0	2026-03-20 00:00:02.198
\.


--
-- Data for Name: GalleryAlbum; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."GalleryAlbum" (id, title, "seasonId", "coverImage", published, "createdAt", "tenantId") FROM stdin;
1	2025 - 2026 Season	1	\N	t	2026-01-29 03:26:53.415	2
\.


--
-- Data for Name: GalleryImage; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."GalleryImage" (id, "albumId", "imageUrl", caption, "sortOrder", "createdAt") FROM stdin;
10	1	1769701360195.png	\N	0	2026-01-29 15:42:40
11	1	1769701367866.png	\N	0	2026-01-29 15:42:47
12	1	1769701374239.png	\N	0	2026-01-29 15:42:54
13	1	1769701382461.jpg	\N	0	2026-01-29 15:43:02
14	1	gallery-1.jpg	\N	0	2026-02-16 19:06:31
17	1	gallery-1-1773289972209-557067111.png	\N	0	2026-03-12 04:32:52.561
\.


--
-- Data for Name: Location; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Location" (id, name, "streetAddress", city, state, zip, "venueInfo", "createdAt", "tenantId") FROM stdin;
3	Covington County Arena	24000 AL Hwy 55	Andalusia	AL	36420	{}	2026-01-26 23:53:33.509	2
4	Georgia National Fairgrounds	401 Larry Walker Pkwy	Perry	GA	31069	{"notes": "", "stalls": "", "hookups": "", "parking": ""}	2026-01-29 19:55:21.165	2
5	Double Nickel Ranch	6065 CR-55	Columbia	AL	36319	{"notes": "", "stalls": "", "hookups": "", "parking": ""}	2026-01-29 22:33:31.421	2
2	Garrett Coliseum	1555 Federal Drive	Montgomery	AL	36104	{"notes": "no overnight tie-outs", "stalls": "Stalls - $25 a day", "hookups": "RV Hookups - $40 / Night + $3 cc fee", "parking": ""}	2026-01-25 22:03:38.28	2
\.


--
-- Data for Name: Officer; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Officer" (id, name, role, type, email, phone, "seasonId", active, "createdAt", "tenantId") FROM stdin;
3	Tommy Turner	PRESIDENT	EXECUTIVE	tbtnbama@aol.com	2053655771	2	t	2026-01-30 23:16:00.171	2
4	Darrin Gardner	VICE_PRESIDENT	EXECUTIVE	\N	\N	2	t	2026-01-30 23:16:56.219	2
5	Rusty Daniel	SECOND_VICE_PRESIDENT	EXECUTIVE	\N	\N	2	t	2026-01-30 23:17:14.237	2
6	Kim Defelix	SECRETARY	EXECUTIVE	ahsra.secretary01@gmail.com	8502093274	2	t	2026-01-30 23:18:04.453	2
7	Jordan Moore	TREASURER	EXECUTIVE	jordanmoore.ahsra@yahoo.com	8506931531	2	t	2026-01-30 23:18:54.054	2
8	Brandi Black	POINTS_SECRETARY	EXECUTIVE	ahsrapointssecretary@gmail.com	3347344849	2	t	2026-01-30 23:19:36.914	2
9	Brooke Vice	QUEEN	STUDENT	\N	\N	2	t	2026-01-30 23:19:56.972	2
10	Maddie Moore	JH_PRINCESS	STUDENT	\N	\N	2	t	2026-01-30 23:20:10.973	2
11	Peyton Black	STUDENT_PRESIDENT	STUDENT	\N	\N	2	t	2026-01-30 23:20:28.677	2
12	Madilyn Hoffman	STUDENT_VICE_PRESIDENT	STUDENT	\N	\N	2	t	2026-01-30 23:20:50.876	2
13	Georgia Cauthen	STUDENT_SECRETARY	STUDENT	\N	\N	2	t	2026-01-30 23:21:17.842	2
\.


--
-- Data for Name: PointsEntry; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."PointsEntry" (id, "tenantId", "seasonId", "rodeoId", "athleteId", "entryId", event, "goNumber", points, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Rodeo; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Rodeo" (id, name, slug, "startDate", "endDate", "tenantId", "seasonId", "locationId", "callInPolicyId", "generalInfo", specials, "isStateFinals", status, "createdAt", "goCount") FROM stdin;
8	October	october	2025-10-11 00:00:00	2025-10-12 00:00:00	2	1	3	\N	\N	\N	f	published	2026-01-28 19:27:53.82	1
12	February	february	2026-02-21 00:00:00	2026-02-22 00:00:00	2	1	3	\N	\N	\N	f	published	2026-01-28 19:29:46.793	1
7	September	september	2025-09-06 00:00:00	2025-09-07 00:00:00	2	1	3	\N	\N	\N	f	published	2026-01-28 19:27:29.703	1
10	January	january	2026-01-17 00:00:00	2026-01-18 00:00:00	2	1	5	\N	\N	\N	f	published	2026-01-28 19:28:54.22	1
6	April Rodeo	april	2026-04-18 00:00:00	2026-04-19 00:00:00	2	1	3	\N	\N	\N	f	published	2026-01-26 23:52:02.433	1
16	HS Finals	june	2026-06-03 00:00:00	2026-06-07 00:00:00	2	1	3	\N	\N	\N	f	published	2026-01-28 19:31:50.311	1
9	November	november	2025-11-06 00:00:00	2025-11-09 00:00:00	2	1	4	\N	\N	\N	f	published	2026-01-28 19:28:22.611	1
15	HS Rodeo & JH Finals	may	2026-04-30 00:00:00	2026-05-03 00:00:00	2	1	3	\N	\N	null	f	published	2026-01-28 19:31:26.643	1
13	SLE	sle	2026-03-15 00:00:00	2026-03-15 00:00:00	2	1	2	\N	\N	null	f	published	2026-01-28 19:30:11.152	1
17	Make Up	april2	2026-04-11 00:00:00	2026-04-12 00:00:00	2	1	3	\N	\N	null	f	published	2026-03-02 18:59:39.515	1
\.


--
-- Data for Name: RodeoContact; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."RodeoContact" (id, "rodeoId", "contactRole", "officerRole", "createdAt") FROM stdin;
\.


--
-- Data for Name: RodeoEntry; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."RodeoEntry" (id, "tenantId", "seasonId", "rodeoId", "athleteId", event, "goNumber", "createdAt") FROM stdin;
\.


--
-- Data for Name: RodeoScheduleItem; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."RodeoScheduleItem" (id, "rodeoId", label, date, "startTime", notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: Season; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Season" (id, year, "startDate", "endDate", active, "createdAt", "tenantId") FROM stdin;
1	2025 - 2026 Season	2025-08-01 00:00:00	2026-07-31 00:00:00	t	2026-03-03 02:18:59.947	1
2	2025 - 2026 Season	2025-08-01 00:00:00	2026-07-31 00:00:00	t	2026-03-03 02:19:08.448	2
\.


--
-- Data for Name: Sponsor; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Sponsor" (id, name, "logoUrl", "bannerUrl", website, description, "contactName", "contactEmail", "contactPhone", active, "internalNotes", "createdAt", "updatedAt", "tenantId") FROM stdin;
7	Custom Construction	\N	\N	\N	Custom Home Builder in Central Alabama	Tommy	tommy@tommy.com	2055551212	t	\N	2026-02-13 02:03:46.007	2026-02-15 02:45:52.765	2
22	BEX	1771965442564-bex.png	1771965442676-bex.png	https://www.bexsunglasses.com/	\N	\N	\N	\N	t	\N	2026-02-24 20:37:22.459	2026-02-24 20:37:22.681	2
23	Smarty	1771965759590-smarty.png	1771965759796-smarty.png	https://www.smartyrodeo.com/	\N	\N	\N	\N	t	\N	2026-02-24 20:42:39.259	2026-02-24 20:42:39.856	2
17	L & W Installation & Coatings Inc	1771344551948-L&W.jpg	1771344552095-L&W.jpg	\N	\N	\N	\N	\N	t	\N	2026-02-17 16:09:11.76	2026-02-17 16:09:12.105	2
24	Hyer	1771965823463-hyer.png	1771965823680-hyer.png	https://hyerboots.com/	\N	\N	\N	\N	t	\N	2026-02-24 20:43:43.295	2026-02-24 20:43:43.696	2
25	Turtlebox	1771965941728-turtlebox.png	1771965941983-turtlebox.png	https://turtleboxaudio.com/	\N	\N	\N	\N	t	\N	2026-02-24 20:45:41.574	2026-02-24 20:45:41.998	2
10	Large Animal Services	1771260359786-Alabama.png	1771260359988-Alabama.png	\N	\N	\N	\N	\N	t	\N	2026-02-15 16:49:17.317	2026-02-16 16:46:00.035	2
26	Weatherby	1771967667338-weatherby.png	1771967667554-weatherby.png	https://weatherby.com/	\N	\N	\N	\N	t	\N	2026-02-24 21:14:27.135	2026-02-24 21:14:27.574	2
27	Professional Choice	1771967820407-prochoice.png	1771967820895-prochoice.png	https://profchoice.com/	\N	\N	\N	\N	t	\N	2026-02-24 21:16:59.977	2026-02-24 21:17:01	2
6	Knowles Realty	1771281704450-knowlesrealty800.png	1771281704585-knowlesrealty1200.png	https://www.knowlesrealty.net	\N	\N	\N	\N	t	\N	2026-02-13 01:08:46.102	2026-02-16 22:41:44.6	2
19	Zero FG	1771344823671-Zero FG Banner.png	1771344825702-Zero FG Banner.png	https://www.ZeroFGenergy.com	\N	\N	\N	\N	t	\N	2026-02-17 16:13:41.511	2026-02-17 16:24:28.492	2
18	SGO	1771344776156-SGO banner.jpeg	1771344776562-SGO banner.jpeg	https://www.sgogunsandammo.com	\N	\N	\N	\N	t	\N	2026-02-17 16:12:55.889	2026-02-17 16:30:12.564	2
20	Bulls, Bands and Barrels	1771345353293-BBB (1200 x 800 px).png	1771345323118-BBB (1200 x 800 px).png	https://bullsbandsandbarrels.com/	\N	\N	\N	\N	t	\N	2026-02-17 16:17:52.863	2026-02-17 16:30:52.417	2
16	Advanced Environmental Recycling	1771344502366-Advanced Environmental Recycling.jpeg	1771344502670-Advanced Environmental Recycling.jpeg	https://www.facebook.com/AdvancedlRecycling/	\N	\N	\N	251-296-3040	t	\N	2026-02-17 16:08:22.1	2026-02-17 16:32:41.834	2
15	Anderson Columbia Co Inc	1771344270242-ac_logo.jpg	1771344270586-ac_logo.jpg	https://www.andersoncolumbia.com/	\N	\N	\N	\N	t	\N	2026-02-17 16:04:29.962	2026-02-17 16:35:50.475	2
11	David's Catfish House	1771296862203-davids.png	1771296862540-davids.png	https://www.davidscatfishandalusia.com/	Catfish and more	david	davd@david.com	205-555-1212	t	\N	2026-02-15 18:49:25.552	2026-02-17 21:52:20.126	2
9	Tractor Supply	1771296379032-tsc.png	1771296379434-tsc.png	https://www.tractorsupply.com/	\N	\N	\N	\N	t	\N	2026-02-15 16:48:43.82	2026-02-17 23:33:21.307	2
8	CINCH	1771260382759-cinch.png	1771260382866-cinch.png	https://cinchjeans.com/	\N	\N	\N	\N	t	\N	2026-02-15 16:48:18.017	2026-02-17 23:33:55.627	2
28	Yeti	1771967865349-yeti.png	1771967865464-yeti.png	https://www.yeti.com	\N	\N	\N	\N	t	\N	2026-02-24 21:17:45.207	2026-02-24 21:17:45.472	2
21	American Hat Company	1771965316850-american.png	1771965317310-american.png	https://americanhat.net/	\N	\N	\N	\N	t	\N	2026-02-24 20:35:16.378	2026-02-24 20:35:17.576	2
\.


--
-- Data for Name: Sponsorship; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Sponsorship" (id, "sponsorId", level, "startDate", "endDate", "contentType", "contentId", priority, active, "createdAt", "updatedAt") FROM stdin;
9	19	FEATURED	2026-02-17 00:00:00	2026-07-31 00:00:00	RODEO	12	0	t	2026-02-17 16:38:20.18	2026-02-17 23:30:16.433
11	16	FEATURED	2026-02-15 00:00:00	2026-07-31 00:00:00	SEASON	12	0	t	2026-02-17 16:39:10.428	2026-02-17 23:30:36.285
1	11	PREMIER	2026-02-09 00:00:00	2026-02-23 00:00:00	SEASON	\N	0	t	2026-02-16 03:24:01.101	2026-02-17 23:31:08.663
8	18	FEATURED	2026-02-15 00:00:00	2026-07-31 00:00:00	SEASON	\N	0	t	2026-02-17 16:37:56.445	2026-02-17 23:31:14.072
12	28	PREMIER	2025-01-01 00:00:00	2036-12-31 00:00:00	\N	\N	0	t	2026-02-24 21:19:48.499	2026-02-24 21:19:48.499
10	20	PREMIER	2026-02-15 00:00:00	2026-07-31 00:00:00	SEASON	\N	0	t	2026-02-17 16:38:39.447	2026-02-24 21:20:09.13
6	15	PREMIER	2026-02-17 00:00:00	2026-07-31 00:00:00	SEASON	12	0	t	2026-02-17 16:06:07.867	2026-02-24 21:20:41.849
7	17	SUPPORTER	2026-02-15 00:00:00	2026-07-31 00:00:00	SEASON	\N	0	t	2026-02-17 16:36:41.67	2026-02-24 21:20:59.141
3	8	PREMIER	2025-01-01 00:00:00	2036-12-31 00:00:00	\N	12	0	t	2026-02-16 15:56:35.784	2026-02-24 21:21:45.414
13	27	PREMIER	2025-01-01 00:00:00	2036-12-31 00:00:00	\N	\N	0	t	2026-02-24 21:22:34.049	2026-02-24 21:22:34.049
14	21	PREMIER	2025-01-01 00:00:00	2036-12-31 00:00:00	\N	\N	0	t	2026-02-24 21:23:45.522	2026-02-24 21:23:45.522
15	22	PREMIER	2025-01-01 00:00:00	2036-12-31 00:00:00	\N	\N	0	t	2026-02-24 21:24:09.874	2026-02-24 21:24:09.874
16	23	PREMIER	2025-01-01 00:00:00	2036-12-31 00:00:00	\N	\N	0	t	2026-02-24 21:24:33.201	2026-02-24 21:24:33.201
17	24	PREMIER	2025-01-01 00:00:00	2036-12-31 00:00:00	\N	\N	0	t	2026-02-24 21:24:55.632	2026-02-24 21:24:55.632
18	25	PREMIER	2025-01-01 00:00:00	2036-12-31 00:00:00	\N	\N	0	t	2026-02-24 21:26:12.118	2026-02-24 21:26:12.118
4	6	PREMIER	2026-02-16 00:00:00	2026-07-31 00:00:00	ATHLETE	3	0	t	2026-02-16 22:40:45.864	2026-02-27 01:18:43.373
20	7	PREMIER	2026-02-26 00:00:00	2026-07-31 00:00:00	ATHLETE	3	0	t	2026-02-27 01:19:56.713	2026-02-27 01:19:56.713
5	9	PREMIER	2026-02-10 00:00:00	2026-07-31 00:00:00	SEASON	\N	0	f	2026-02-17 02:42:57.587	2026-02-27 16:03:07.659
\.


--
-- Data for Name: Tenant; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public."Tenant" (id, name, slug, domain, "primaryColor", "accentColor", "logoUrl", active, "createdAt", "updatedAt", "secondaryColor", theme, "heroCtaLink", "heroCtaText", "heroEnabled", "heroImageUrl", "heroSubtitle", "heroTitle") FROM stdin;
1	Youth Rodeo Demo	demo	\N	#0B2A4A	#d4af37	\N	t	2026-03-03 02:18:13.863	2026-03-12 13:26:18.634	#b22234	rodeo	demo/learn-more	Learn More	t	1773244443640-691540477.png	Supporting the Future of Rodeo	Youth Rodeo Network
2	Alabama High School Rodeo Association	ahsra	ahsra.org	#0F172A	#B22234	1773087014118-364794778.png	t	2026-03-03 02:18:33.656	2026-03-20 14:44:25.408	#3C3B6E	rodeo	/ahsra/learn-more	Learn More	t	1774017856122-476658680.png	Built on tradition. Powered by youth.	Alabama High School Rodeo Association
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: yrnet_db_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
558e80e8-9223-4283-93f8-0e78ebd87d7e	9e9c579c0fc4e430952a3143c7429bec3f28d816d4dbf3704ecc5f70b70b7b69	2026-03-03 02:17:52.625866+00	000_baseline	\N	\N	2026-03-03 02:17:52.186074+00	1
b4fd59d2-e340-46c8-9752-1fc218db5fc8	1a5763a1d84b10205649a5c5b3d4390a16cbaba5bae3e0f4419a876b29e1aaf6	2026-03-03 02:17:52.898263+00	20260218043450_init	\N	\N	2026-03-03 02:17:52.691657+00	1
07f13b95-88be-4354-bc8e-30d05e82002d	f322913345a533fbda87fa996b245ee6652142e12b7e1529f1c3be41b09017c8	2026-03-03 02:17:53.194854+00	20260218044915_add_tenant	\N	\N	2026-03-03 02:17:52.963664+00	1
23d76916-3fb7-48a2-8d1f-74746d6284a6	c16d3d5bd01ebecb1d92bf22e7c978d05ded794adcb33a34f381cdb806e36769	2026-03-03 02:17:53.607354+00	20260301045100_rename_event_to_rodeo	\N	\N	2026-03-03 02:17:53.259945+00	1
2a0b4837-9b51-4377-893b-2e002c4372bb	1db77f69e2ef8d75d4c6ab3ec3ed7e2f4523f398584dfa3e0e54b023245ce500	2026-03-03 02:17:53.890669+00	20260302180159_add_rodeo_entry_and_points	\N	\N	2026-03-03 02:17:53.672262+00	1
c2174843-628e-40f8-a086-17369ff67c65	07fa09b192cf2f183b4a83a4ec6770bd35a92a8a627628e26d2675b297e232bf	2026-03-04 22:40:24.732434+00	20260304224024_tenant_theme_colors	\N	\N	2026-03-04 22:40:24.551687+00	1
\.


--
-- Name: Announcement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Announcement_id_seq"', 13, true);


--
-- Name: Athlete_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Athlete_id_seq"', 8, true);


--
-- Name: CallInPolicy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."CallInPolicy_id_seq"', 1, false);


--
-- Name: CustomPage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."CustomPage_id_seq"', 4, true);


--
-- Name: Document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Document_id_seq"', 3, true);


--
-- Name: GalleryAlbum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."GalleryAlbum_id_seq"', 1, true);


--
-- Name: GalleryImage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."GalleryImage_id_seq"', 17, true);


--
-- Name: Location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Location_id_seq"', 5, true);


--
-- Name: Officer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Officer_id_seq"', 13, true);


--
-- Name: PointsEntry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."PointsEntry_id_seq"', 1, false);


--
-- Name: RodeoContact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."RodeoContact_id_seq"', 1, false);


--
-- Name: RodeoEntry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."RodeoEntry_id_seq"', 1, false);


--
-- Name: RodeoScheduleItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."RodeoScheduleItem_id_seq"', 1, false);


--
-- Name: Rodeo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Rodeo_id_seq"', 1, false);


--
-- Name: Season_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Season_id_seq"', 3, true);


--
-- Name: Sponsor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Sponsor_id_seq"', 28, true);


--
-- Name: Sponsorship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Sponsorship_id_seq"', 20, true);


--
-- Name: Tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: yrnet_db_user
--

SELECT pg_catalog.setval('public."Tenant_id_seq"', 2, true);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: Athlete Athlete_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Athlete"
    ADD CONSTRAINT "Athlete_pkey" PRIMARY KEY (id);


--
-- Name: CallInPolicy CallInPolicy_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."CallInPolicy"
    ADD CONSTRAINT "CallInPolicy_pkey" PRIMARY KEY (id);


--
-- Name: CustomPage CustomPage_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."CustomPage"
    ADD CONSTRAINT "CustomPage_pkey" PRIMARY KEY (id);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: GalleryAlbum GalleryAlbum_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."GalleryAlbum"
    ADD CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY (id);


--
-- Name: GalleryImage GalleryImage_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."GalleryImage"
    ADD CONSTRAINT "GalleryImage_pkey" PRIMARY KEY (id);


--
-- Name: Location Location_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY (id);


--
-- Name: Officer Officer_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Officer"
    ADD CONSTRAINT "Officer_pkey" PRIMARY KEY (id);


--
-- Name: PointsEntry PointsEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."PointsEntry"
    ADD CONSTRAINT "PointsEntry_pkey" PRIMARY KEY (id);


--
-- Name: RodeoContact RodeoContact_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoContact"
    ADD CONSTRAINT "RodeoContact_pkey" PRIMARY KEY (id);


--
-- Name: RodeoEntry RodeoEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoEntry"
    ADD CONSTRAINT "RodeoEntry_pkey" PRIMARY KEY (id);


--
-- Name: RodeoScheduleItem RodeoScheduleItem_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoScheduleItem"
    ADD CONSTRAINT "RodeoScheduleItem_pkey" PRIMARY KEY (id);


--
-- Name: Rodeo Rodeo_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Rodeo"
    ADD CONSTRAINT "Rodeo_pkey" PRIMARY KEY (id);


--
-- Name: Season Season_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Season"
    ADD CONSTRAINT "Season_pkey" PRIMARY KEY (id);


--
-- Name: Sponsor Sponsor_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Sponsor"
    ADD CONSTRAINT "Sponsor_pkey" PRIMARY KEY (id);


--
-- Name: Sponsorship Sponsorship_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Sponsorship"
    ADD CONSTRAINT "Sponsorship_pkey" PRIMARY KEY (id);


--
-- Name: Tenant Tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "Tenant_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Athlete_slug_tenantId_key; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE UNIQUE INDEX "Athlete_slug_tenantId_key" ON public."Athlete" USING btree (slug, "tenantId");


--
-- Name: CustomPage_slug_tenantId_key; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE UNIQUE INDEX "CustomPage_slug_tenantId_key" ON public."CustomPage" USING btree (slug, "tenantId");


--
-- Name: PointsEntry_athleteId_idx; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE INDEX "PointsEntry_athleteId_idx" ON public."PointsEntry" USING btree ("athleteId");


--
-- Name: PointsEntry_entryId_key; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE UNIQUE INDEX "PointsEntry_entryId_key" ON public."PointsEntry" USING btree ("entryId");


--
-- Name: PointsEntry_tenantId_seasonId_rodeoId_event_goNumber_idx; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE INDEX "PointsEntry_tenantId_seasonId_rodeoId_event_goNumber_idx" ON public."PointsEntry" USING btree ("tenantId", "seasonId", "rodeoId", event, "goNumber");


--
-- Name: RodeoEntry_athleteId_idx; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE INDEX "RodeoEntry_athleteId_idx" ON public."RodeoEntry" USING btree ("athleteId");


--
-- Name: RodeoEntry_rodeoId_athleteId_event_goNumber_key; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE UNIQUE INDEX "RodeoEntry_rodeoId_athleteId_event_goNumber_key" ON public."RodeoEntry" USING btree ("rodeoId", "athleteId", event, "goNumber");


--
-- Name: RodeoEntry_tenantId_seasonId_rodeoId_event_goNumber_idx; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE INDEX "RodeoEntry_tenantId_seasonId_rodeoId_event_goNumber_idx" ON public."RodeoEntry" USING btree ("tenantId", "seasonId", "rodeoId", event, "goNumber");


--
-- Name: Rodeo_slug_tenantId_key; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE UNIQUE INDEX "Rodeo_slug_tenantId_key" ON public."Rodeo" USING btree (slug, "tenantId");


--
-- Name: Season_year_tenantId_key; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE UNIQUE INDEX "Season_year_tenantId_key" ON public."Season" USING btree (year, "tenantId");


--
-- Name: Sponsorship_contentType_contentId_idx; Type: INDEX; Schema: public; Owner: yrnet_db_user
--

CREATE INDEX "Sponsorship_contentType_contentId_idx" ON public."Sponsorship" USING btree ("contentType", "contentId");


--
-- Name: Announcement Announcement_rodeoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES public."Rodeo"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcement Announcement_seasonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES public."Season"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Announcement Announcement_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Athlete Athlete_seasonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Athlete"
    ADD CONSTRAINT "Athlete_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES public."Season"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Athlete Athlete_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Athlete"
    ADD CONSTRAINT "Athlete_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CallInPolicy CallInPolicy_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."CallInPolicy"
    ADD CONSTRAINT "CallInPolicy_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CustomPage CustomPage_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."CustomPage"
    ADD CONSTRAINT "CustomPage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GalleryAlbum GalleryAlbum_seasonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."GalleryAlbum"
    ADD CONSTRAINT "GalleryAlbum_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES public."Season"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GalleryAlbum GalleryAlbum_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."GalleryAlbum"
    ADD CONSTRAINT "GalleryAlbum_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GalleryImage GalleryImage_albumId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."GalleryImage"
    ADD CONSTRAINT "GalleryImage_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES public."GalleryAlbum"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Location Location_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Officer Officer_seasonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Officer"
    ADD CONSTRAINT "Officer_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES public."Season"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Officer Officer_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Officer"
    ADD CONSTRAINT "Officer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PointsEntry PointsEntry_athleteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."PointsEntry"
    ADD CONSTRAINT "PointsEntry_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES public."Athlete"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PointsEntry PointsEntry_entryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."PointsEntry"
    ADD CONSTRAINT "PointsEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES public."RodeoEntry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PointsEntry PointsEntry_rodeoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."PointsEntry"
    ADD CONSTRAINT "PointsEntry_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES public."Rodeo"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PointsEntry PointsEntry_seasonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."PointsEntry"
    ADD CONSTRAINT "PointsEntry_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES public."Season"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PointsEntry PointsEntry_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."PointsEntry"
    ADD CONSTRAINT "PointsEntry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RodeoContact RodeoContact_rodeoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoContact"
    ADD CONSTRAINT "RodeoContact_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES public."Rodeo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RodeoEntry RodeoEntry_athleteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoEntry"
    ADD CONSTRAINT "RodeoEntry_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES public."Athlete"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RodeoEntry RodeoEntry_rodeoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoEntry"
    ADD CONSTRAINT "RodeoEntry_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES public."Rodeo"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RodeoEntry RodeoEntry_seasonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoEntry"
    ADD CONSTRAINT "RodeoEntry_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES public."Season"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RodeoEntry RodeoEntry_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoEntry"
    ADD CONSTRAINT "RodeoEntry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RodeoScheduleItem RodeoScheduleItem_rodeoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."RodeoScheduleItem"
    ADD CONSTRAINT "RodeoScheduleItem_rodeoId_fkey" FOREIGN KEY ("rodeoId") REFERENCES public."Rodeo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Rodeo Rodeo_callInPolicyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Rodeo"
    ADD CONSTRAINT "Rodeo_callInPolicyId_fkey" FOREIGN KEY ("callInPolicyId") REFERENCES public."CallInPolicy"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Rodeo Rodeo_locationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Rodeo"
    ADD CONSTRAINT "Rodeo_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES public."Location"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Rodeo Rodeo_seasonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Rodeo"
    ADD CONSTRAINT "Rodeo_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES public."Season"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Rodeo Rodeo_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Rodeo"
    ADD CONSTRAINT "Rodeo_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Season Season_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Season"
    ADD CONSTRAINT "Season_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sponsor Sponsor_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Sponsor"
    ADD CONSTRAINT "Sponsor_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sponsorship Sponsorship_sponsorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: yrnet_db_user
--

ALTER TABLE ONLY public."Sponsorship"
    ADD CONSTRAINT "Sponsorship_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES public."Sponsor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: yrnet_db_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO yrnet_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO yrnet_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO yrnet_db_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO yrnet_db_user;


--
-- PostgreSQL database dump complete
--

\unrestrict yxGv17fbwrV9DvjFKimt1QQvN5LNTIHNb7JiS7OH0aWaNlzpflWvLb7lzDxneMt

