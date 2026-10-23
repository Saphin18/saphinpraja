/* =========================================================
   NAYA — Nepal, Reimagined.
   Demo storefront script (vanilla JS, no build step)
   ---------------------------------------------------------
   1. IMAGES      ← replace these with the client's real photos
   2. PRODUCTS    ← catalogue (name, price, description, sizes)
   3. STRINGS     ← all English / Korean copy
   4. State & helpers
   5. Images + fallback
   6. Language
   7. Products: grid, filter, wishlist, bag
   8. Overlays: menu, search, drawer, modal
   9. Drawer views: bag → checkout → confirmed, wishlist, account
   10. Header, scroll reveal, newsletter, misc
   ========================================================= */

/* ---------- 1. IMAGES ----------
   One place for every photo on the site. To use real photos, drop them in
   an /images folder next to index.html and change the value, e.g.
     hero: "images/hero.jpg",
   If any image fails to load, an elegant ivory/burgundy placeholder with
   the section or product name appears instead (see .media.is-fallback). */
const IMAGES = {
  // Hero & sections
  hero:           "https://images.unsplash.com/photo-1659345246648-a5d3bf5aec23?auto=format&fit=crop&w=2400&q=80",
  storyMain:      "https://images.unsplash.com/photo-1638310533874-6c124c012e1d?auto=format&fit=crop&w=1400&q=80",
  storyInset:     "https://images.unsplash.com/photo-1724856605022-106d6dd6e842?auto=format&fit=crop&w=700&q=80",

  // Category cards
  catKurtha:      "https://images.unsplash.com/photo-1655288828238-21d86ec971c3?auto=format&fit=crop&w=900&q=80",
  catSaree:       "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
  catCultural:    "https://images.unsplash.com/photo-1763733595166-41745662d1a7?auto=format&fit=crop&w=900&q=80",
  catLehenga:     "https://images.unsplash.com/photo-1746372283841-dbb3838f9935?auto=format&fit=crop&w=900&q=80",

  // Occasions
  occWedding:     "https://images.unsplash.com/photo-1759906760638-eeffcb471e53?auto=format&fit=crop&w=1000&q=80",
  occFestival:    "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?auto=format&fit=crop&w=1000&q=80",
  occCelebration: "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?auto=format&fit=crop&w=1000&q=80",
  occEveryday:    "https://images.unsplash.com/photo-1676908698518-f668e302c03d?auto=format&fit=crop&w=1000&q=80",

  // Instagram grid
  insta1:         "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?auto=format&fit=crop&w=600&h=600&q=80",
  insta2:         "https://images.unsplash.com/photo-1737988007411-e85aa733efa1?auto=format&fit=crop&w=600&h=600&q=80",
  insta3:         "https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?auto=format&fit=crop&w=600&h=600&q=80",
  insta4:         "https://images.unsplash.com/photo-1643766883805-829d9ad95c42?auto=format&fit=crop&w=600&h=600&q=80",
  insta5:         "https://images.unsplash.com/photo-1769275061202-cf3ef67d7279?auto=format&fit=crop&w=600&h=600&q=80",
  insta6:         "https://images.unsplash.com/photo-1668371679302-a8ec781e876e?auto=format&fit=crop&w=600&h=600&q=80",

  // Products
  pIvoryKurtha:   "https://images.unsplash.com/photo-1667665970124-2273c6ef3489?auto=format&fit=crop&w=900&q=80",
  pTeraiKurtha:   "https://images.unsplash.com/photo-1667665970118-f55705003914?auto=format&fit=crop&w=900&q=80",
  pPatanKurtha:   "https://images.unsplash.com/photo-1656576968731-9271a93d216a?auto=format&fit=crop&w=900&q=80",
  pRaniGunyu:     "https://images.unsplash.com/photo-1659345246648-a5d3bf5aec23?auto=format&fit=crop&w=900&h=1200&q=80",
  pKidsGunyu:     "https://images.unsplash.com/photo-1763733595166-41745662d1a7?auto=format&fit=crop&w=900&q=80",
  pMidnightSaree: "https://images.unsplash.com/photo-1610030469668-8e9f641aaf27?auto=format&fit=crop&w=900&q=80",
  pLotusSaree:    "https://images.unsplash.com/photo-1609748340041-f5d61e061ebc?auto=format&fit=crop&w=900&q=80",
  pPalpaSaree:    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
  pGoldShawl:     "https://images.unsplash.com/photo-1759355346769-bc38a7c3e5e5?auto=format&fit=crop&w=900&q=80",
  pPashminaWrap:  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
  pDupatta:       "https://images.unsplash.com/photo-1724856604254-f7cf4e9c8f72?auto=format&fit=crop&w=900&q=80",
  pCrimsonLehenga:"https://images.unsplash.com/photo-1759906760638-eeffcb471e53?auto=format&fit=crop&w=900&h=1200&q=80",
  pMaroonLehenga: "https://images.unsplash.com/photo-1767955694884-d4bf352c23c2?auto=format&fit=crop&w=900&q=80",
};

/* ---------- 2. PRODUCTS ----------
   Order matters: the first 8 are the "Curated for You" picks shown under ALL.
   cat must be one of: kurtha | saree | gunyu | pashmina | lehenga */
