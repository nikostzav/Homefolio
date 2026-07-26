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
-- Demo account that owns all seeded demo listings.
-- Username: demo_agent  Password: password123
--
INSERT INTO public."User" (id, email, username, password, avatar, createdat) VALUES
('a0000000-0000-4000-8000-000000000001', 'demo@example.com', 'demo_agent', '$2b$10$sm5m47gUwd5yQDdkmBBoLOeq4f5Ud.k5ARByJW8liROfOsvxo2rD6', NULL, now());

-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Post" (id, title, price, images, address, city, bedroom, bathroom, latitude, longitude, type, property, createdat, userid) FROM stdin;
6edcbedf-247e-4e3e-a4ac-1ee3002063a0	Luxury Apartment	300000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599222/pexels-mtk402-2098913_n2w5yg.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599219/pexels-quang-nguyen-vinh-222549-2134224_gcinnc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599219/pexels-pixabay-259962_vkjddd.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599214/pexels-falling4utah-2724748_vydpmc.jpg}	123 Downtown Ave	New York	3	2	40.7128	-74.0060	buy	apartment	2024-09-29 11:42:29.797823+03	a0000000-0000-4000-8000-000000000001
f1b0f921-09f2-4d55-a70d-239f7cfbc311	Cozy House	250000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599194/pexels-emrecan-2079249_pvt6te.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599210/pexels-pixabay-164522_nlqzim.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-vika-glitter-392079-1648776_ijcskt.jpg}	456 Suburb St	San Francisco	4	3	37.7749	-122.4194	buy	house	2024-09-29 11:49:13.480295+03	a0000000-0000-4000-8000-000000000001
b86aed7b-326a-450b-823b-526a86c978bc	Modern Condo	450000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixasquare-1115804_masjkp.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-falling4utah-2724749_bd1qr7.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599215/pexels-huy-phan-316220-2826787_zuqvtb.jpg}	789 Uptown Blvd	Chicago	2	1	41.8781	-87.6298	buy	condo	2024-09-29 11:53:44.083216+03	a0000000-0000-4000-8000-000000000001
83449669-7a5e-4724-98ce-3ed54153000e	Spacious House	600000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-vika-glitter-392079-1648776_ijcskt.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-pixabay-262048_gkdvbf.jpg}	321 Country Rd	Austin	5	4	30.2672	-97.7431	buy	house	2024-09-29 11:58:05.100133+03	a0000000-0000-4000-8000-000000000001
ce5d0f81-a21b-460b-a4a8-f8f553f870f8	Modern Condo in Downtown	300000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462020/samples/man-on-a-street.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462020/samples/chair-and-coffee-table.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462013/samples/ecommerce/accessories-bag.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1723462012/samples/landscapes/architecture-signs.jpg}	456 High St	Los Angeles	3	2	37.9839	23.7275	buy	condo	2024-09-26 19:35:11.417271+03	a0000000-0000-4000-8000-000000000001
38469a56-a8e6-4803-897a-b8c2f28e1e22	Spacious House	600000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670605/digital-marketing-agency-ntwrk-g39p1kDjvSY-unsplash_z4fq8b.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670594/stephanie-harvey-PPA6wsuedeM-unsplash_wcvzum.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670593/avery-klein-JaXs8Tk5Iww-unsplash_yvxqxj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670601/sonnie-hiles-L0BaowhFe4c-unsplash_kld9ip.jpg}	321 Country Rd	Athens	5	4	37.9838	23.7275	buy	house	2024-09-30 07:32:16.6477+03	a0000000-0000-4000-8000-000000000001
05c2a58e-468b-4628-99a8-b3aa71cca792	Affordable studio apartment in a vibrant neighborhood, perfect for singles.	30000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670588/webaliser-_TPTXZd9mOo-unsplash_q5596b.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670591/hutomo-abrianto-9mPl0Zo7_gQ-unsplash_qjapnf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670585/hutomo-abrianto-X5BWooeO4Cw-unsplash_yrihrj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670584/frames-for-your-heart-JDBVXignFdA-unsplash_t1k3oc.jpg}	123 Main St	Thessaloniki	1	1	40.6401	22.9444	rent	apartment	2024-09-30 07:39:41.07755+03	a0000000-0000-4000-8000-000000000001
dc9f18ff-2ef0-46b3-b2b1-0a8e0984e10a	Luxury Villa	900000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670581/travel-cents-WYLuNY5JG4E-unsplash_uyxiuc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670582/dane-deaner-qRfMB-IOQjE-unsplash_pq0hb3.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599222/pexels-mtk402-2098913_n2w5yg.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599214/pexels-pixabay-271649_ntujjf.jpg}	456 Luxury Rd	Mykonos	6	5	37.4479	25.3289	buy	house	2024-09-30 07:39:41.07755+03	a0000000-0000-4000-8000-000000000001
031c1dc2-7862-4261-b0ed-ae62aa1cae25	Charming Cottage	250000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670591/hutomo-abrianto-9mPl0Zo7_gQ-unsplash_qjapnf.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599211/pexels-itsterrymag-2635038_aa5ihh.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-falling4utah-2724749_bd1qr7.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599209/pexels-vika-glitter-392079-1648776_ijcskt.jpg}	789 Peaceful Ln	Crete	3	2	35.3406	24.8092	buy	house	2024-09-30 07:39:41.07755+03	a0000000-0000-4000-8000-000000000001
71035ac2-d1dd-48a8-b4fb-18c8e2a76b2e	Seaside Apartment	450000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670587/evelyn-paris-QR_vT8_hBZM-unsplash_kymyay.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670585/hutomo-abrianto-X5BWooeO4Cw-unsplash_yrihrj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670584/frames-for-your-heart-JDBVXignFdA-unsplash_t1k3oc.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670582/dane-deaner-qRfMB-IOQjE-unsplash_pq0hb3.jpg}	101 Oceanview Dr	Corfu	2	2	39.6248	19.9210	rent	apartment	2024-09-30 07:39:41.07755+03	a0000000-0000-4000-8000-000000000001
dfb5cf5a-e026-4998-b05d-4620dc35f7b2	Modern Loft	500000	{https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670593/abby-rurenko-uOYak90r4L0-unsplash_rbhbbt.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727670593/avery-klein-JaXs8Tk5Iww-unsplash_yvxqxj.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599222/pexels-mtk402-2098913_n2w5yg.jpg,https://res.cloudinary.com/drcgbkm5u/image/upload/v1727599215/pexels-huy-phan-316220-2826787_zuqvtb.jpg}	202 City Center	Athens	2	1	37.9838	23.7275	buy	apartment	2024-09-30 07:39:41.07755+03	a0000000-0000-4000-8000-000000000001
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
\.


--
-- PostgreSQL database dump complete
--


