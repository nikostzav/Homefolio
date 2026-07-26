--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Name: post_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.post_type AS ENUM (
    'buy',
    'rent'
);


--
-- Name: property_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.property_type AS ENUM (
    'apartment',
    'house',
    'condo',
    'land'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Chat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Chat" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user1 uuid NOT NULL,
    user2 uuid NOT NULL,
    lastmessage text,
    username text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    roomid uuid,
    seenby uuid[] DEFAULT '{}'::uuid[],
    CONSTRAINT different_users CHECK ((user1 <> user2))
);


--
-- Name: Message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Message" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    text text NOT NULL,
    userid uuid,
    createdat timestamp with time zone DEFAULT now() NOT NULL,
    seen boolean DEFAULT false,
    receiver uuid,
    username text,
    roomid uuid,
    chatid uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: Post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Post" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    price integer NOT NULL,
    images text[],
    address character varying(255),
    city character varying(100),
    bedroom integer,
    bathroom integer,
    latitude character varying(50),
    longitude character varying(50),
    type public.post_type NOT NULL,
    property public.property_type NOT NULL,
    createdat timestamp with time zone DEFAULT now() NOT NULL,
    userid uuid
);


--
-- Name: PostDetail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PostDetail" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    description text NOT NULL,
    utilities text,
    pet character varying(255),
    income character varying(255),
    size integer,
    school integer,
    bus integer,
    restaurant integer,
    postid uuid
);


--
-- Name: SavedPost; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SavedPost" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    userid uuid,
    postid uuid,
    createdat timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    password text NOT NULL,
    avatar character varying(255),
    createdat timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: UserCriteria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserCriteria" (
    id integer NOT NULL,
    user_id uuid,
    bedroom boolean DEFAULT false,
    bathroom boolean DEFAULT false,
    price boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: UserCriteria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."UserCriteria_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: UserCriteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."UserCriteria_id_seq" OWNED BY public."UserCriteria".id;


--
-- Name: UserCriteria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserCriteria" ALTER COLUMN id SET DEFAULT nextval('public."UserCriteria_id_seq"'::regclass);


--
-- Name: Chat Chat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: PostDetail PostDetail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PostDetail"
    ADD CONSTRAINT "PostDetail_pkey" PRIMARY KEY (id);


--
-- Name: PostDetail PostDetail_postid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PostDetail"
    ADD CONSTRAINT "PostDetail_postid_key" UNIQUE (postid);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: SavedPost SavedPost_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SavedPost"
    ADD CONSTRAINT "SavedPost_pkey" PRIMARY KEY (id);


--
-- Name: UserCriteria UserCriteria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserCriteria"
    ADD CONSTRAINT "UserCriteria_pkey" PRIMARY KEY (id);


--
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: User User_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_username_key" UNIQUE (username);


--
-- Name: SavedPost unique_savedpost; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SavedPost"
    ADD CONSTRAINT unique_savedpost UNIQUE (userid, postid);


--
-- Name: idx_message_userid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_message_userid ON public."Message" USING btree (userid);


--
-- Name: Message Message_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_userid_fkey" FOREIGN KEY (userid) REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- Name: PostDetail PostDetail_postid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PostDetail"
    ADD CONSTRAINT "PostDetail_postid_fkey" FOREIGN KEY (postid) REFERENCES public."Post"(id) ON DELETE CASCADE;


--
-- Name: Post Post_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_userid_fkey" FOREIGN KEY (userid) REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- Name: SavedPost SavedPost_postid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SavedPost"
    ADD CONSTRAINT "SavedPost_postid_fkey" FOREIGN KEY (postid) REFERENCES public."Post"(id) ON DELETE CASCADE;


--
-- Name: SavedPost SavedPost_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SavedPost"
    ADD CONSTRAINT "SavedPost_userid_fkey" FOREIGN KEY (userid) REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- Name: UserCriteria UserCriteria_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserCriteria"
    ADD CONSTRAINT "UserCriteria_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- Demo login account (owns no listings itself - use it to browse, save