const PRODUCTS = [
  {
    id: "kurtha-ivory", cat: "kurtha", img: "pIvoryKurtha", price: 129000,
    badge: { en: "Bestseller", ko: "베스트" },
    name: { en: "Kathmandu Ivory Kurtha", ko: "카트만두 아이보리 쿠르타" },
    desc: {
      en: "Breathable cotton-silk kurtha with tonal chikan embroidery. Paired suruwal trousers and a sheer dupatta.",
      ko: "톤온톤 자수가 들어간 코튼 실크 쿠르타. 수루왈 팬츠와 시어 두파타 세트.",
    },
    details: {
      en: "70% cotton, 30% silk. Hand-embroidered in Kathmandu. Gentle hand wash or dry clean. Model is 168 cm wearing S.",
      ko: "코튼 70%, 실크 30%. 카트만두 수작업 자수. 손세탁 또는 드라이클리닝. 모델 168cm, S 사이즈 착용.",
    },
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "gunyu-rani", cat: "gunyu", img: "pRaniGunyu", price: 179000,
    badge: { en: "Heritage", ko: "헤리티지" },
    name: { en: "Rani Gunyu Cholo Set", ko: "라니 구뉴 촐로 세트" },
    desc: {
      en: "Brocade cholo blouse wrapped over a velvet gunyu skirt with a maroon patuka sash — Nepal’s hill-country dress.",
      ko: "브로케이드 촐로 블라우스와 벨벳 구뉴 스커트, 마룬 파투카 허리띠로 완성한 네팔 전통 의상.",
    },
    details: {
      en: "Silk brocade blouse, cotton-velvet skirt, cotton sash. Tailored in Pokhara. Dry clean only. Jewellery not included.",
      ko: "실크 브로케이드 블라우스, 코튼 벨벳 스커트, 코튼 허리띠. 포카라 제작. 드라이클리닝 전용. 주얼리 미포함.",
    },
    sizes: ["S", "M", "L"],
  },
  {
    id: "saree-midnight", cat: "saree", img: "pMidnightSaree", price: 189000,
    badge: { en: "New", ko: "신상" },
    name: { en: "Midnight Silk Saree", ko: "미드나잇 실크 사리" },
    desc: {
      en: "Charcoal silk woven with a silver zari border. Quietly dramatic — made for evening dinners and weddings.",
      ko: "실버 자리 보더를 짜 넣은 차콜 실크 사리. 저녁 모임과 결혼식을 위한 절제된 우아함.",
    },
    details: {
      en: "Pure silk, 5.5 m with unstitched blouse piece. Woven on a handloom. Dry clean only.",
      ko: "순실크, 5.5m 및 블라우스 원단 포함. 핸드룸 직조. 드라이클리닝 전용.",
    },
    sizes: ["Free"],
  },
  {
    id: "shawl-gold", cat: "pashmina", img: "pGoldShawl", price: 159000,
    badge: { en: "Handwoven", ko: "핸드메이드" },
    name: { en: "Himalayan Gold Shawl", ko: "히말라얀 골드 숄" },
    desc: {
      en: "Pashmina blend with hand-embroidered florals and a gold-thread fringe. Feather-light, warm enough for a Seoul winter.",
      ko: "손자수 플로럴과 골드 실 프린지의 파시미나 블렌드 숄. 가볍지만 서울의 겨울에도 충분히 따뜻합니다.",
    },
    details: {
      en: "70% pashmina (chyangra wool), 30% silk. 70 × 200 cm. Made in Kathmandu. Dry clean only.",
      ko: "파시미나(창그라 울) 70%, 실크 30%. 70 × 200cm. 카트만두 제작. 드라이클리닝 전용.",
    },
    sizes: ["Free"],
  },
  {
    id: "kurtha-terai", cat: "kurtha", img: "pTeraiKurtha", price: 119000,
    badge: null,
    name: { en: "Terai Cotton Kurtha Set", ko: "테라이 코튼 쿠르타 세트" },
    desc: {
      en: "Mint cotton kurtha with straight suruwal and dupatta. An easy everyday set from the southern plains.",
      ko: "민트 코튼 쿠르타와 스트레이트 수루왈, 두파타 세트. 매일 편하게 입는 데일리 세트.",
    },
    details: {
      en: "100% cotton, block-printed trims. Machine wash cold, gentle cycle. Three-piece set.",
      ko: "코튼 100%, 블록 프린트 트림. 찬물 울코스 세탁 가능. 3피스 세트.",
    },
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "saree-lotus", cat: "saree", img: "pLotusSaree", price: 219000,
    badge: { en: "Handwoven", ko: "핸드메이드" },
    name: { en: "Lotus Handwoven Saree", ko: "로터스 핸드우븐 사리" },
    desc: {
      en: "Soft sage silk with a woven lotus motif and olive blouse. Light enough to drape all day.",
      ko: "연꽃 모티프를 직조한 세이지 실크 사리와 올리브 블라우스. 하루 종일 편안한 가벼움.",
    },
    details: {
      en: "Silk-cotton blend, 5.5 m with blouse piece. Handloom woven over 9 days. Dry clean only.",
      ko: "실크 코튼 혼방, 5.5m 및 블라우스 원단 포함. 9일간 핸드룸 직조. 드라이클리닝 전용.",
    },
    sizes: ["Free"],
  },
  {
    id: "pashmina-wrap", cat: "pashmina", img: "pPashminaWrap", price: 149000,
    badge: null,
    name: { en: "Chyangra Pashmina Wrap", ko: "창그라 파시미나 랩" },
    desc: {
      en: "Undyed ivory pashmina knit with a fringed hem. Layer it over coats or knitwear.",
      ko: "무염색 아이보리 파시미나 니트 랩, 프린지 마감. 코트나 니트 위에 자연스럽게 레이어드.",
    },
    details: {
      en: "100% chyangra pashmina from high-altitude goats. One size. Hand wash cold, dry flat.",
      ko: "고산지대 창그라 산양 파시미나 100%. 원사이즈. 찬물 손세탁, 뉘어서 건조.",
    },
    sizes: ["Free"],
  },
  {
    id: "lehenga-crimson", cat: "lehenga", img: "pCrimsonLehenga", price: 249000,
    badge: { en: "Bridal", ko: "브라이덜" },
    name: { en: "Crimson Heritage Lehenga", ko: "크림슨 헤리티지 레헹가" },
    desc: {
      en: "Bridal crimson lehenga with zardozi embroidery, fitted choli and a sheer veil dupatta.",
      ko: "자르도지 자수를 놓은 크림슨 브라이덜 레헹가와 촐리, 시어 베일 두파타.",
    },
    details: {
      en: "Raw silk skirt, net dupatta, hand zardozi work. Made to order — please allow 3 extra weeks. Dry clean only.",
      ko: "로우 실크 스커트, 네트 두파타, 수작업 자르도지. 주문 제작 — 3주 추가 소요. 드라이클리닝 전용.",
    },
    sizes: ["S", "M", "L"],
  },
  // — shown with "View all" —
  {
    id: "kurtha-patan", cat: "kurtha", img: "pPatanKurtha", price: 109000,
    badge: null,
    name: { en: "Patan Lavender Kurtha", ko: "파탄 라벤더 쿠르타" },
    desc: {
      en: "Long-line lavender kurtha with an open front and navy embroidered under-layer.",
      ko: "프런트가 열리는 롱 라벤더 쿠르타, 네이비 자수 이너 레이어.",
    },
    details: {
      en: "Cotton georgette. Tailored in Lalitpur (Patan). Hand wash cold.",
      ko: "코튼 조젯. 랄릿푸르(파탄) 제작. 찬물 손세탁.",
    },
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "gunyu-kids", cat: "gunyu", img: "pKidsGunyu", price: 98000,
    badge: { en: "Kids", ko: "키즈" },
    name: { en: "Gurung Gunyu Cholo — Kids", ko: "구룽 구뉴 촐로 — 키즈" },
    desc: {
      en: "Striped cholo, printed gunyu and a golden patuka, sized for ages 5–12. Perfect for family photos.",
      ko: "스트라이프 촐로, 프린트 구뉴, 골드 파투카. 5–12세용. 가족 사진 촬영에 추천.",
    },
    details: {
      en: "Cotton and cotton-velvet. Adjustable wrap fastening. Hand wash cold.",
      ko: "코튼 및 코튼 벨벳. 랩 방식으로 사이즈 조절 가능. 찬물 손세탁.",
    },
    sizes: ["5–6", "7–8", "9–10", "11–12"],
  },
  {
    id: "saree-palpa", cat: "saree", img: "pPalpaSaree", price: 199000,
    badge: null,
    name: { en: "Palpali Dhaka-Border Saree", ko: "팔파 다카 보더 사리" },
    desc: {
      en: "Deep violet silk finished with a gold border inspired by Palpa’s dhaka weave.",
      ko: "팔파 지역 다카 직물에서 영감을 받은 골드 보더의 딥 바이올렛 실크 사리.",
    },
    details: {
      en: "Silk, 5.5 m with blouse piece. Border handwoven in Palpa. Dry clean only.",
      ko: "실크, 5.5m 및 블라우스 원단 포함. 팔파 수직 보더. 드라이클리닝 전용.",
    },
    sizes: ["Free"],
  },
  {
    id: "dupatta-heritage", cat: "pashmina", img: "pDupatta", price: 89000,
    badge: null,
    name: { en: "Heritage Silk Dupatta", ko: "헤리티지 실크 두파타" },
    desc: {
      en: "Crimson silk dupatta with hand gold-work — lifts a plain kurtha or a white dress instantly.",
      ko: "골드 핸드워크를 더한 크림슨 실크 두파타. 심플한 쿠르타나 화이트 원피스에 포인트로.",
    },
    details: {
      en: "Silk organza, 2.3 m. Hand-finished edges. Dry clean only.",
      ko: "실크 오간자, 2.3m. 수작업 마감. 드라이클리닝 전용.",
    },
    sizes: ["Free"],
  },
  {
    id: "lehenga-maroon", cat: "lehenga", img: "pMaroonLehenga", price: 289000,
    badge: null,
    name: { en: "Royal Maroon Lehenga", ko: "로열 마룬 레헹가" },
    desc: {
      en: "Saffron-and-maroon lehenga with mirror and thread work, for receptions and festival nights.",
      ko: "미러와 자수 장식의 사프란·마룬 레헹가. 피로연과 축제의 밤을 위해.",
    },
    details: {
      en: "Silk blend with cotton lining. Made to order — please allow 3 extra weeks. Dry clean only.",
      ko: "실크 혼방, 코튼 안감. 주문 제작 — 3주 추가 소요. 드라이클리닝 전용.",
    },
    sizes: ["S", "M", "L"],
  },
];

const CATEGORY_LABELS = {
  kurtha:   { en: "Kurtha", ko: "쿠르타" },
  saree:    { en: "Sari", ko: "사리" },
  gunyu:    { en: "Gunyu Cholo", ko: "구뉴 촐로" },
  pashmina: { en: "Pashmina & Dhaka", ko: "파시미나 & 다카" },
  lehenga:  { en: "Lehenga", ko: "레헹가" },
};

const FEATURED_COUNT = 8;
const FREE_SHIPPING_FROM = 100000;
const SHIPPING_FEE = 6000;

/* ---------- 3. STRINGS (English / Korean) ---------- */
const STRINGS = {
  en: {
    "topbar.ship": "Free shipping on orders over ₩100,000",
    "topbar.days": "Delivered from Nepal in 7–12 days",
    "aria.menu": "Open menu", "aria.search": "Search", "aria.account": "Account",
    "aria.wishlist": "Wishlist", "aria.bag": "Shopping bag", "aria.close": "Close",

    "nav.new": "New Arrivals", "nav.kurtha": "Kurthas", "nav.saree": "Sarees",
    "nav.gunyu": "Gunyu Cholo", "nav.pashmina": "Pashmina & Dhaka", "nav.lehenga": "Lehengas",

    "hero.eyebrow": "Authentic pieces from Nepal · Curated for Korea",
    "hero.title1": "Nepal,", "hero.title2": "Reimagined.",
    "hero.lead": "Timeless Nepali craftsmanship,<br />made for the modern world.",
    "hero.cta1": "Shop Collection", "hero.cta2": "Explore Nepali Heritage",
    "hero.shown": "Shown",

    "promise.1": "Handmade in Nepal",
    "promise.2": "Free shipping over ₩100,000",
    "promise.3": "Delivered across Korea in 7–12 days",
    "promise.4": "KakaoPay · Naver Pay · Toss",

    "cat.eyebrow": "새로운 컬렉션 · The Collection",
    "cat.title": "Discover the Collection",
    "cat.sub": "Traditional silhouettes, thoughtfully reimagined.",
    "cat.kurtha": "Kurthas", "cat.kurthaSub": "Everyday heritage",
    "cat.saree": "Sarees", "cat.sareeSub": "Timeless elegance",
    "cat.cultural": "Cultural Edits", "cat.culturalSub": "Pieces with a story",
    "cat.lehenga": "Lehengas", "cat.lehengaSub": "Made for celebrations",
    "common.shop": "Shop",

    "shop.eyebrow": "신상품 · New Arrivals", "shop.title": "Curated for You", "shop.viewAll": "View all pieces",
    "filter.all": "All", "filter.kurtha": "Kurthas", "filter.saree": "Sarees",
    "filter.gunyu": "Gunyu Cholo", "filter.pashmina": "Pashmina & Dhaka", "filter.lehenga": "Lehengas",

    "story.caption": "On the loom — every metre woven by hand.",
    "story.eyebrow": "Our Story · 우리의 이야기",
    "story.title": "More Than Clothing.",
    "story.quote": "“Every piece carries a story — from the hands that create it to the culture that inspires it.”",
    "story.text": "NAYA works directly with weavers and tailors across Nepal — from the dhaka looms of Palpa to the pashmina workshops of Kathmandu. We choose each piece for its craft, then bring it to Korea with the care, sizing and service you expect from a modern boutique.",
    "story.step1": "Woven in Palpa", "story.step2": "Finished in Kathmandu", "story.step3": "Delivered in Seoul",
    "story.cta": "Our Story",

    "korea.eyebrow": "Nepal × Korea · 네팔 × 한국",
    "korea.title": "From Nepal, With Love.",
    "korea.sub": "Traditional craftsmanship, thoughtfully brought to Korea.",
    "korea.c1": "Authentic Nepali Craft", "korea.c1t": "Curated directly from Nepal",
    "korea.c2": "Delivered Across Korea", "korea.c2t": "Made for modern Korean shoppers",
    "korea.c3": "Culture × Contemporary", "korea.c3t": "Heritage with a modern perspective",

    "gloss.eyebrow": "A Guide · 네팔 의상 가이드",
    "gloss.title": "The Nepali Wardrobe",
    "gloss.sub": "Five pieces worth knowing — and how to wear them in Seoul.",
    "gloss.k": "Kurtha", "gloss.kt": "A long, easy tunic worn with suruwal trousers and a shawl. Nepal’s everyday staple — lovely with denim, too.",
    "gloss.s": "Sari", "gloss.st": "Five to six metres of unstitched cloth, draped. For weddings, festivals and evenings out.",
    "gloss.g": "Gunyu Cholo", "gloss.gt": "A wrapped blouse (cholo) and skirt (gunyu) — the traditional dress of Nepal’s hill communities.",
    "gloss.d": "Dhaka", "gloss.dt": "A geometric handwoven cloth from Palpa, made thread by thread on wooden looms.",
    "gloss.p": "Pashmina", "gloss.pt": "Fine Himalayan goat wool, feather-light and warm — made for Korean winters.",

    "occ.eyebrow": "Occasionwear · 특별한 날",
    "occ.title": "Made for Your Moments", "occ.cta": "Shop Occasionwear",
    "occ.wedding": "Wedding", "occ.festival": "Festival", "occ.celebration": "Celebration", "occ.everyday": "Everyday",
    "occ.weddingSub": "결혼식", "occ.festivalSub": "축제", "occ.celebrationSub": "기념일", "occ.everydaySub": "데일리",

    "social.eyebrow": "Instagram", "social.title": "Follow the Journey",

    "trust.1": "Authentic Nepali Fashion", "trust.1t": "Curated pieces inspired by Nepal.",
    "trust.2": "Secure Payments", "trust.2t": "Safe and simple checkout.",
    "trust.3": "Korea-Wide Delivery", "trust.3t": "Convenient delivery across Korea.",
    "trust.4": "Easy Returns", "trust.4t": "Simple customer-friendly return experience.",

    "news.eyebrow": "Newsletter · 뉴스레터",
    "news.title": "Stay in the Story.",
    "news.sub": "New collections, cultural stories and exclusive launches — delivered to your inbox.",
    "news.ph": "Your email address", "news.cta": "Join NAYA",

    "footer.about": "Authentic Nepali clothing, curated in Kathmandu and delivered across Korea.",
    "footer.shop": "Shop", "footer.aboutH": "About", "footer.story": "Our Story", "footer.heritage": "Nepali Heritage",
    "footer.craft": "Craftsmanship", "footer.journal": "Journal", "footer.care": "Customer Care",
    "footer.contact": "Contact", "footer.shipping": "Shipping", "footer.returns": "Returns", "footer.faq": "FAQ",
    "footer.follow": "Follow", "footer.rights": "All rights reserved.",
    "footer.legal": "NAYA Korea (demo) · Representative: —— · Business Reg. No. 000-00-00000 · Mail-order Reg. No. 0000-서울-0000 · Customer care 10:00–18:00 KST, Mon–Fri. All company details on this page are placeholders for a design demo.",

    "tab.home": "Home", "tab.shop": "Shop", "tab.search": "Search", "tab.wish": "Wishlist", "tab.bag": "Bag",
    "search.ph": "Search kurtha, sari, pashmina…", "search.popular": "Popular",

    // Strings used only by script.js
    "js.addToBag": "Add to Bag",
    "js.added": "Added to bag",
    "js.wishAdded": "Saved to wishlist",
    "js.wishRemoved": "Removed from wishlist",
    "js.size": "Size",
    "js.sizeGuide": "Size guide",
    "js.free": "Free size",
    "js.fabric": "Fabric & care",
    "js.shipping": "Shipping & returns",
    "js.shippingText": "Shipped from Kathmandu and delivered to your door in 7–12 days. Free shipping on orders over ₩100,000. Returns accepted within 14 days of delivery, unworn with tags.",
    "js.madeIn": "Handmade in Nepal",
    "js.days": "Delivered to Korea in 7–12 days",
    "js.freeShip": "Free shipping over ₩100,000",
    "js.bag": "Bag", "js.wishlist": "Wishlist", "js.account": "Account", "js.checkout": "Checkout", "js.confirmed": "Order Confirmed",
    "js.emptyBag": "Your bag is empty.",
    "js.emptyBagSub": "Begin with a kurtha, a sari or a pashmina.",
    "js.emptyWish": "Nothing saved yet.",
    "js.emptyWishSub": "Tap the heart on any piece to keep it here.",
    "js.startShopping": "Start shopping",
    "js.remove": "Remove",
    "js.qty": "Qty",
    "js.subtotal": "Subtotal", "js.shippingFee": "Shipping", "js.total": "Total", "js.freeLabel": "Free",
    "js.toFree": "You’re {amount} away from free shipping.",
    "js.gotFree": "You’ve unlocked free shipping to Korea.",
    "js.taxNote": "Prices include VAT and customs duties. Delivered from Nepal in 7–12 days.",
    "js.goCheckout": "Checkout",
    "js.delivery": "Delivery details",
    "js.name": "Full name", "js.phone": "Phone", "js.address": "Address", "js.postcode": "Postcode",
    "js.payment": "Payment method",
    "js.card": "Credit Card",
    "js.pay": "Pay {amount}",
    "js.processing": "Processing…",
    "js.demoPay": "Demo only — no payment will be taken.",
    "js.thanks": "Thank you. Your pieces are being prepared in Kathmandu and will travel to you shortly.",
    "js.orderNo": "Order no.",
    "js.paidWith": "Paid with",
    "js.arrives": "Estimated arrival",
    "js.continue": "Continue shopping",
    "js.moveToBag": "Add to bag",
    "js.accountIntro": "Sign in to track orders, save your sizes and collect points.",
    "js.kakaoLogin": "Continue with Kakao",
    "js.naverLogin": "Continue with Naver",
    "js.or": "or",
    "js.email": "Email", "js.password": "Password", "js.signIn": "Sign in",
    "js.demoNote": "This is a design demo — this page is part of the full build.",
    "js.noResults": "No pieces found. Try “kurtha” or “pashmina”.",
    "js.resultsFor": "pieces",
    "js.newsOk": "Welcome to NAYA — your first story arrives soon.",
    "js.newsErr": "Please enter a valid email address.",
    "js.fillAll": "Please complete your delivery details.",
    "js.items": "items",
    "js.view": "View",
  },

  ko: {
    "topbar.ship": "₩100,000 이상 구매 시 무료배송",
    "topbar.days": "네팔에서 7–12일 내 배송",
    "aria.menu": "메뉴 열기", "aria.search": "검색", "aria.account": "마이페이지",
    "aria.wishlist": "위시리스트", "aria.bag": "쇼핑백", "aria.close": "닫기",

    "nav.new": "신상품", "nav.kurtha": "쿠르타", "nav.saree": "사리",
    "nav.gunyu": "구뉴 촐로", "nav.pashmina": "파시미나 & 다카", "nav.lehenga": "레헹가",

    "hero.eyebrow": "네팔에서 온 오리지널 · 한국을 위해 큐레이션",
    "hero.title1": "네팔,", "hero.title2": "새롭게.",
    "hero.lead": "시간이 지나도 변치 않는 네팔의 장인정신을<br />오늘의 일상으로.",
    "hero.cta1": "컬렉션 쇼핑하기", "hero.cta2": "네팔 헤리티지 알아보기",
    "hero.shown": "착용 제품",

    "promise.1": "네팔 핸드메이드",
    "promise.2": "₩100,000 이상 무료배송",
    "promise.3": "한국 전역 7–12일 배송",
    "promise.4": "카카오페이 · 네이버페이 · 토스",

    "cat.eyebrow": "새로운 컬렉션",
    "cat.title": "컬렉션 둘러보기",
    "cat.sub": "전통의 실루엣을 섬세하게 새로 그리다.",
    "cat.kurtha": "쿠르타", "cat.kurthaSub": "매일 입는 헤리티지",
    "cat.saree": "사리", "cat.sareeSub": "시간을 초월한 우아함",
    "cat.cultural": "컬처럴 에디트", "cat.culturalSub": "이야기가 있는 옷",
    "cat.lehenga": "레헹가", "cat.lehengaSub": "축하의 날을 위해",
    "common.shop": "쇼핑하기",

    "shop.eyebrow": "신상품", "shop.title": "당신을 위한 큐레이션", "shop.viewAll": "전체 상품 보기",
    "filter.all": "전체", "filter.kurtha": "쿠르타", "filter.saree": "사리",
    "filter.gunyu": "구뉴 촐로", "filter.pashmina": "파시미나 & 다카", "filter.lehenga": "레헹가",

    "story.caption": "베틀 위에서 — 한 땀 한 땀 손으로 짠 원단.",
    "story.eyebrow": "우리의 이야기",
    "story.title": "옷, 그 이상의 이야기.",
    "story.quote": "“모든 옷에는 이야기가 있습니다 — 만드는 손에서, 영감을 준 문화까지.”",
    "story.text": "NAYA는 팔파의 다카 베틀부터 카트만두의 파시미나 공방까지, 네팔 곳곳의 직조 장인·재단사와 직접 일합니다. 장인정신이 담긴 옷만을 골라, 한국의 부티크에서 기대하는 사이즈와 서비스로 전해드립니다.",
    "story.step1": "팔파에서 직조", "story.step2": "카트만두에서 완성", "story.step3": "서울로 배송",
    "story.cta": "브랜드 스토리",

    "korea.eyebrow": "네팔 × 한국",
    "korea.title": "네팔에서, 사랑을 담아.",
    "korea.sub": "전통의 손길을 정성껏 한국으로.",
    "korea.c1": "정통 네팔 수공예", "korea.c1t": "네팔 현지에서 직접 큐레이션",
    "korea.c2": "한국 전역 배송", "korea.c2t": "오늘의 한국 고객을 위해",
    "korea.c3": "전통 × 현대", "korea.c3t": "현대적 시선으로 본 헤리티지",

    "gloss.eyebrow": "네팔 의상 가이드",
    "gloss.title": "네팔의 옷장",
    "gloss.sub": "알아두면 좋은 다섯 가지 — 그리고 서울에서 입는 법.",
    "gloss.k": "쿠르타", "gloss.kt": "수루왈 팬츠, 숄과 함께 입는 길고 편안한 튜닉. 네팔의 데일리 웨어로 데님과도 잘 어울립니다.",
    "gloss.s": "사리", "gloss.st": "5–6m의 재단하지 않은 원단을 몸에 둘러 입는 옷. 결혼식, 축제, 특별한 저녁을 위해.",
    "gloss.g": "구뉴 촐로", "gloss.gt": "여며 입는 블라우스(촐로)와 스커트(구뉴) — 네팔 산간 지역의 전통 의상.",
    "gloss.d": "다카", "gloss.dt": "팔파 지역에서 나무 베틀로 한 올씩 짜는 기하학 패턴의 수직 원단.",
    "gloss.p": "파시미나", "gloss.pt": "히말라야 산양의 고운 털. 깃털처럼 가볍고 따뜻해 한국의 겨울에 제격입니다.",

    "occ.eyebrow": "특별한 날",
    "occ.title": "당신의 순간을 위해", "occ.cta": "오케이전 웨어 쇼핑하기",
    "occ.wedding": "결혼식", "occ.festival": "축제", "occ.celebration": "기념일", "occ.everyday": "데일리",
    "occ.weddingSub": "Wedding", "occ.festivalSub": "Festival", "occ.celebrationSub": "Celebration", "occ.everydaySub": "Everyday",

    "social.eyebrow": "인스타그램", "social.title": "여정을 함께하세요",

    "trust.1": "정통 네팔 패션", "trust.1t": "네팔에서 영감을 받은 큐레이션.",
    "trust.2": "안전한 결제", "trust.2t": "간편하고 안전한 결제.",
    "trust.3": "전국 배송", "trust.3t": "한국 어디서나 편리하게.",
    "trust.4": "간편한 반품", "trust.4t": "고객 중심의 쉬운 반품.",

    "news.eyebrow": "뉴스레터",
    "news.title": "이야기를 계속 받아보세요.",
    "news.sub": "새 컬렉션, 문화 이야기, 단독 런칭 소식을 메일로 전해드립니다.",
    "news.ph": "이메일 주소", "news.cta": "NAYA 구독하기",

    "footer.about": "카트만두에서 큐레이션한 정통 네팔 의상을 한국 전역으로 배송합니다.",
    "footer.shop": "쇼핑", "footer.aboutH": "브랜드", "footer.story": "브랜드 스토리", "footer.heritage": "네팔 헤리티지",
    "footer.craft": "장인정신", "footer.journal": "저널", "footer.care": "고객센터",
    "footer.contact": "문의하기", "footer.shipping": "배송 안내", "footer.returns": "교환·반품", "footer.faq": "자주 묻는 질문",
    "footer.follow": "팔로우", "footer.rights": "모든 권리 보유.",
    "footer.legal": "NAYA 코리아 (데모) · 대표자: —— · 사업자등록번호 000-00-00000 · 통신판매업신고 0000-서울-0000 · 고객센터 평일 10:00–18:00. 이 페이지의 모든 회사 정보는 디자인 데모용 예시입니다.",

    "tab.home": "홈", "tab.shop": "쇼핑", "tab.search": "검색", "tab.wish": "위시", "tab.bag": "쇼핑백",
    "search.ph": "쿠르타, 사리, 파시미나 검색…", "search.popular": "인기 검색어",

    "js.addToBag": "쇼핑백 담기",
    "js.added": "쇼핑백에 담았습니다",
    "js.wishAdded": "위시리스트에 저장했습니다",
    "js.wishRemoved": "위시리스트에서 삭제했습니다",
    "js.size": "사이즈",
    "js.sizeGuide": "사이즈 가이드",
    "js.free": "프리 사이즈",
    "js.fabric": "소재 및 관리",
    "js.shipping": "배송 및 반품",
    "js.shippingText": "카트만두에서 발송되어 7–12일 내 문 앞까지 배송됩니다. ₩100,000 이상 구매 시 무료배송. 수령 후 14일 이내, 미착용·택 부착 상태에서 반품 가능합니다.",
    "js.madeIn": "네팔 핸드메이드",
    "js.days": "한국까지 7–12일 배송",
    "js.freeShip": "₩100,000 이상 무료배송",
    "js.bag": "쇼핑백", "js.wishlist": "위시리스트", "js.account": "마이페이지", "js.checkout": "주문/결제", "js.confirmed": "주문 완료",
    "js.emptyBag": "쇼핑백이 비어 있습니다.",
    "js.emptyBagSub": "쿠르타, 사리, 파시미나로 시작해 보세요.",
    "js.emptyWish": "저장한 상품이 없습니다.",
    "js.emptyWishSub": "마음에 드는 상품의 하트를 눌러 저장하세요.",
    "js.startShopping": "쇼핑 시작하기",
    "js.remove": "삭제",
    "js.qty": "수량",
    "js.subtotal": "상품 금액", "js.shippingFee": "배송비", "js.total": "총 결제금액", "js.freeLabel": "무료",
    "js.toFree": "{amount} 더 담으면 무료배송!",
    "js.gotFree": "무료배송 혜택이 적용되었습니다.",
    "js.taxNote": "부가세 및 관세 포함 가격입니다. 네팔에서 7–12일 내 배송됩니다.",
    "js.goCheckout": "주문하기",
    "js.delivery": "배송 정보",
    "js.name": "이름", "js.phone": "휴대폰 번호", "js.address": "주소", "js.postcode": "우편번호",
    "js.payment": "결제 수단",
    "js.card": "신용카드",
    "js.pay": "{amount} 결제하기",
    "js.processing": "결제 진행 중…",
    "js.demoPay": "데모 화면입니다 — 실제 결제는 이루어지지 않습니다.",
    "js.thanks": "감사합니다. 주문하신 상품을 카트만두에서 정성껏 준비해 곧 보내드리겠습니다.",
    "js.orderNo": "주문번호",
    "js.paidWith": "결제 수단",
    "js.arrives": "도착 예정",
    "js.continue": "쇼핑 계속하기",
    "js.moveToBag": "쇼핑백 담기",
    "js.accountIntro": "로그인하고 주문 조회, 사이즈 저장, 적립금 혜택을 받아보세요.",
    "js.kakaoLogin": "카카오로 계속하기",
    "js.naverLogin": "네이버로 계속하기",
    "js.or": "또는",
    "js.email": "이메일", "js.password": "비밀번호", "js.signIn": "로그인",
    "js.demoNote": "디자인 데모입니다 — 이 페이지는 실제 구축 시 제공됩니다.",
    "js.noResults": "검색 결과가 없습니다. ‘쿠르타’ 또는 ‘파시미나’를 검색해 보세요.",
    "js.resultsFor": "개 상품",
    "js.newsOk": "NAYA에 오신 것을 환영합니다 — 첫 이야기를 곧 보내드릴게요.",
    "js.newsErr": "올바른 이메일 주소를 입력해 주세요.",
    "js.fillAll": "배송 정보를 모두 입력해 주세요.",
    "js.items": "개",
    "js.view": "보기",
  },
};