-- listings, and message any of the agents below).
-- Username: demo_agent  Password: password123
--
-- Seeded real-estate agents (all share the same password, for trying out
-- real-time chat by logging in as two different accounts in two browsers).
--
INSERT INTO public."User" (id, email, username, password, avatar, createdat) VALUES
('a0000000-0000-4000-8000-000000000001', 'demo@example.com', 'demo_agent', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now()),
('fc73bf6e-5ee5-402b-980e-b7c5a6dcbb03', 'sarah.mitchell@homefolio-demo.com', 'sarah.mitchell', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now()),
('24ed4b12-d870-432a-a9de-87801e7db158', 'michael.chen@homefolio-demo.com', 'michael.chen', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now()),
('91bb9d2f-39ec-4999-9425-74d456411dd8', 'david.thompson@homefolio-demo.com', 'david.thompson', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now()),
('71d2ab3f-e70f-4f8d-916d-f864aa5d8373', 'priya.sharma@homefolio-demo.com', 'priya.sharma', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now()),
('06a7d500-d495-44ca-ba8a-32c03a62179c', 'emily.rodriguez@homefolio-demo.com', 'emily.rodriguez', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now()),
('d197f00a-bc84-4974-85cc-8d80b1bed3c8', 'james.anderson@homefolio-demo.com', 'james.anderson', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now()),
('411d4eae-cdc8-4ae0-9f45-2f11ff4f12cd', 'olivia.bennett@homefolio-demo.com', 'olivia.bennett', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now());