/* ---------- 4. State & helpers ---------- */
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem("naya." + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("naya." + key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  },
};

const state = {
  lang: store.get("lang", "en"),
  filter: "all",
  showAll: false,
  cart: store.get("cart", []),            // [{ id, size, qty }]
  wish: new Set(store.get("wish", [])),   // product ids
  drawerView: null,                       // cart | checkout | done | wishlist | account
  payment: "kakao",
  lastOrder: null,
  modalProduct: null,
  modalSize: null,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const t = (key, vars = {}) => {
  let s = (STRINGS[state.lang] && STRINGS[state.lang][key]) ?? STRINGS.en[key] ?? key;
  Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
  return s;
};
const loc = (obj) => (obj ? obj[state.lang] || obj.en : "");
const won = (n) => "₩" + n.toLocaleString("ko-KR");
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const PAYMENTS = {
  kakao: { label: () => "KakaoPay", logo: "kakao", mark: "pay" },
  naver: { label: () => "Naver Pay", logo: "naver", mark: "N" },
  toss:  { label: () => "Toss", logo: "toss", mark: "toss" },
  card:  { label: () => t("js.card"), logo: "card", mark: "CARD" },
};

/* ---------- 5. Images + fallback ---------- */
function mediaHTML(key, label, extraClass = "") {
  return `<div class="media ${extraClass}" data-img="${key}" data-label="${esc(label)}"></div>`;
}

// Fill every .media[data-img] inside root with an <img>; on error show the placeholder.
function hydrateImages(root = document) {
  $$(".media[data-img]", root).forEach((box) => {
    if (box.dataset.hydrated) return;
    box.dataset.hydrated = "1";
    const src = IMAGES[box.dataset.img];
    if (!src) { box.classList.add("is-fallback"); return; }
    const img = new Image();
    img.alt = box.dataset.label || "";
    img.decoding = "async";
    if (!box.hasAttribute("data-eager")) img.loading = "lazy";
    img.addEventListener("load", () => img.classList.add("is-loaded"));
    img.addEventListener("error", () => box.classList.add("is-fallback"));
    img.src = src;
    box.appendChild(img);
  });
}

/* ---------- 6. Language ---------- */
function setLang(lang) {
  state.lang = lang === "ko" ? "ko" : "en";
  store.set("lang", state.lang);
  document.documentElement.lang = state.lang;

  $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $$("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  $$("[data-pname]").forEach((el) => { el.textContent = loc(byId(el.dataset.pname).name); });

  $("#langCurrent").textContent = state.lang === "ko" ? "KR" : "EN";
  $$("[data-lang]").forEach((b) => b.classList.toggle("is-current", b.dataset.lang === state.lang));

  renderProducts();
  if (state.drawerView) renderDrawer();
  if (state.modalProduct) renderModal();
  if ($("#searchPanel").classList.contains("is-open")) runSearch();
}

function initLang() {
  const wrap = $("#langSwitch");
  const toggle = $("#langToggle");
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = wrap.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", () => {
    wrap.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
  // Every [data-lang] button (header menu, mobile menu, footer) switches language
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;
    setLang(btn.dataset.lang);
    toast(state.lang === "ko" ? "한국어로 변경되었습니다" : "Switched to English");
  });
}

/* ---------- 7. Products ---------- */
function visibleProducts() {
  if (state.filter === "all") return state.showAll ? PRODUCTS : PRODUCTS.slice(0, FEATURED_COUNT);
  return PRODUCTS.filter((p) => p.cat === state.filter);
}

function productCard(p, i) {
  const wished = state.wish.has(p.id);
  return `
    <article class="p-card" data-product="${p.id}" tabindex="0" style="animation-delay:${Math.min(i, 8) * 0.05}s" aria-label="${esc(loc(p.name))}">
      <div class="p-media">
        ${mediaHTML(p.img, loc(p.name))}
        ${p.badge ? `<span class="p-badge">${esc(loc(p.badge))}</span>` : ""}
        <button class="wish-btn ${wished ? "is-on" : ""}" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${esc(t("aria.wishlist"))}">
          <svg><use href="#${wished ? "i-heart-fill" : "i-heart"}"/></svg>
        </button>
        <button class="add-btn" data-add="${p.id}" aria-label="${esc(t("js.addToBag"))}">
          <svg><use href="#i-bag"/></svg><span>${esc(t("js.addToBag"))}</span>
        </button>
      </div>
      <div class="p-info">
        <p class="p-cat">${esc(loc(CATEGORY_LABELS[p.cat]))}</p>
        <h3 class="p-name">${esc(loc(p.name))}</h3>
        <p class="p-desc">${esc(loc(p.desc))}</p>
        <p class="p-price">${won(p.price)}</p>
      </div>
    </article>`;
}