-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Post" (id, title, price, images, address, city, bedroom, bathroom, latitude, longitude, type, property, createdat, userid) FROM stdin;
6edcbedf-247e-4e3e-a4ac-1ee3002063a0	Luxury Apartment	300000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599222/pexels-mtk402-2098913_n2w5yg.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599219/pexels-quang-nguyen-vinh-222549-2134224_gcinnc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599219/pexels-pixabay-259962_vkjddd.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599214/pexels-falling4utah-2724748_vydpmc.jpg}	123 Downtown Ave	New York	3	2	40.7128	-74.0060	buy	apartment	2024-09-29 11:42:29.797823+03	fc73bf6e-5ee5-402b-980e-b7c5a6dcbb03
f1b0f921-09f2-4d55-a70d-239f7cfbc311	Cozy House	250000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599194/pexels-emrecan-2079249_pvt6te.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599210/pexels-pixabay-164522_nlqzim.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-vika-glitter-392079-1648776_ijcskt.jpg}	456 Suburb St	San Francisco	4	3	37.7749	-122.4194	buy	house	2024-09-29 11:49:13.480295+03	24ed4b12-d870-432a-a9de-87801e7db158
b86aed7b-326a-450b-823b-526a86c978bc	Modern Condo	450000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixasquare-1115804_masjkp.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-falling4utah-2724749_bd1qr7.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599215/pexels-huy-phan-316220-2826787_zuqvtb.jpg}	789 Uptown Blvd	Chicago	2	1	41.8781	-87.6298	buy	condo	2024-09-29 11:53:44.083216+03	91bb9d2f-39ec-4999-9425-74d456411dd8
83449669-7a5e-4724-98ce-3ed54153000e	Spacious House	600000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-vika-glitter-392079-1648776_ijcskt.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg}	321 Country Rd	Austin	5	4	30.2672	-97.7431	buy	house	2024-09-29 11:58:05.100133+03	91bb9d2f-39ec-4999-9425-74d456411dd8
ce5d0f81-a21b-460b-a4a8-f8f553f870f8	Modern Condo in Downtown	300000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462020/samples/man-on-a-street.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462020/samples/chair-and-coffee-table.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462013/samples/ecommerce/accessories-bag.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462012/samples/landscapes/architecture-signs.jpg}	456 High St	Los Angeles	3	2	37.9839	23.7275	buy	condo	2024-09-26 19:35:11.417271+03	71d2ab3f-e70f-4f8d-916d-f864aa5d8373
38469a56-a8e6-4803-897a-b8c2f28e1e22	Spacious House	600000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670605/digital-marketing-agency-ntwrk-g39p1kDjvSY-unsplash_z4fq8b.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670594/stephanie-harvey-PPA6wsuedeM-unsplash_wcvzum.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670593/avery-klein-JaXs8Tk5Iww-unsplash_yvxqxj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670601/sonnie-hiles-L0BaowhFe4c-unsplash_kld9ip.jpg}	321 Country Rd	Athens	5	4	37.9838	23.7275	buy	house	2024-09-30 07:32:16.6477+03	06a7d500-d495-44ca-ba8a-32c03a62179c
05c2a58e-468b-4628-99a8-b3aa71cca792	Affordable studio apartment in a vibrant neighborhood, perfect for singles.	30000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670588/webaliser-_TPTXZd9mOo-unsplash_q5596b.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670591/hutomo-abrianto-9mPl0Zo7_gQ-unsplash_qjapnf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670585/hutomo-abrianto-X5BWooeO4Cw-unsplash_yrihrj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670584/frames-for-your-heart-JDBVXignFdA-unsplash_t1k3oc.jpg}	123 Main St	Thessaloniki	1	1	40.6401	22.9444	rent	apartment	2024-09-30 07:39:41.07755+03	06a7d500-d495-44ca-ba8a-32c03a62179c
dc9f18ff-2ef0-46b3-b2b1-0a8e0984e10a	Luxury Villa	900000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670581/travel-cents-WYLuNY5JG4E-unsplash_uyxiuc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670582/dane-deaner-qRfMB-IOQjE-unsplash_pq0hb3.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599222/pexels-mtk402-2098913_n2w5yg.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599214/pexels-pixabay-271649_ntujjf.jpg}	456 Luxury Rd	Mykonos	6	5	37.4479	25.3289	buy	house	2024-09-30 07:39:41.07755+03	d197f00a-bc84-4974-85cc-8d80b1bed3c8
031c1dc2-7862-4261-b0ed-ae62aa1cae25	Charming Cottage	250000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670591/hutomo-abrianto-9mPl0Zo7_gQ-unsplash_qjapnf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599211/pexels-itsterrymag-2635038_aa5ihh.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-falling4utah-2724749_bd1qr7.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-vika-glitter-392079-1648776_ijcskt.jpg}	789 Peaceful Ln	Crete	3	2	35.3406	24.8092	buy	house	2024-09-30 07:39:41.07755+03	d197f00a-bc84-4974-85cc-8d80b1bed3c8
71035ac2-d1dd-48a8-b4fb-18c8e2a76b2e	Seaside Apartment	450000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670587/evelyn-paris-QR_vT8_hBZM-unsplash_kymyay.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670585/hutomo-abrianto-X5BWooeO4Cw-unsplash_yrihrj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670584/frames-for-your-heart-JDBVXignFdA-unsplash_t1k3oc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670582/dane-deaner-qRfMB-IOQjE-unsplash_pq0hb3.jpg}	101 Oceanview Dr	Corfu	2	2	39.6248	19.9210	rent	apartment	2024-09-30 07:39:41.07755+03	06a7d500-d495-44ca-ba8a-32c03a62179c
dfb5cf5a-e026-4998-b05d-4620dc35f7b2	Modern Loft	500000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670593/abby-rurenko-uOYak90r4L0-unsplash_rbhbbt.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670593/avery-klein-JaXs8Tk5Iww-unsplash_yvxqxj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599222/pexels-mtk402-2098913_n2w5yg.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599215/pexels-huy-phan-316220-2826787_zuqvtb.jpg}	202 City Center	Athens	2	1	37.9838	23.7275	buy	apartment	2024-09-30 07:39:41.07755+03	d197f00a-bc84-4974-85cc-8d80b1bed3c8
dd3c4e48-f83b-40e6-b9a3-08964a7c066c	Beachfront Condo with Ocean Views	720000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599222/pexels-mtk402-2098913_n2w5yg.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599219/pexels-quang-nguyen-vinh-222549-2134224_gcinnc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599219/pexels-pixabay-259962_vkjddd.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599214/pexels-falling4utah-2724748_vydpmc.jpg}	88 Ocean Drive	Miami	3	2	25.7617	-80.1918	buy	condo	2024-09-30 07:39:41.07755+03	fc73bf6e-5ee5-402b-980e-b7c5a6dcbb03
c6d1938b-0469-400b-8c5d-611666a4e0eb	Mountain-View Family House	540000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599194/pexels-emrecan-2079249_pvt6te.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599210/pexels-pixabay-164522_nlqzim.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-vika-glitter-392079-1648776_ijcskt.jpg}	1450 Foothills Pkwy	Denver	4	3	39.7392	-104.9903	buy	house	2024-09-30 07:39:41.07755+03	91bb9d2f-39ec-4999-9425-74d456411dd8
892b5ddd-08a3-4584-80f4-f50238fd77fd	Modern Apartment near Downtown	2400	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixasquare-1115804_masjkp.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-falling4utah-2724749_bd1qr7.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599215/pexels-huy-phan-316220-2826787_zuqvtb.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462020/samples/man-on-a-street.jpg}	210 Pike St	Seattle	2	1	47.6062	-122.3321	rent	apartment	2024-09-30 07:39:41.07755+03	24ed4b12-d870-432a-a9de-87801e7db158
4ca6f79b-5cb7-42c0-a03f-fa838fa40aba	Historic Brownstone Townhouse	780000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462020/samples/chair-and-coffee-table.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462013/samples/ecommerce/accessories-bag.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462012/samples/landscapes/architecture-signs.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670605/digital-marketing-agency-ntwrk-g39p1kDjvSY-unsplash_z4fq8b.jpg}	19 Beacon St	Boston	4	2	42.3601	-71.0589	buy	house	2024-09-30 07:39:41.07755+03	fc73bf6e-5ee5-402b-980e-b7c5a6dcbb03
59aea48f-b09d-420b-b275-142ca88af1a3	Chic Studio in the Heart of the City	1800	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670594/stephanie-harvey-PPA6wsuedeM-unsplash_wcvzum.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670593/avery-klein-JaXs8Tk5Iww-unsplash_yvxqxj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670601/sonnie-hiles-L0BaowhFe4c-unsplash_kld9ip.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670588/webaliser-_TPTXZd9mOo-unsplash_q5596b.jpg}	12 Rue de Rivoli	Paris	1	1	48.8566	2.3522	rent	apartment	2024-09-30 07:39:41.07755+03	411d4eae-cdc8-4ae0-9f45-2f11ff4f12cd
b0374e9f-01d0-4cc1-b970-ba283e83a6e4	Sunny Condo Near the Beach	395000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670591/hutomo-abrianto-9mPl0Zo7_gQ-unsplash_qjapnf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670585/hutomo-abrianto-X5BWooeO4Cw-unsplash_yrihrj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670584/frames-for-your-heart-JDBVXignFdA-unsplash_t1k3oc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670581/travel-cents-WYLuNY5JG4E-unsplash_uyxiuc.jpg}	5 Passeig de Gracia	Barcelona	2	2	41.3874	2.1686	buy	condo	2024-09-30 07:39:41.07755+03	411d4eae-cdc8-4ae0-9f45-2f11ff4f12cd
b1da6c58-4b70-451b-9284-ba7660708ef5	Prime Development Land Plot	1200000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670582/dane-deaner-qRfMB-IOQjE-unsplash_pq0hb3.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599211/pexels-itsterrymag-2635038_aa5ihh.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670587/evelyn-paris-QR_vT8_hBZM-unsplash_kymyay.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670593/abby-rurenko-uOYak90r4L0-unsplash_rbhbbt.jpg}	Al Maktoum Rd	Dubai	\N	\N	25.2048	55.2708	buy	land	2024-09-30 07:39:41.07755+03	71d2ab3f-e70f-4f8d-916d-f864aa5d8373
1c5da842-1ca4-4ca9-8546-00e98cf269c6	Charming Apartment near the Colosseum	2100	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599214/pexels-pixabay-271649_ntujjf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599222/pexels-mtk402-2098913_n2w5yg.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599219/pexels-quang-nguyen-vinh-222549-2134224_gcinnc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599219/pexels-pixabay-259962_vkjddd.jpg}	34 Via dei Fori Imperiali	Rome	2	1	41.9028	12.4964	rent	apartment	2024-09-30 07:39:41.07755+03	411d4eae-cdc8-4ae0-9f45-2f11ff4f12cd
ac816b33-560a-4239-a754-000bc766e73b	Contemporary House with Mountain Backdrop	950000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599214/pexels-falling4utah-2724748_vydpmc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599194/pexels-emrecan-2079249_pvt6te.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599210/pexels-pixabay-164522_nlqzim.jpg}	900 W Georgia St	Vancouver	5	4	49.2827	-123.1207	buy	house	2024-09-30 07:39:41.07755+03	71d2ab3f-e70f-4f8d-916d-f864aa5d8373
a1dbece0-29dc-4f6d-9f9f-0228f59bcb0a	Eco-Friendly Condo in Trendy District	1600	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-vika-glitter-392079-1648776_ijcskt.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixasquare-1115804_masjkp.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-falling4utah-2724749_bd1qr7.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599215/pexels-huy-phan-316220-2826787_zuqvtb.jpg}	77 NW Couch St	Portland	1	1	45.5152	-122.6784	rent	condo	2024-09-30 07:39:41.07755+03	24ed4b12-d870-432a-a9de-87801e7db158
\.


--
-- Data for Name: PostDetail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PostDetail" (id, description, utilities, pet, income, size, school, bus, restaurant, postid) FROM stdin;
d0d8ba75-ffbf-4c88-9b09-9f82ba42120b	Spacious 3-bedroom condo with modern finishes, located in a vibrant downtown area.	Water, Gas, Internet	No pets allowed	Minimum income: $75,000/year	1500	200	200	800	ce5d0f81-a21b-460b-a4a8-f8f553f870f8
ef268e7c-56dd-4956-8236-0b68ee3336ee	Luxury 3-bedroom apartment with modern amenities and stunning downtown views.	Water, Gas, Electricity	No pets	100000	1500	500	300	200	6edcbedf-247e-4e3e-a4ac-1ee3002063a0
86b331d4-7631-4bc1-8f2d-2a7dfb3e9ff1	Cozy 4-bedroom house in a quiet suburban neighborhood, perfect for families.	Electricity, Gas	Pet friendly	80000	2500	1000	800	1200	f1b0f921-09f2-4d55-a70d-239f7cfbc311
57da5dc3-b17b-42b8-af30-025dfe92134e	Beautiful beachfront condo with ocean views and direct access to the beach.	Water, Gas, Electricity	No pets	150000	2000	800	600	400	b86aed7b-326a-450b-823b-526a86c978bc
042ce407-62da-4e06-ba3e-2a1a1cf4cc1f	Affordable studio apartment in a vibrant neighborhood, perfect for singles.	Electricity	No pets	30000	600	400	300	250	83449669-7a5e-4724-98ce-3ed54153000e
c994b491-8d86-470a-8b6f-1584d9052882	Spacious family home with a large backyard and 4 bathrooms, ideal for gatherings.	Electricity, Gas	No pets	120000	3200	1500	1200	1000	38469a56-a8e6-4803-897a-b8c2f28e1e22
baf75805-aae1-4ddf-8361-570f12889001	Affordable studio apartment in a vibrant neighborhood, perfect for singles.	Electricity	No pets	30000	600	400	300	250	05c2a58e-468b-4628-99a8-b3aa71cca792
d1e47f46-859d-4a19-a7ed-51018f8fbea6	Luxury Villa with a private pool and stunning views.	Electricity, Gas, Internet	Pet friendly	150000	4000	1200	800	1000	dc9f18ff-2ef0-46b3-b2b1-0a8e0984e10a
1f4a3111-828c-409d-bbf9-0531c42c31f4	Cozy 2-bedroom cottage, perfect for a getaway.	Electricity, Water	No pets	50000	800	300	200	150	031c1dc2-7862-4261-b0ed-ae62aa1cae25
3bd312fb-8507-49ad-a5cc-c80ed87b7255	Modern loft with city views, suitable for professionals.	Gas, Internet	No pets	90000	1200	600	400	350	71035ac2-d1dd-48a8-b4fb-18c8e2a76b2e
55bccb05-037d-4bff-9b1f-90d243e2cd42	Charming house near the beach, ideal for families.	Electricity, Water	Pet friendly	80000	1500	800	600	500	dfb5cf5a-e026-4998-b05d-4620dc35f7b2
8cc869a8-1b75-4e5e-bed4-9a622e23d982	Stunning beachfront condo with floor-to-ceiling windows and direct ocean views, steps from the sand.	Water, Gas, Electricity	No pets	Minimum income: $95,000/year	1650	400	250	150	dd3c4e48-f83b-40e6-b9a3-08964a7c066c
149828c2-1486-432e-ba91-443c828ffa97	Spacious 4-bedroom house tucked against the foothills with a large deck and mountain views.	Electricity, Gas, Water	Pet friendly	85000	2800	900	700	600	c6d1938b-0469-400b-8c5d-611666a4e0eb
44180a8e-f63d-4967-a430-b44c0b6bd8e7	Bright 2-bedroom apartment a short walk from Pike Place Market, ideal for young professionals.	Water, Internet	No pets allowed	60000	1050	300	150	100	892b5ddd-08a3-4584-80f4-f50238fd77fd
9680b33f-9870-4366-83ff-832d26c54fd9	Restored 19th-century brownstone with original details and a modern kitchen, near Boston Common.	Gas, Electricity, Water	No pets	140000	2600	500	350	300	4ca6f79b-5cb7-42c0-a03f-fa838fa40aba
b6908da9-e808-4537-a95c-653410510a45	Elegant studio steps from the Louvre with classic Haussmann architecture and a Juliet balcony.	Water, Electricity	No pets	45000	450	200	100	50	59aea48f-b09d-420b-b275-142ca88af1a3
e9dfa5a7-f26f-4eb9-9c9f-a3592f6d41d5	Bright 2-bedroom condo two blocks from the beach with a shared rooftop terrace.	Water, Gas	Pet friendly	70000	1100	400	300	250	b0374e9f-01d0-4cc1-b970-ba283e83a6e4
b1da6c58-4b70-451b-9284-ba7660708ee6	Flat, cleared development plot in a rapidly growing district, zoned for mixed-use construction.	None connected yet	N/A	250000	8000	1500	1200	900	b1da6c58-4b70-451b-9284-ba7660708ef5
172a27cb-671b-4ac3-b5f5-0cb309ef1ed7	Cozy 2-bedroom apartment in a converted historic building, a 10-minute walk from the Colosseum.	Water, Electricity	No pets	48000	950	250	150	80	1c5da842-1ca4-4ca9-8546-00e98cf269c6
5b4e9916-476f-4f68-b2c9-9273207b5424	Expansive 5-bedroom home with a private garden and unobstructed views of the North Shore mountains.	Electricity, Gas, Water, Internet	Pet friendly	160000	3400	1100	900	700	ac816b33-560a-4239-a754-000bc766e73b
6f65cd69-d14f-4dba-bd4a-a89683a342ef	Sleek 1-bedroom condo with solar panels and EV charging, in the heart of the Pearl District.	Water, Electricity, Internet	Pet friendly	55000	700	350	200	150	a1dbece0-29dc-4f6d-9f9f-0228f59bcb0a
\.


--
-- PostgreSQL database dump complete
--