function renderProducts() {
  const grid = $("#productGrid");
  const items = visibleProducts();
  grid.innerHTML = items.length
    ? items.map(productCard).join("")
    : `<p class="empty-note">${esc(t("js.noResults"))}</p>`;
  hydrateImages(grid);

  $$("[data-filter-btn]").forEach((b) => {
    const on = b.dataset.filterBtn === state.filter;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", on);
  });
  $("#showAll").parentElement.hidden = !(state.filter === "all" && !state.showAll);
}

function setFilter(cat) {
  state.filter = cat;
  state.showAll = cat === "all" ? state.showAll : false;
  renderProducts();
}

function toggleWish(id, btn) {
  const on = !state.wish.has(id);
  on ? state.wish.add(id) : state.wish.delete(id);
  store.set("wish", [...state.wish]);

  // Update every heart for this product (grid + modal) without a full re-render
  $$(`[data-wish="${id}"]`).forEach((b) => {
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", on);
    b.querySelector("use").setAttribute("href", on ? "#i-heart-fill" : "#i-heart");
  });
  if (btn) { btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }

  updateCounts("wish");
  toast(t(on ? "js.wishAdded" : "js.wishRemoved"));
  if (state.drawerView === "wishlist") renderDrawer();
}

function addToCart(id, size, qty = 1) {
  const p = byId(id);
  const chosen = size || (p.sizes.includes("M") ? "M" : p.sizes[0]);
  const line = state.cart.find((l) => l.id === id && l.size === chosen);
  line ? (line.qty += qty) : state.cart.push({ id, size: chosen, qty });
  saveCart();
  updateCounts("cart");
  const sizeText = chosen === "Free" ? t("js.free") : `${t("js.size")} ${chosen}`;
  toast(`${t("js.added")} — <b>${esc(loc(p.name))}</b> · ${esc(sizeText)}`);
}

function saveCart() { store.set("cart", state.cart); }

const cartCount = () => state.cart.reduce((n, l) => n + l.qty, 0);
const cartSubtotal = () => state.cart.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
const shippingFor = (sub) => (sub === 0 || sub >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE);

function updateCounts(which) {
  const counts = { cart: cartCount(), wish: state.wish.size };
  $$("[data-count]").forEach((b) => {
    const n = counts[b.dataset.count];
    b.textContent = n;
    b.classList.toggle("has-items", n > 0);
    if (which === b.dataset.count && n > 0) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  });
}

function initProducts() {
  renderProducts();

  // Card interactions (delegated)
  $("#productGrid").addEventListener("click", (e) => {
    const wish = e.target.closest("[data-wish]");
    if (wish) { e.stopPropagation(); toggleWish(wish.dataset.wish, wish); return; }
    const add = e.target.closest("[data-add]");
    if (add) {
      e.stopPropagation();
      addToCart(add.dataset.add);
      add.classList.add("is-added");
      setTimeout(() => add.classList.remove("is-added"), 900);
      return;
    }
    const card = e.target.closest(".p-card");
    if (card) openProduct(card.dataset.product);
  });
  $("#productGrid").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("p-card")) openProduct(e.target.dataset.product);
  });

  $$("[data-filter-btn]").forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.filterBtn)));

  // Any link with data-filter (nav, categories, occasions, footer) filters the grid
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-filter]");
    if (!link) return;
    setFilter(link.dataset.filter);
    closeAll();
  });

  $("#showAll").addEventListener("click", () => { state.showAll = true; renderProducts(); });

  // Any element with data-product outside the grid (hero "shop the look") opens the modal
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-product]");
    if (el && !el.closest("#productGrid") && !el.closest(".search-results")) openProduct(el.dataset.product);
  });
}

/* ---------- 8. Overlays ---------- */
const scrim = $("#scrim");
let lastFocus = null;

function showScrim(on) {
  if (on) {
    scrim.hidden = false;
    requestAnimationFrame(() => scrim.classList.add("is-visible"));
  } else {
    scrim.classList.remove("is-visible");
    setTimeout(() => { if (!scrim.classList.contains("is-visible")) scrim.hidden = true; }, 350);
  }
  document.body.classList.toggle("no-scroll", on);
}

function openPanel(el) {
  closeAll(true);
  lastFocus = document.activeElement;
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
  showScrim(true);
}

function closeAll(keepScrim = false) {
  ["#mobileMenu", "#searchPanel", "#drawer", "#productModal"].forEach((s) => {
    const el = $(s);
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
  });
  state.drawerView = null;
  state.modalProduct = null;
  if (!keepScrim) {
    showScrim(false);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
}

function initOverlays() {
  $("#menuOpen").addEventListener("click", () => openPanel($("#mobileMenu")));

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) {
      const what = opener.dataset.open;
      if (what === "search") openSearch();
      else openDrawer(what);
      return;
    }
    if (e.target.closest("[data-close]")) closeAll();
  });

  scrim.addEventListener("click", () => closeAll());
  $("#productModal").addEventListener("click", (e) => { if (e.target.id === "productModal") closeAll(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  // Mobile menu links close the menu
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => closeAll()));
}

/* Search */
function openSearch() {
  openPanel($("#searchPanel"));
  runSearch();
  setTimeout(() => $("#searchInput").focus(), 250);
}

function runSearch() {
  const q = $("#searchInput").value.trim().toLowerCase();
  const box = $("#searchResults");
  const list = q
    ? PRODUCTS.filter((p) =>
        [p.name.en, p.name.ko, p.desc.en, p.desc.ko, p.details.en, CATEGORY_LABELS[p.cat].en, CATEGORY_LABELS[p.cat].ko, p.cat]
          .join(" ").toLowerCase().includes(q))
    : PRODUCTS.slice(0, 6);

  box.innerHTML = list.length
    ? list.map((p) => `
        <button class="s-item" data-search-pick="${p.id}">
          ${mediaHTML(p.img, loc(p.name))}
          <b>${esc(loc(p.name))}</b>
          <span>${won(p.price)}</span>
        </button>`).join("")
    : `<p class="s-empty">${esc(t("js.noResults"))}</p>`;
  hydrateImages(box);
}

function initSearch() {
  $("#searchInput").addEventListener("input", runSearch);
  $$(".search-tags [data-term]").forEach((b) =>
    b.addEventListener("click", () => { $("#searchInput").value = b.dataset.term; runSearch(); }));
  $("#searchResults").addEventListener("click", (e) => {
    const pick = e.target.closest("[data-search-pick]");
    if (pick) openProduct(pick.dataset.searchPick);
  });
}

/* Product modal */
function openProduct(id) {
  const p = byId(id);
  if (!p) return;
  state.modalSize = p.sizes.length === 1 ? p.sizes[0] : null;
  openPanel($("#productModal"));
  state.modalProduct = id;
  renderModal();
}

function renderModal() {
  const p = byId(state.modalProduct);
  if (!p) return;
  const wished = state.wish.has(p.id);
  const otherLang = state.lang === "ko" ? p.name.en : p.name.ko;

  const media = $("#modalMedia");
  if (media.dataset.img !== p.img) {
    media.innerHTML = "";
    media.className = "modal-media media";
    media.dataset.img = p.img;
    media.dataset.label = loc(p.name);
    delete media.dataset.hydrated;
    media.setAttribute("data-eager", "");
    hydrateImages(media.parentElement);
  }

  $("#modalInfo").innerHTML = `
    <p class="p-cat">${esc(loc(CATEGORY_LABELS[p.cat]))}${p.badge ? " · " + esc(loc(p.badge)) : ""}</p>
    <h2>${esc(loc(p.name))}</h2>
    <p class="m-ko">${esc(otherLang)}</p>
    <p class="m-price">${won(p.price)}</p>
    <p class="m-desc">${esc(loc(p.desc))}</p>

    <div class="m-label"><span>${esc(t("js.size"))}</span><span>${esc(t("js.sizeGuide"))}</span></div>
    <div class="sizes" role="radiogroup" aria-label="${esc(t("js.size"))}">
      ${p.sizes.map((s) => `
        <button class="size ${state.modalSize === s ? "is-selected" : ""}" data-size="${s}" role="radio" aria-checked="${state.modalSize === s}">
          ${s === "Free" ? esc(t("js.free")) : s}
        </button>`).join("")}
    </div>

    <div class="m-actions">
      <button class="btn btn-dark" id="modalAdd">${esc(t("js.addToBag"))} — ${won(p.price)}</button>
      <button class="wish-btn ${wished ? "is-on" : ""}" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${esc(t("aria.wishlist"))}">
        <svg><use href="#${wished ? "i-heart-fill" : "i-heart"}"/></svg>
      </button>
    </div>

    <ul class="m-ship">
      <li><svg><use href="#i-check"/></svg>${esc(t("js.madeIn"))}</li>
      <li><svg><use href="#i-check"/></svg>${esc(t("js.days"))}</li>
      <li><svg><use href="#i-check"/></svg>${esc(t("js.freeShip"))}</li>
    </ul>

    <details class="m-details" open><summary>${esc(t("js.fabric"))}</summary><p>${esc(loc(p.details))}</p></details>
    <details class="m-details"><summary>${esc(t("js.shipping"))}</summary><p>${esc(t("js.shippingText"))}</p></details>`;

  const info = $("#modalInfo");
  $$(".size", info).forEach((b) => b.addEventListener("click", () => {
    state.modalSize = b.dataset.size;
    $$(".size", info).forEach((x) => {
      const on = x === b;
      x.classList.toggle("is-selected", on);
      x.setAttribute("aria-checked", on);
    });
  }));
  $("#modalAdd").addEventListener("click", () => {
    if (!state.modalSize) {
      // Nudge the shopper to pick a size first
      const sizes = $(".sizes", info);
      sizes.animate([{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }], { duration: 300 });
      toast(state.lang === "ko" ? "사이즈를 선택해 주세요" : "Please choose a size");
      return;
    }
    addToCart(p.id, state.modalSize);
    openDrawer("cart");
  });
  $("[data-wish]", info).addEventListener("click", (e) => toggleWish(p.id, e.currentTarget));
}

/* ---------- 9. Drawer views ---------- */
function openDrawer(view) {
  if (!$("#drawer").classList.contains("is-open")) openPanel($("#drawer"));
  state.drawerView = view;
  renderDrawer();
}

function renderDrawer() {
  const body = $("#drawerBody");
  const foot = $("#drawerFoot");
  const title = $("#drawerTitle");
  const back = $("#drawerBack");
  const view = state.drawerView;
  back.hidden = view !== "checkout";
  body.scrollTop = 0;

  const views = {
    cart: renderCartView,
    checkout: renderCheckoutView,
    done: renderDoneView,
    wishlist: renderWishView,
    account: renderAccountView,
  };
  const titles = { cart: "js.bag", checkout: "js.checkout", done: "js.confirmed", wishlist: "js.wishlist", account: "js.account" };
  title.textContent = t(titles[view]) + (view === "cart" && cartCount() ? ` (${cartCount()})` : "");
  views[view](body, foot);
  hydrateImages(body);
}

function emptyState(head, sub) {
  return `<div class="drawer-empty"><p>${esc(t(head))}</p><p>${esc(t(sub))}</p>
    <a href="#shop" class="btn btn-dark" data-filter="all">${esc(t("js.startShopping"))}</a></div>`;
}

function renderCartView(body, foot) {
  if (!state.cart.length) { body.innerHTML = emptyState("js.emptyBag", "js.emptyBagSub"); foot.innerHTML = ""; return; }

  const sub = cartSubtotal();
  const ship = shippingFor(sub);
  const pct = Math.min(100, (sub / FREE_SHIPPING_FROM) * 100);
  const meter = sub >= FREE_SHIPPING_FROM
    ? t("js.gotFree")
    : t("js.toFree", { amount: won(FREE_SHIPPING_FROM - sub) });

  body.innerHTML = `
    <div class="ship-meter">${esc(meter)}<div class="ship-bar"><i style="width:${pct}%"></i></div></div>
    ${state.cart.map((l, i) => {
      const p = byId(l.id);
      return `
      <div class="line">
        ${mediaHTML(p.img, loc(p.name))}
        <div>
          <div class="line-top"><b>${esc(loc(p.name))}</b><span>${won(p.price * l.qty)}</span></div>
          <p class="line-meta">${esc(loc(CATEGORY_LABELS[p.cat]))} · ${l.size === "Free" ? esc(t("js.free")) : `${esc(t("js.size"))} ${l.size}`}</p>
          <div class="line-bottom">
            <div class="qty" aria-label="${esc(t("js.qty"))}">
              <button data-qty="${i}" data-step="-1" aria-label="−">−</button><span>${l.qty}</span><button data-qty="${i}" data-step="1" aria-label="+">+</button>
            </div>
            <button class="line-remove" data-remove="${i}">${esc(t("js.remove"))}</button>
          </div>
        </div>
      </div>`;
    }).join("")}`;

  foot.innerHTML = `
    <div class="sum-row"><span>${esc(t("js.subtotal"))}</span><span>${won(sub)}</span></div>
    <div class="sum-row"><span>${esc(t("js.shippingFee"))}</span><span>${ship ? won(ship) : esc(t("js.freeLabel"))}</span></div>
    <div class="sum-row total"><span>${esc(t("js.total"))}</span><span>${won(sub + ship)}</span></div>
    <p class="sum-note">${esc(t("js.taxNote"))}</p>
    <button class="btn btn-dark btn-block" id="goCheckout">${esc(t("js.goCheckout"))}</button>`;

  $$("[data-qty]", body).forEach((b) => b.addEventListener("click", () => {
    const line = state.cart[+b.dataset.qty];
    line.qty += +b.dataset.step;
    if (line.qty < 1) state.cart.splice(+b.dataset.qty, 1);
    saveCart(); updateCounts(); renderDrawer();
  }));
  $$("[data-remove]", body).forEach((b) => b.addEventListener("click", () => {
    state.cart.splice(+b.dataset.remove, 1);
    saveCart(); updateCounts(); renderDrawer();
  }));
  $("#goCheckout").addEventListener("click", () => { state.drawerView = "checkout"; renderDrawer(); });
}

function renderCheckoutView(body, foot) {
  if (!state.cart.length) { state.drawerView = "cart"; renderDrawer(); return; }
  const sub = cartSubtotal();
  const total = sub + shippingFor(sub);
  const ko = state.lang === "ko";

  // Demo values are pre-filled so the flow can be shown in seconds
  body.innerHTML = `
    <section class="co-section">
      <h3>${esc(t("js.delivery"))}</h3>
      <label class="field"><span class="sr-only">${esc(t("js.name"))}</span><input id="coName" placeholder="${esc(t("js.name"))}" value="${ko ? "김지우" : "Kim Ji-woo"}" autocomplete="name" /></label>
      <label class="field"><span class="sr-only">${esc(t("js.phone"))}</span><input id="coPhone" placeholder="${esc(t("js.phone"))}" value="010-1234-5678" inputmode="tel" autocomplete="tel" /></label>
      <label class="field"><span class="sr-only">${esc(t("js.address"))}</span><input id="coAddr" placeholder="${esc(t("js.address"))}" value="${ko ? "서울특별시 성동구 성수이로 00" : "00 Seongsu-iro, Seongdong-gu, Seoul"}" autocomplete="street-address" /></label>
      <div class="field-row">
        <label class="field"><span class="sr-only">${esc(t("js.postcode"))}</span><input id="coPost" placeholder="${esc(t("js.postcode"))}" value="04780" inputmode="numeric" autocomplete="postal-code" /></label>
        <label class="field"><span class="sr-only">Email</span><input placeholder="${esc(t("js.email"))}" value="jiwoo@example.com" type="email" autocomplete="email" /></label>
      </div>
    </section>

    <section class="co-section">
      <h3>${esc(t("js.payment"))}</h3>
      <div class="pay-options" role="radiogroup" aria-label="${esc(t("js.payment"))}">
        ${Object.entries(PAYMENTS).map(([key, pm]) => `
          <button class="pay-opt ${state.payment === key ? "is-selected" : ""}" data-pay="${key}" role="radio" aria-checked="${state.payment === key}">
            <span class="pay-logo ${pm.logo}">${pm.mark}</span>${esc(pm.label())}
            <svg class="pay-check"><use href="#i-check"/></svg>
          </button>`).join("")}
      </div>
      <p class="co-demo">${esc(t("js.demoPay"))}</p>
    </section>`;

  foot.innerHTML = `
    <div class="sum-row"><span>${esc(t("js.subtotal"))} · ${cartCount()}${state.lang === "ko" ? "" : " "}${esc(t("js.items"))}</span><span>${won(sub)}</span></div>
    <div class="sum-row"><span>${esc(t("js.shippingFee"))}</span><span>${shippingFor(sub) ? won(shippingFor(sub)) : esc(t("js.freeLabel"))}</span></div>
    <div class="sum-row total"><span>${esc(t("js.total"))}</span><span>${won(total)}</span></div>
    <button class="btn btn-dark btn-block" id="payNow" style="margin-top:1rem">${esc(t("js.pay", { amount: won(total) }))}</button>`;

  $$("[data-pay]", body).forEach((b) => b.addEventListener("click", () => {
    state.payment = b.dataset.pay;
    $$("[data-pay]", body).forEach((x) => {
      const on = x === b;
      x.classList.toggle("is-selected", on);
      x.setAttribute("aria-checked", on);
    });
  }));

  $("#payNow").addEventListener("click", (e) => {
    const required = ["#coName", "#coPhone", "#coAddr", "#coPost"].map((s) => $(s, body));
    const missing = required.filter((i) => !i.value.trim());
    required.forEach((i) => { i.style.borderColor = i.value.trim() ? "" : "var(--burgundy)"; });
    if (missing.length) { toast(t("js.fillAll")); missing[0].focus(); return; }

    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = t("js.processing");
    setTimeout(() => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      state.lastOrder = {
        no: `NAYA-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`,
        total,
        payment: state.payment,
        from: new Date(now.getTime() + 7 * 864e5),
        to: new Date(now.getTime() + 12 * 864e5),
      };
      state.cart = [];
      saveCart();
      updateCounts();
      state.drawerView = "done";
      renderDrawer();
    }, 1100);
  });
}

function renderDoneView(body, foot) {
  const o = state.lastOrder;
  const fmt = (d) => d.toLocaleDateString(state.lang === "ko" ? "ko-KR" : "en-GB", { month: "short", day: "numeric" });
  body.innerHTML = `
    <div class="confirm">
      <div class="confirm-mark"><svg><use href="#i-check"/></svg></div>
      <h3>${esc(t("js.confirmed"))}</h3>
      <p class="ko-line">${state.lang === "ko" ? "Order Confirmed" : "주문이 완료되었습니다"}</p>
      <p class="confirm-text">${esc(t("js.thanks"))}</p>
      <div class="confirm-card">
        <div class="sum-row"><span>${esc(t("js.orderNo"))}</span><span>${o.no}</span></div>
        <div class="sum-row"><span>${esc(t("js.paidWith"))}</span><span>${esc(PAYMENTS[o.payment].label())}</span></div>
        <div class="sum-row"><span>${esc(t("js.arrives"))}</span><span>${fmt(o.from)} – ${fmt(o.to)}</span></div>
        <div class="sum-row total"><span>${esc(t("js.total"))}</span><span>${won(o.total)}</span></div>
      </div>
      <p class="co-demo">${esc(t("js.demoPay"))}</p>
    </div>`;
  foot.innerHTML = `<a href="#shop" class="btn btn-dark btn-block" data-filter="all">${esc(t("js.continue"))}</a>`;
}

function renderWishView(body, foot) {
  foot.innerHTML = "";
  const items = PRODUCTS.filter((p) => state.wish.has(p.id));
  if (!items.length) { body.innerHTML = emptyState("js.emptyWish", "js.emptyWishSub"); return; }
  body.innerHTML = items.map((p) => `
    <div class="line wish-line">
      ${mediaHTML(p.img, loc(p.name))}
      <div>
        <div class="line-top"><b>${esc(loc(p.name))}</b><span>${won(p.price)}</span></div>
        <p class="line-meta">${esc(loc(CATEGORY_LABELS[p.cat]))}</p>
        <div class="line-bottom">
          <button class="btn btn-outline" data-view="${p.id}">${esc(t("js.view"))}</button>
          <button class="line-remove" data-unwish="${p.id}">${esc(t("js.remove"))}</button>
        </div>
      </div>
    </div>`).join("");
  $$("[data-view]", body).forEach((b) => b.addEventListener("click", () => openProduct(b.dataset.view)));
  $$("[data-unwish]", body).forEach((b) => b.addEventListener("click", () => toggleWish(b.dataset.unwish)));
}

function renderAccountView(body, foot) {
  foot.innerHTML = "";
  body.innerHTML = `
    <p class="account-intro">${esc(t("js.accountIntro"))}</p>
    <div class="social-login">
      <button class="btn btn-kakao" data-demo-link>${esc(t("js.kakaoLogin"))}</button>
      <button class="btn btn-naver" data-demo-link>${esc(t("js.naverLogin"))}</button>
    </div>
    <p class="divider">${esc(t("js.or"))}</p>
    <label class="field"><span class="sr-only">${esc(t("js.email"))}</span><input type="email" placeholder="${esc(t("js.email"))}" autocomplete="email" /></label>
    <label class="field"><span class="sr-only">${esc(t("js.password"))}</span><input type="password" placeholder="${esc(t("js.password"))}" autocomplete="current-password" /></label>
    <button class="btn btn-dark btn-block" data-demo-link>${esc(t("js.signIn"))}</button>`;
}

/* ---------- 10. Header, scroll reveal, newsletter, misc ---------- */
let toastTimer;
function toast(html) {
  const el = $("#toast");
  el.innerHTML = html;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2400);
}

function initHeader() {
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => io.observe(el));
}

function initNewsletter() {
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#newsEmail");
    const msg = $("#newsMsg");
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    msg.textContent = t(ok ? "js.newsOk" : "js.newsErr");
    msg.classList.toggle("is-error", !ok);
    if (ok) input.value = "";
  });
}

// Links that would go to pages not built for the demo show a gentle note instead
function initDemoLinks() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-demo-link]");
    if (!link) return;
    e.preventDefault();
    toast(t("js.demoNote"));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateImages();
  initHeader();
  initLang();
  initProducts();
  initOverlays();
  initSearch();
  initNewsletter();
  initDemoLinks();
  setLang(state.lang);
  updateCounts();
  initReveal();
});
