/* =========================================================
   HIMALI — Woven in the Himalayas.
   Vanilla JS (works by opening index.html, no build step)
   ---------------------------------------------------------
   1. IMAGES        ← every photo URL, in one place
   2. PRODUCTS      ← the signature pieces
   3. STRINGS       ← English (default) + Korean
   4. State + helpers
   5. Photo frames + fallback
   6. Hero cross-fade
   7. Signature pieces: filter, masonry, save
   8. Full-screen product view
   9. Bag drawer: bag → checkout → thank you, saved
   10. Search, menu, booking modal, newsletter
   11. Language, header, parallax, reveal, boot
   ========================================================= */

/* ---------- 1. IMAGES ----------
   To use the client's own photos, put them in an /images folder next to
   index.html and replace the URL, e.g.  "col-sari": "images/sari.jpg",
   Any URL that fails shows a deep-green panel with a gold border and the
   piece's name instead. */
const U = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMAGES = {
  // Hero (slow cross-fade)
  "hero-1": U("1783638204102-c20f956b5663", 2400),   // Himalaya at dusk
  "hero-2": U("1763610642571-7f81d5afa73f", 2000),   // Tihar oil lamps
  "hero-3": U("1742038106844-d976720a45df", 2000),   // emerald sari at night

  // The Collections
  "col-sari":     U("1610276580899-53d1af1a1359"),
  "col-kurtha":   U("1771507057209-08252afbe9ef"),
  "col-pashmina": U("1675726205553-4e348f24da2c"),
  "col-dhaka":    U("1640292343595-889db1c8262e"),

  // The Artisan's Hand
  "step-1": U("1719154717733-d37860cdee24", 900),
  "step-2": U("1671535108620-d169ce916f09", 900),
  "step-3": U("1731227102390-15f6200d625e", 900),

  // Quote, styling, menu
  "quote":         U("1606060164899-f426d29c1814", 2200),
  "styling-main":  U("1769275061786-c33ab1a284c8", 1200),
  "styling-inset": U("1600685890506-593fdf55949b", 700),
  "menu":          U("1637846959991-18e54d6e2035", 1200),

  // Fabric close-ups used as the third image in the product gallery
  "tex-silk":       U("1518893063132-36e46dbe2428", 1200),
  "tex-embroidery": U("1779385551576-cc0d7cd71409", 1200),
  "tex-pashmina":   U("1676696706907-0e04665b80bd", 1200),
  "tex-dhaka":      U("1780666274721-f7d8aa1d9a0c", 1200),

  // Products (keys match product ids)
  "emerald-sari":     U("1742038107108-3bdda21485d2"),
  "forest-sari":      U("1756483510818-060b42c7cecc"),
  "champagne-kurtha": U("1756483509164-e9e652cb51bb"),
  "noir-kurtha":      U("1760043971543-e4930d2e2513"),
  "obsidian-cholo":   U("1756483510830-f5b6e0150f74"),
  "crimson-cholo":    U("1610047614301-13c63f00c032"),
  "charcoal-pashmina":U("1516239482977-b550ba7253f2"),
  "moonlight-wrap":   U("1705164455665-d65a04d387d2"),
  "palpali-stole":    U("1781450952108-a6f511e71b05"),
  "midnight-dhaka":   U("1772380407462-28c8105ed698"),
};

/* Crop anchors (CSS object-position) so faces stay in frame */
const FOCUS = {
  "hero-2": "50% 64%",
  "hero-3": "55% 38%",
  "col-sari": "50% 30%",
  "col-kurtha": "50% 30%",
  "col-pashmina": "50% 30%",
  "step-1": "50% 30%",
  "styling-main": "50% 40%",
  "styling-inset": "50% 20%",
  "emerald-sari": "50% 30%",
  "forest-sari": "50% 25%",
  "noir-kurtha": "50% 25%",
  "crimson-cholo": "50% 20%",
  "charcoal-pashmina": "50% 30%",
  "moonlight-wrap": "50% 30%",
};

const HERO_SLIDES = [
  { img: "hero-1", caption: { en: "Annapurna range at dusk", ko: "해 질 녘의 안나푸르나" } },
  { img: "hero-2", caption: { en: "Tihar lamps, Bhaktapur", ko: "티하르의 등불, 박타푸르" } },
  { img: "hero-3", caption: { en: "Emerald silk, Kathmandu", ko: "에메랄드 실크, 카트만두" } },
];
const HERO_MS = 6000;

/* ---------- 2. PRODUCTS ----------
   ratio   — image shape in the masonry (makes the gallery asymmetric)
   limited — number of pieces in the run (shows a "Limited" badge), or 0 */
const CATEGORIES = ["sari", "kurtha", "gunyu", "dhaka", "pashmina"];

const PRODUCTS = [
  {
    id: "emerald-sari", cat: "sari", price: 290000, limited: 12, ratio: "3 / 4.4", tex: "tex-silk",
    name: { en: "Emerald Night Silk Sari", ko: "에메랄드 나이트 실크 사리" },
    desc: { en: "Deep emerald silk with a hand-sewn sequin border, woven in the Kathmandu Valley for evenings that glow.", ko: "손으로 단 시퀸 보더의 딥 에메랄드 실크. 카트만두 계곡에서 짠, 빛나는 밤을 위한 사리." },
    fabric: { en: "Pure mulberry silk, hand-sewn sequins", ko: "100% 멀버리 실크, 수작업 시퀸" },
    region: { en: "Kathmandu Valley", ko: "카트만두 계곡" }, days: 18,
    sizes: ["Free"],
  },
  {
    id: "champagne-kurtha", cat: "kurtha", price: 260000, limited: 20, ratio: "4 / 5",  tex: "tex-embroidery",
    name: { en: "Champagne Zari Anarkali Kurtha", ko: "샴페인 자리 아나르칼리 쿠르타" },
    desc: { en: "A floor-length anarkali in silk tissue, its sleeves traced in gold zari by the embroiderers of Patan.", ko: "실크 티슈로 지은 롱 아나르칼리. 파탄의 자수 장인이 소매에 골드 자리를 수놓았습니다." },
    fabric: { en: "Silk tissue, gold zari embroidery", ko: "실크 티슈, 골드 자리 자수" },
    region: { en: "Patan, Lalitpur", ko: "랄릿푸르 파탄" }, days: 21,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "charcoal-pashmina", cat: "pashmina", price: 180000, limited: 0, ratio: "1 / 1.25", tex: "tex-pashmina",
    name: { en: "Charcoal Paisley Pashmina", ko: "차콜 페이즐리 파시미나" },
    desc: { en: "Chyangra pashmina from the high pastures of Mustang, hand-loomed with a smoky paisley border.", ko: "무스탕 고원의 창그라 파시미나를 손으로 짜고, 스모키한 페이즐리 보더를 더했습니다." },
    fabric: { en: "100% chyangra pashmina", ko: "창그라 파시미나 100%" },
    region: { en: "Mustang", ko: "무스탕" }, days: 9,
    sizes: ["Free"],
  },
  {
    id: "obsidian-cholo", cat: "gunyu", price: 310000, limited: 8, ratio: "3 / 4.6", tex: "tex-embroidery",
    name: { en: "Obsidian Gunyu Cholo", ko: "옵시디언 구뉴 촐로" },
    desc: { en: "A velvet cholo and hand-embroidered gunyu skirt in midnight black — the hill-country dress of Pokhara, made for the city.", ko: "벨벳 촐로와 손자수 구뉴 스커트, 미드나잇 블랙. 포카라의 전통 의상을 도시의 밤에 맞게 다시 지었습니다." },
    fabric: { en: "Silk velvet, hand embroidery", ko: "실크 벨벳, 손자수" },
    region: { en: "Pokhara, Kaski", ko: "카스키 포카라" }, days: 26,
    sizes: ["S", "M", "L"],
  },
  {
    id: "palpali-stole", cat: "dhaka", price: 150000, limited: 0, ratio: "3 / 4", tex: "tex-dhaka",
    name: { en: "Palpali Dhaka Stole", ko: "팔파 다카 스톨" },
    desc: { en: "Handloom dhaka from Palpa, its diamonds counted by eye on a wooden loom — no two stoles are alike.", ko: "팔파의 나무 베틀에서 눈으로 세어 짠 다카. 같은 무늬의 스톨은 하나도 없습니다." },
    fabric: { en: "Handloom cotton dhaka", ko: "핸드룸 코튼 다카" },
    region: { en: "Palpa", ko: "팔파" }, days: 7,
    sizes: ["Free"],
  },
  {
    id: "forest-sari", cat: "sari", price: 340000, limited: 10, ratio: "3 / 4.2", tex: "tex-silk",
    name: { en: "Forest Organza Sari", ko: "포레스트 오간자 사리" },
    desc: { en: "Forest-green organza scattered with silk-thread blossoms, finished in Bhaktapur over twenty-four days.", ko: "실크 실 꽃자수를 흩뿌린 포레스트 그린 오간자. 박타푸르에서 24일에 걸쳐 완성했습니다." },
    fabric: { en: "Silk organza, silk-thread embroidery", ko: "실크 오간자, 실크 실 자수" },
    region: { en: "Bhaktapur", ko: "박타푸르" }, days: 24,
    sizes: ["Free"],
  },
  {
    id: "noir-kurtha", cat: "kurtha", price: 220000, limited: 0, ratio: "3 / 4.8", tex: "tex-embroidery",
    name: { en: "Noir Embroidered Kurtha", ko: "누아르 자수 쿠르타" },
    desc: { en: "Black silk velvet with a single column of gold embroidery — evening wear, cut in Kathmandu.", ko: "골드 자수 한 줄을 세로로 놓은 블랙 실크 벨벳. 카트만두에서 재단한 이브닝 쿠르타." },
    fabric: { en: "Silk velvet, gold-thread embroidery", ko: "실크 벨벳, 골드 실 자수" },
    region: { en: "Kathmandu", ko: "카트만두" }, days: 14,
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "midnight-dhaka", cat: "dhaka", price: 210000, limited: 0, ratio: "1 / 1.1", tex: "tex-dhaka",
    name: { en: "Midnight Dhaka Shawl", ko: "미드나잇 다카 숄" },
    desc: { en: "A wool-and-silk dhaka shawl in ink, rust and teal, woven in Tehrathum for long winter nights.", ko: "잉크, 러스트, 틸 컬러의 울·실크 다카 숄. 테라툼에서 겨울밤을 위해 짰습니다." },
    fabric: { en: "Wool and silk dhaka weave", ko: "울·실크 다카 직조" },
    region: { en: "Tehrathum", ko: "테라툼" }, days: 12,
    sizes: ["Free"],
  },
  {
    id: "crimson-cholo", cat: "gunyu", price: 390000, limited: 5, ratio: "3 / 4.3", tex: "tex-silk",
    name: { en: "Crimson Bridal Cholo Set", ko: "크림슨 브라이덜 촐로 세트" },
    desc: { en: "Silk brocade and zardozi for the wedding day, stitched by bridal tailors in Janakpur. Only five made this season.", ko: "결혼식을 위한 실크 브로케이드와 자르도지. 자나크푸르의 웨딩 재단사가 지었으며, 이번 시즌 단 다섯 벌." },
    fabric: { en: "Silk brocade, zardozi embroidery", ko: "실크 브로케이드, 자르도지 자수" },
    region: { en: "Janakpur", ko: "자나크푸르" }, days: 34,
    sizes: ["S", "M", "L"],
  },
  {
    id: "moonlight-wrap", cat: "pashmina", price: 170000, limited: 0, ratio: "4 / 5.2", tex: "tex-pashmina",
    name: { en: "Moonlight Pashmina Wrap", ko: "문라이트 파시미나 랩" },
    desc: { en: "Pashmina and silk in a soft moss tone, light enough to wear over evening silk all year round.", ko: "부드러운 모스 톤의 파시미나·실크 랩. 사계절 이브닝 드레스 위에 두를 만큼 가볍습니다." },
    fabric: { en: "70% pashmina, 30% silk", ko: "파시미나 70%, 실크 30%" },
    region: { en: "Kathmandu", ko: "카트만두" }, days: 8,
    sizes: ["Free"],
  },
];

const FREE_SHIP = 0; // all orders ship free to Korea

/* ---------- 3. STRINGS ---------- */
const STRINGS = {
  en: {
    "hd.menu": "Menu", "hd.bag": "Bag",
    "hero.kicker": "Handcrafted in Nepal · Delivered to Korea",
    "hero.t1": "Woven in the", "hero.t2": "Himalayas",
    "hero.sub": "Saris, kurthas and pashmina made slowly, by hand, in the valleys of Nepal — and brought to Korea one piece at a time.",
    "hero.cta": "Discover the Collection", "hero.scroll": "Scroll",

    "col.label": "The Collections", "col.title": "Four crafts,<br><em>one mountain.</em>", "col.cta": "View the pieces",
    "col.sari": "Sari", "col.sariT": "Six yards of silk that remember every hand that held them. Draped for weddings, for temples, for the nights that matter.",
    "col.kurtha": "Kurtha", "col.kurthaT": "The quiet elegance of everyday Nepal — long lines, soft silk, embroidery stitched slowly by lamplight.",
    "col.pashmina": "Pashmina", "col.pashminaT": "Combed from mountain goats at four thousand metres. Lighter than breath, warmer than a Seoul winter asks for.",
    "col.dhaka": "Dhaka", "col.dhakaT": "Geometry from Palpa's wooden looms — every diamond counted by eye, every thread placed by hand.",

    "art.label": "The Artisan's Hand", "art.title": "From the loom<br>to your door.",
    "art.lede": "Each HIMALI piece passes through three pairs of hands before it reaches yours. We pay every artisan fairly, and we name them.",
    "art.s1": "Handwoven in Nepal", "art.s1t": "Cloth is woven on wooden looms in Palpa, Bhaktapur and the high valleys — a sari can take three weeks.",
    "art.s2": "Finished by Artisans", "art.s2t": "Master tailors in Kathmandu cut, embroider and hand-finish every hem, then sign the label inside.",
    "art.s3": "Delivered to Korea", "art.s3t": "Wrapped in hand-made lokta paper and flown to Seoul — at your door in 7 to 12 days, duties included.",

    "pc.label": "Signature Pieces", "pc.title": "Made in small<br><em>numbers.</em>",

    "q.text": "Every thread carries a story.",
    "q.note": "In Nepal, cloth is still made the slow way — spun, dyed and woven by families who have kept the same patterns for generations. When you wear HIMALI, you carry a little of their story with you.",
    "q.cite": "— The weavers of Palpa",

    "st.label": "Private Styling", "st.title": "Dressed for<br><em>the day itself.</em>",
    "st.lede": "For weddings, Dashain, Tihar and every occasion that deserves more than a click, our stylists will help you choose — and teach you how to wear it. A free 30-minute consultation over KakaoTalk, in Korean or English.",
    "st.o1": "Weddings & engagements", "st.o2": "Dashain & Tihar", "st.o3": "Teej & family celebrations", "st.o4": "Sari draping lessons",
    "st.cta": "Book via KakaoTalk",

    "b.1": "Authentic Handmade", "b.1t": "Every piece signed by its maker",
    "b.2": "Secure Payment", "b.2t": "KakaoPay, Naver Pay, Toss & cards",
    "b.3": "Korea-Wide Delivery", "b.3t": "7–12 days, duties included",
    "b.4": "Gift Packaging", "b.4t": "Wrapped in hand-made lokta paper",

    "nl.title": "Join the<br><em>Inner Circle.</em>", "nl.short": "Inner Circle",
    "nl.text": "First access to limited runs, private trunk shows in Seoul, and letters from our weavers — four times a year, never more.",
    "nl.ph": "Your email address", "nl.cta": "Subscribe",
    "nl.ok": "Welcome to the Inner Circle. Your first letter is on its way.", "nl.err": "Please enter a valid email address.",

    "ft.atelier": "Atelier", "ft.addr1": "Thamel, Kathmandu, Nepal", "ft.addr2": "Showroom by appointment · Hannam-dong, Seoul",
    "ft.contact": "Client Services", "ft.kakao": "KakaoTalk @himali", "ft.hours": "Mon–Sat, 11:00–19:00 KST",
    "ft.follow": "Follow", "ft.policies": "Policies", "ft.ship": "Shipping & Duties", "ft.returns": "Returns", "ft.privacy": "Privacy", "ft.terms": "Terms",
    "ft.rights": "All rights reserved.",
    "ft.legal": "HIMALI Korea (demo) · Business Reg. No. 000-00-00000 · Mail-order Reg. 0000-서울-0000 · Placeholder details for a design demo · Photos: Unsplash",

    "ui.close": "Close", "ui.search": "Search", "ui.saved": "Saved",
    "ui.searchLabel": "Search the collection", "ui.searchPh": "Sari, pashmina, Palpa…",
    "ui.noResults": "Nothing matches — try “silk”, “dhaka” or “Pokhara”.",
    "ui.demo": "This page is part of the full build.",

    "cat.all": "All", "cat.sari": "Sari", "cat.kurtha": "Kurtha", "cat.gunyu": "Gunyu Cholo", "cat.dhaka": "Dhaka", "cat.pashmina": "Pashmina",
    "pc.limited": "Limited", "pc.empty": "No pieces in this collection yet.",
    "pc.note": "Every piece is numbered, signed by its maker and made in runs of five to twenty. When a run is gone, it is gone.",
    "pc.noteSign": "— Ten pieces this season",

    "pv.size": "Size", "pv.guide": "Made to your measurements on request", "pv.free": "One size",
    "pv.add": "Add to Bag", "pv.limitedOf": "Limited edition · {n} pieces",
    "pv.fabric": "Fabric", "pv.region": "Region", "pv.making": "Making time", "pv.care": "Care", "pv.delivery": "Delivery",
    "pv.days": "{n} days by hand", "pv.careT": "Dry clean only. Store folded in the muslin bag provided.",
    "pv.deliveryT": "7–12 days to anywhere in Korea · free, duties included",
    "pv.pick": "Please choose a size", "pv.added": "Added to your bag",
    "pv.saved": "Saved", "pv.unsaved": "Removed from saved",

    "bag.emptyH": "Your bag is empty.", "bag.emptyT": "Each piece is made in small numbers — take your time.",
    "bag.emptyCta": "Discover the pieces", "saved.emptyH": "Nothing saved yet.", "saved.emptyT": "Tap the heart on any piece to keep it here.",
    "bag.remove": "Remove", "bag.subtotal": "Subtotal", "bag.shipping": "Delivery to Korea", "bag.free": "Complimentary",
    "bag.total": "Total", "bag.checkout": "Proceed to Checkout", "bag.note": "Duties and taxes included. Gift-wrapped in lokta paper.",
    "bag.move": "Add to Bag", "bag.size": "Size",
    "co.details": "01 — Delivery", "co.pay": "02 — Payment", "co.name": "Name", "co.phone": "Phone", "co.address": "Address",
    "co.card": "Credit Card", "co.place": "Place Order · {amount}", "co.processing": "Placing your order…",
    "co.demo": "Design demo — no payment is taken.", "co.fill": "Please complete your delivery details.",
    "ty.title": "Thank you.", "ty.text": "Your pieces are being wrapped by hand in Kathmandu. We'll message you on KakaoTalk when they leave for Seoul.",
    "ty.order": "Order", "ty.paid": "Paid with", "ty.arrive": "Arriving", "ty.total": "Total", "ty.continue": "Continue browsing",

    "bk.label": "Private Styling", "bk.title": "Book a consultation",
    "bk.lede": "Tell us a little about your occasion. A HIMALI stylist will message you on KakaoTalk within one day.",
    "bk.name": "Your name", "bk.kakao": "KakaoTalk ID or phone", "bk.occasion": "Occasion", "bk.date": "Event date", "bk.note": "Anything we should know?",
    "bk.o1": "Wedding", "bk.o2": "Dashain / Tihar", "bk.o3": "Teej / family celebration", "bk.o4": "Sari draping lesson", "bk.o5": "Other",
    "bk.send": "Request Consultation", "bk.fill": "Please add your name and KakaoTalk ID.",
    "bk.thanks": "Thank you.", "bk.thanksT": "Your request has been received. A stylist will message you on KakaoTalk shortly.",
  },

  ko: {
    "hd.menu": "메뉴", "hd.bag": "쇼핑백",
    "hero.kicker": "네팔 핸드메이드 · 한국 직배송",
    "hero.t1": "히말라야에서 짜낸", "hero.t2": "한 벌의 옷",
    "hero.sub": "네팔의 계곡에서 손으로, 천천히 만든 사리와 쿠르타, 파시미나. 한 벌씩 한국으로 전합니다.",
    "hero.cta": "컬렉션 보기", "hero.scroll": "스크롤",

    "col.label": "컬렉션", "col.title": "네 가지 손길,<br><em>하나의 산.</em>", "col.cta": "작품 보기",
    "col.sari": "사리", "col.sariT": "그것을 쥐었던 모든 손을 기억하는 여섯 야드의 실크. 결혼식과 사원, 그리고 소중한 밤을 위해.",
    "col.kurtha": "쿠르타", "col.kurthaT": "네팔 일상의 조용한 우아함. 긴 실루엣, 부드러운 실크, 등불 아래 천천히 놓은 자수.",
    "col.pashmina": "파시미나", "col.pashminaT": "해발 4,000미터 산양에게서 빗어 낸 털. 숨결보다 가볍고, 서울의 겨울보다 따뜻합니다.",
    "col.dhaka": "다카", "col.dhakaT": "팔파의 나무 베틀이 만든 기하학. 모든 다이아몬드를 눈으로 세고, 모든 실을 손으로 놓습니다.",

    "art.label": "장인의 손", "art.title": "베틀에서<br>당신의 문 앞까지.",
    "art.lede": "모든 HIMALI의 옷은 세 쌍의 손을 거쳐 당신에게 닿습니다. 우리는 모든 장인에게 공정한 대가를 지불하고, 그들의 이름을 기록합니다.",
    "art.s1": "네팔에서 손으로 짜다", "art.s1t": "팔파, 박타푸르, 고산 계곡의 나무 베틀에서 원단을 짭니다. 사리 한 벌에 3주가 걸리기도 합니다.",
    "art.s2": "장인이 완성하다", "art.s2t": "카트만두의 마스터 재단사가 재단하고 수놓고, 모든 단을 손으로 마감한 뒤 라벨에 서명합니다.",
    "art.s3": "한국으로 전하다", "art.s3t": "손으로 만든 록타 종이에 싸서 서울로 보냅니다. 관세 포함, 7–12일 안에 문 앞까지.",

    "pc.label": "시그니처 피스", "pc.title": "소량으로만<br><em>만듭니다.</em>",

    "q.text": "모든 실에는 이야기가 담겨 있습니다.",
    "q.note": "네팔에서는 지금도 천을 느린 방식으로 만듭니다. 몇 세대에 걸쳐 같은 문양을 지켜 온 가족들이 실을 잣고, 물들이고, 짭니다. HIMALI를 입는 순간, 당신도 그 이야기의 일부가 됩니다.",
    "q.cite": "— 팔파의 직조 장인들",

    "st.label": "프라이빗 스타일링", "st.title": "그날을 위한<br><em>한 벌.</em>",
    "st.lede": "결혼식, 다사인, 티하르처럼 클릭 한 번보다 더 큰 정성이 필요한 날. HIMALI 스타일리스트가 고르는 것부터 입는 법까지 도와드립니다. 카카오톡으로 진행하는 무료 30분 상담, 한국어·영어 모두 가능합니다.",
    "st.o1": "결혼식 & 약혼식", "st.o2": "다사인 & 티하르", "st.o3": "티즈 & 가족 행사", "st.o4": "사리 드레이핑 레슨",
    "st.cta": "카카오톡으로 예약하기",

    "b.1": "정품 핸드메이드", "b.1t": "모든 작품에 장인의 서명",
    "b.2": "안전한 결제", "b.2t": "카카오페이, 네이버페이, 토스, 카드",
    "b.3": "한국 전역 배송", "b.3t": "7–12일, 관세 포함",
    "b.4": "선물 포장", "b.4t": "수제 록타 종이 포장",

    "nl.title": "이너 서클에<br><em>초대합니다.</em>", "nl.short": "이너 서클",
    "nl.text": "한정 컬렉션 우선 구매, 서울 프라이빗 트렁크쇼, 그리고 직조 장인들의 편지. 1년에 네 번, 그 이상은 보내지 않습니다.",
    "nl.ph": "이메일 주소", "nl.cta": "구독하기",
    "nl.ok": "이너 서클에 오신 것을 환영합니다. 첫 편지가 곧 도착합니다.", "nl.err": "올바른 이메일 주소를 입력해 주세요.",

    "ft.atelier": "아틀리에", "ft.addr1": "네팔 카트만두 타멜", "ft.addr2": "서울 한남동 쇼룸 · 예약제",
    "ft.contact": "고객 서비스", "ft.kakao": "카카오톡 @himali", "ft.hours": "월–토 11:00–19:00",
    "ft.follow": "팔로우", "ft.policies": "정책", "ft.ship": "배송 및 관세", "ft.returns": "반품", "ft.privacy": "개인정보처리방침", "ft.terms": "이용약관",
    "ft.rights": "모든 권리 보유.",
    "ft.legal": "HIMALI 코리아 (데모) · 사업자등록번호 000-00-00000 · 통신판매업신고 0000-서울-0000 · 디자인 데모용 예시 정보 · 사진: Unsplash",

    "ui.close": "닫기", "ui.search": "검색", "ui.saved": "저장",
    "ui.searchLabel": "컬렉션 검색", "ui.searchPh": "사리, 파시미나, 팔파…",
    "ui.noResults": "일치하는 작품이 없습니다. ‘실크’, ‘다카’, ‘포카라’로 검색해 보세요.",
    "ui.demo": "이 페이지는 실제 구축 시 제공됩니다.",

    "cat.all": "전체", "cat.sari": "사리", "cat.kurtha": "쿠르타", "cat.gunyu": "구뉴 촐로", "cat.dhaka": "다카", "cat.pashmina": "파시미나",
    "pc.limited": "한정", "pc.empty": "이 컬렉션의 작품을 준비 중입니다.",
    "pc.note": "모든 작품에는 번호와 장인의 서명이 있으며, 다섯 벌에서 스무 벌까지만 만듭니다. 한 번 소진되면 다시 만들지 않습니다.",
    "pc.noteSign": "— 이번 시즌 열 점의 작품",

    "pv.size": "사이즈", "pv.guide": "요청 시 맞춤 제작 가능", "pv.free": "원 사이즈",
    "pv.add": "쇼핑백에 담기", "pv.limitedOf": "한정판 · {n}벌",
    "pv.fabric": "소재", "pv.region": "지역", "pv.making": "제작 기간", "pv.care": "관리", "pv.delivery": "배송",
    "pv.days": "수작업 {n}일", "pv.careT": "드라이클리닝 전용. 동봉된 머슬린 백에 접어서 보관하세요.",
    "pv.deliveryT": "한국 전역 7–12일 · 무료 배송, 관세 포함",
    "pv.pick": "사이즈를 선택해 주세요", "pv.added": "쇼핑백에 담았습니다",
    "pv.saved": "저장했습니다", "pv.unsaved": "저장을 취소했습니다",

    "bag.emptyH": "쇼핑백이 비어 있습니다.", "bag.emptyT": "모든 작품은 소량으로 만들어집니다. 천천히 둘러보세요.",
    "bag.emptyCta": "작품 둘러보기", "saved.emptyH": "저장한 작품이 없습니다.", "saved.emptyT": "마음에 드는 작품의 하트를 눌러 보관하세요.",
    "bag.remove": "삭제", "bag.subtotal": "상품 금액", "bag.shipping": "한국 배송", "bag.free": "무료",
    "bag.total": "총 금액", "bag.checkout": "결제하기", "bag.note": "관세 및 세금 포함. 록타 종이로 선물 포장해 드립니다.",
    "bag.move": "쇼핑백에 담기", "bag.size": "사이즈",
    "co.details": "01 — 배송 정보", "co.pay": "02 — 결제 수단", "co.name": "이름", "co.phone": "휴대폰 번호", "co.address": "주소",
    "co.card": "신용카드", "co.place": "{amount} 주문하기", "co.processing": "주문 중…",
    "co.demo": "디자인 데모입니다 — 실제 결제는 이루어지지 않습니다.", "co.fill": "배송 정보를 모두 입력해 주세요.",
    "ty.title": "감사합니다.", "ty.text": "카트만두에서 손으로 정성껏 포장하고 있습니다. 서울로 출발하면 카카오톡으로 알려 드릴게요.",
    "ty.order": "주문번호", "ty.paid": "결제 수단", "ty.arrive": "도착 예정", "ty.total": "총 금액", "ty.continue": "계속 둘러보기",

    "bk.label": "프라이빗 스타일링", "bk.title": "상담 예약",
    "bk.lede": "어떤 날을 준비하시는지 알려 주세요. HIMALI 스타일리스트가 하루 안에 카카오톡으로 연락드립니다.",
    "bk.name": "이름", "bk.kakao": "카카오톡 ID 또는 휴대폰 번호", "bk.occasion": "행사", "bk.date": "행사 날짜", "bk.note": "전달하실 내용",
    "bk.o1": "결혼식", "bk.o2": "다사인 / 티하르", "bk.o3": "티즈 / 가족 행사", "bk.o4": "사리 드레이핑 레슨", "bk.o5": "기타",
    "bk.send": "상담 신청하기", "bk.fill": "이름과 카카오톡 ID를 입력해 주세요.",
    "bk.thanks": "감사합니다.", "bk.thanksT": "상담 신청이 접수되었습니다. 스타일리스트가 곧 카카오톡으로 연락드립니다.",
  },
};

/* ---------- 4. State + helpers ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem("himali." + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("himali." + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

const state = {
  lang: store.get("lang", "en"),
  filter: "all",
  bag: store.get("bag", []),            // [{ id, size, qty }]
  saved: new Set(store.get("saved", [])),
  view: null,                            // product id open in the full-screen view
  viewImg: 0,
  viewSize: null,
  drawerTab: "bag",
  drawerStep: "bag",                     // bag | checkout | thanks
  payment: "kakao",
  order: null,
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = (k, vars = {}) => {
  let s = STRINGS[state.lang][k] ?? STRINGS.en[k] ?? k;
  for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
  return s;
};
const L = (o) => (o ? o[state.lang] || o.en : "");
const won = (n) => "₩" + n.toLocaleString("ko-KR");
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const PAYMENTS = {
  kakao: { name: () => (state.lang === "ko" ? "카카오페이" : "KakaoPay"), mark: "Kakao" },
  naver: { name: () => (state.lang === "ko" ? "네이버페이" : "Naver Pay"), mark: "Naver" },
  toss:  { name: () => (state.lang === "ko" ? "토스페이" : "Toss Pay"), mark: "Toss" },
  card:  { name: () => t("co.card"), mark: "Visa · Master · Amex" },
};

/* ---------- 5. Photo frames + fallback ---------- */
function frameHTML(key, label = "", extra = "") {
  const pos = FOCUS[key] ? ` style="--pos:${FOCUS[key]}"` : "";
  return `<div class="frame ${extra}" data-img="${key}" data-label="${esc(label)}"${pos}></div>`;
}

// Fill every .frame[data-img] under root with its photo; broken/missing → fallback panel.
function hydrate(root = document) {
  $$(".frame[data-img]", root).forEach((f) => {
    if (f.dataset.done) return;
    f.dataset.done = "1";
    const key = f.dataset.img;
    if (FOCUS[key] && !f.style.getPropertyValue("--pos")) f.style.setProperty("--pos", FOCUS[key]);
    const src = IMAGES[key];
    if (!src) { f.classList.add("is-fallback"); return; }
    const img = new Image();
    img.alt = f.dataset.label || "";
    img.decoding = "async";
    if (!f.closest(".hero")) img.loading = "lazy";
    img.addEventListener("load", () => img.classList.add("on"));
    img.addEventListener("error", () => f.classList.add("is-fallback"));
    img.src = src;
    f.appendChild(img);
  });
}

/* ---------- 6. Hero cross-fade ---------- */
const hero = { i: 0, timer: null };

function buildHero() {
  $("#heroStage").innerHTML = HERO_SLIDES.map((s, i) =>
    `<div class="hero-slide${i === 0 ? " on" : ""}">${frameHTML(s.img, "HIMALI")}</div>`).join("");
  $("#heroBars").innerHTML = HERO_SLIDES.map(() => "<i></i>").join("");
  document.documentElement.style.setProperty("--slide-ms", HERO_MS + "ms");
  hydrate($("#heroStage"));
  showHero(0);
  hero.timer = setInterval(() => showHero((hero.i + 1) % HERO_SLIDES.length), HERO_MS);
}

function showHero(i) {
  hero.i = i;
  $$(".hero-slide").forEach((s, n) => s.classList.toggle("on", n === i));
  $$("#heroBars i").forEach((b, n) => {
    b.classList.remove("run");
    b.classList.toggle("done", n < i);
    if (n === i) { void b.offsetWidth; b.classList.add("run"); }
  });
  $("#heroNum").textContent = String(i + 1).padStart(2, "0");
  $("#heroCaption").textContent = L(HERO_SLIDES[i].caption);
}

/* ---------- 7. Signature pieces ---------- */
function renderFilters() {
  const ids = ["all", ...CATEGORIES];
  $("#filters").innerHTML = ids.map((id, n) =>
    `${n ? '<span class="sep" aria-hidden="true">/</span>' : ""}<button class="${state.filter === id ? "on" : ""}" data-filter="${id}" aria-pressed="${state.filter === id}">${esc(t("cat." + id))}</button>`).join("");
}

function pieceHTML(p, n) {
  const on = state.saved.has(p.id);
  return `
  <article class="piece" data-piece="${p.id}" style="animation-delay:${n * 0.08}s" tabindex="0" aria-label="${esc(L(p.name))}">
    <div class="piece-img" style="--ratio:${p.ratio}">
      ${frameHTML(p.id, L(p.name))}
      ${p.limited ? `<span class="piece-limited">${esc(t("pc.limited"))}</span>` : ""}
      <button class="piece-save ${on ? "on" : ""}" data-save="${p.id}" aria-pressed="${on}" aria-label="${esc(t("ui.saved"))}">
        <svg><use href="#${on ? "ic-heart-on" : "ic-heart"}"/></svg>
      </button>
    </div>
    <div class="piece-cap">
      <div>
        <span class="piece-no">No. ${String(PRODUCTS.indexOf(p) + 1).padStart(2, "0")}</span>
        <h3 class="piece-name">${esc(L(p.name))}</h3>
        <span class="piece-alt">${esc(state.lang === "ko" ? p.name.en : p.name.ko)}</span>
      </div>
      <span class="piece-price">${won(p.price)}</span>
    </div>
  </article>`;
}

function renderPieces() {
  const list = state.filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === state.filter);
  // an editorial note opens the first column, so the columns start at different heights
  const note = state.filter === "all"
    ? `<div class="masonry-note"><p>${esc(t("pc.note"))}</p><span>${esc(t("pc.noteSign"))}</span></div>` : "";
  $("#masonry").innerHTML = list.length ? note + list.map(pieceHTML).join("") : `<p class="empty">${esc(t("pc.empty"))}</p>`;
  hydrate($("#masonry"));
  renderFilters();
}

function setFilter(f) { state.filter = f; renderPieces(); }

function toggleSaved(id, btn) {
  const on = !state.saved.has(id);
  on ? state.saved.add(id) : state.saved.delete(id);
  store.set("saved", [...state.saved]);
  $$(`[data-save="${id}"]`).forEach((b) => {
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
    const use = $("use", b);
    if (use) use.setAttribute("href", on ? "#ic-heart-on" : "#ic-heart");
  });
  if (btn) { btn.classList.remove("pulse"); void btn.offsetWidth; btn.classList.add("pulse"); }
  updateCounts();
  toast(t(on ? "pv.saved" : "pv.unsaved") + ` — <b>${esc(L(byId(id).name))}</b>`);
  if (isOpen("#drawer") && state.drawerTab === "saved") renderDrawer();
}

function initPieces() {
  renderPieces();
  $("#filters").addEventListener("click", (e) => { const b = e.target.closest("[data-filter]"); if (b) setFilter(b.dataset.filter); });
  $("#masonry").addEventListener("click", (e) => {
    const s = e.target.closest("[data-save]");
    if (s) { e.stopPropagation(); toggleSaved(s.dataset.save, s); return; }
    const p = e.target.closest("[data-piece]");
    if (p) openView(p.dataset.piece);
  });
  $("#masonry").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches("[data-piece]")) openView(e.target.dataset.piece);
  });
  // "View the pieces" in each collection block → filter + scroll
  $$("[data-filter-jump]").forEach((b) => b.addEventListener("click", () => {
    setFilter(b.dataset.filterJump);
    $("#pieces").scrollIntoView({ behavior: "smooth" });
  }));
}

/* ---------- Overlay plumbing ---------- */
let lastFocus = null;
const OVERLAYS = ["#menu", "#search", "#pv", "#drawer", "#book"];
const isOpen = (sel) => $(sel).classList.contains("open");

function openOverlay(sel, { shade = false } = {}) {
  if (!OVERLAYS.some(isOpen)) lastFocus = document.activeElement;
  OVERLAYS.filter((s) => s !== sel).forEach((s) => closeOne(s));
  const el = $(sel);
  el.classList.add("open");
  el.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  const sh = $("#shade");
  if (shade) { sh.hidden = false; requestAnimationFrame(() => sh.classList.add("on")); }
  else hideShade();
}

function closeOne(sel) {
  const el = $(sel);
  el.classList.remove("open");
  el.setAttribute("aria-hidden", "true");
}

function hideShade() {
  const sh = $("#shade");
  sh.classList.remove("on");
  setTimeout(() => { if (!sh.classList.contains("on")) sh.hidden = true; }, 800);
}

function closeAll() {
  OVERLAYS.forEach(closeOne);
  hideShade();
  document.body.classList.remove("locked");
  state.view = null;
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

/* ---------- 8. Full-screen product view ---------- */
function viewImages(p) {
  // main photo, a close crop of the same photo, and a fabric close-up
  return [
    { key: p.id, zoom: false },
    { key: p.id, zoom: true },
    { key: p.tex, zoom: false },
  ];
}

function openView(id) {
  const p = byId(id);
  if (!p) return;
  state.view = id;
  state.viewImg = 0;
  state.viewSize = p.sizes.length === 1 ? p.sizes[0] : null;
  renderView();
  openOverlay("#pv");
  $("#pv").scrollTop = 0;
}

function renderView() {
  const p = byId(state.view);
  if (!p) return;
  const imgs = viewImages(p);
  const on = state.saved.has(p.id);

  $("#pvStage").innerHTML = imgs.map((im, i) =>
    frameHTML(im.key, L(p.name), `${im.zoom ? "zoom" : ""} ${i === state.viewImg ? "on" : ""}`)).join("");
  $("#pvThumbs").innerHTML = imgs.map((im, i) =>
    `<button class="${i === state.viewImg ? "on" : ""}" data-img-i="${i}" aria-label="Image ${i + 1}">${frameHTML(im.key, "", im.zoom ? "zoom" : "")}</button>`).join("");
  $("#pvCount").textContent = `${state.viewImg + 1} / ${imgs.length}`;
  hydrate($("#pv"));

  $("#pvInfo").innerHTML = `
    <p class="pv-cat">${esc(t("cat." + p.cat))} · No. ${String(PRODUCTS.indexOf(p) + 1).padStart(2, "0")}</p>
    <h2 class="pv-name">${esc(L(p.name))}</h2>
    <p class="pv-alt">${esc(state.lang === "ko" ? p.name.en : p.name.ko)}</p>
    <p class="pv-price">${won(p.price)}</p>
    ${p.limited ? `<span class="pv-limited">${esc(t("pv.limitedOf", { n: p.limited }))}</span>` : ""}
    <p class="pv-desc">${esc(L(p.desc))}</p>

    <p class="pv-label"><span>${esc(t("pv.size"))}</span><span>${p.sizes.length > 1 ? esc(t("pv.guide")) : ""}</span></p>
    <div class="pv-sizes" id="pvSizes">
      ${p.sizes.map((s) => `<button class="${state.viewSize === s ? "on" : ""}" data-size="${s}" aria-pressed="${state.viewSize === s}">${s === "Free" ? esc(t("pv.free")) : s}</button>`).join("")}
    </div>

    <div class="pv-actions">
      <button class="btn-gold solid block" id="pvAdd"><span>${esc(t("pv.add"))} — ${won(p.price)}</span></button>
      <button class="pv-save ${on ? "on" : ""}" data-save="${p.id}" aria-pressed="${on}" aria-label="${esc(t("ui.saved"))}"><svg><use href="#${on ? "ic-heart-on" : "ic-heart"}"/></svg></button>
    </div>

    <dl class="pv-details">
      <div><dt>${esc(t("pv.fabric"))}</dt><dd>${esc(L(p.fabric))}</dd></div>
      <div><dt>${esc(t("pv.region"))}</dt><dd>${esc(L(p.region))}</dd></div>
      <div><dt>${esc(t("pv.making"))}</dt><dd>${esc(t("pv.days", { n: p.days }))}</dd></div>
      <div><dt>${esc(t("pv.care"))}</dt><dd>${esc(t("pv.careT"))}</dd></div>
      <div><dt>${esc(t("pv.delivery"))}</dt><dd>${esc(t("pv.deliveryT"))}</dd></div>
    </dl>`;
}

function showViewImg(i) {
  const n = 3;
  state.viewImg = (i + n) % n;
  $$("#pvStage .frame").forEach((f, k) => f.classList.toggle("on", k === state.viewImg));
  $$("#pvThumbs button").forEach((b, k) => b.classList.toggle("on", k === state.viewImg));
  $("#pvCount").textContent = `${state.viewImg + 1} / ${n}`;
}

function initView() {
  $("#pvPrev").addEventListener("click", () => showViewImg(state.viewImg - 1));
  $("#pvNext").addEventListener("click", () => showViewImg(state.viewImg + 1));
  $("#pvThumbs").addEventListener("click", (e) => { const b = e.target.closest("[data-img-i]"); if (b) showViewImg(+b.dataset.imgI); });

  $("#pvInfo").addEventListener("click", (e) => {
    const size = e.target.closest("[data-size]");
    if (size) {
      state.viewSize = size.dataset.size;
      $$("#pvSizes button").forEach((b) => { const on = b === size; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      return;
    }
    const save = e.target.closest("[data-save]");
    if (save) { toggleSaved(save.dataset.save, save); return; }
    if (e.target.closest("#pvAdd")) {
      if (!state.viewSize) {
        const s = $("#pvSizes");
        s.classList.remove("nudge"); void s.offsetWidth; s.classList.add("nudge");
        toast(t("pv.pick"));
        return;
      }
      addToBag(state.view, state.viewSize);
      state.drawerTab = "bag"; state.drawerStep = "bag";
      openDrawer();
    }
  });

  // swipe between gallery images on touch screens
  let x0 = null;
  $("#pvStage").addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  $("#pvStage").addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) showViewImg(state.viewImg + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  document.addEventListener("keydown", (e) => {
    if (!isOpen("#pv")) return;
    if (e.key === "ArrowRight") showViewImg(state.viewImg + 1);
    if (e.key === "ArrowLeft") showViewImg(state.viewImg - 1);
  });
}

/* ---------- 9. Bag drawer ---------- */
function addToBag(id, size, qty = 1) {
  const line = state.bag.find((l) => l.id === id && l.size === size);
  line ? (line.qty += qty) : state.bag.push({ id, size, qty });
  saveBag();
  updateCounts(true);
  toast(`${t("pv.added")} — <b>${esc(L(byId(id).name))}</b>`);
}
function saveBag() { store.set("bag", state.bag); }
const bagQty = () => state.bag.reduce((n, l) => n + l.qty, 0);
const bagTotal = () => state.bag.reduce((n, l) => n + byId(l.id).price * l.qty, 0);

function updateCounts(bump = false) {
  $$('[data-count="bag"]').forEach((el) => { el.textContent = bagQty(); });
  $$('[data-count="saved"]').forEach((el) => { el.textContent = el.tagName === "SUP" ? (state.saved.size || "") : state.saved.size; });
  if (bump) { const b = $(".hd-bag"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
}

function openDrawer() {
  renderDrawer();
  openOverlay("#drawer", { shade: true });
}

function renderDrawer() {
  $$("#drawerTabs [data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === state.drawerTab));
  const body = $("#drawerBody");
  const foot = $("#drawerFoot");
  body.scrollTop = 0;
  if (state.drawerTab === "saved") return drawSaved(body, foot);
  ({ bag: drawBag, checkout: drawCheckout, thanks: drawThanks })[state.drawerStep](body, foot);
  hydrate(body);
}

function emptyHTML(h, p) {
  return `<div class="drawer-empty"><p>${esc(t(h))}</p><p>${esc(t(p))}</p>
    <a href="#pieces" class="link-gold" data-close-go><span>${esc(t("bag.emptyCta"))}</span><svg><use href="#ic-arrow"/></svg></a></div>`;
}

function drawBag(body, foot) {
  if (!state.bag.length) { body.innerHTML = emptyHTML("bag.emptyH", "bag.emptyT"); foot.innerHTML = ""; return; }
  body.innerHTML = state.bag.map((l, i) => {
    const p = byId(l.id);
    return `<div class="bag-line">
      <div class="thumb">${frameHTML(p.id, L(p.name))}</div>
      <div>
        <h4>${esc(L(p.name))}</h4>
        <p class="bag-meta">${esc(t("cat." + p.cat))} · ${esc(t("bag.size"))} ${l.size === "Free" ? esc(t("pv.free")) : l.size}</p>
        <div class="bag-row">
          <span class="qty"><button data-q="${i}" data-d="-1" aria-label="−">−</button>${l.qty}<button data-q="${i}" data-d="1" aria-label="+">+</button></span>
          <span class="bag-price">${won(p.price * l.qty)}</span>
        </div>
        <button class="bag-remove" data-rm="${i}">${esc(t("bag.remove"))}</button>
      </div>
    </div>`;
  }).join("");
  foot.innerHTML = `
    <div class="totals">
      <div><span>${esc(t("bag.subtotal"))}</span><span>${won(bagTotal())}</span></div>
      <div><span>${esc(t("bag.shipping"))}</span><span>${esc(t("bag.free"))}</span></div>
      <div class="grand"><span>${esc(t("bag.total"))}</span><span>${won(bagTotal() + FREE_SHIP)}</span></div>
    </div>
    <button class="btn-gold solid block" id="toCheckout"><span>${esc(t("bag.checkout"))}</span><svg><use href="#ic-arrow"/></svg></button>
    <p class="drawer-note">${esc(t("bag.note"))}</p>`;

  $$("[data-q]", body).forEach((b) => b.addEventListener("click", () => {
    const l = state.bag[+b.dataset.q];
    l.qty += +b.dataset.d;
    if (l.qty < 1) state.bag.splice(+b.dataset.q, 1);
    saveBag(); updateCounts(); renderDrawer();
  }));
  $$("[data-rm]", body).forEach((b) => b.addEventListener("click", () => {
    state.bag.splice(+b.dataset.rm, 1);
    saveBag(); updateCounts(); renderDrawer();
  }));
  $("#toCheckout").addEventListener("click", () => { state.drawerStep = "checkout"; renderDrawer(); });
}

function drawCheckout(body, foot) {
  if (!state.bag.length) { state.drawerStep = "bag"; return renderDrawer(); }
  const ko = state.lang === "ko";
  // pre-filled so the flow can be demonstrated quickly
  body.innerHTML = `
    <p class="co-step">${esc(t("co.details"))}</p>
    <label class="co-field"><span>${esc(t("co.name"))}</span><input id="coName" value="${ko ? "이서연" : "Lee Seo-yeon"}" autocomplete="name"></label>
    <label class="co-field"><span>${esc(t("co.phone"))}</span><input id="coPhone" value="010-2345-6789" inputmode="tel" autocomplete="tel"></label>
    <label class="co-field"><span>${esc(t("co.address"))}</span><input id="coAddr" value="${ko ? "서울특별시 용산구 한남대로 00" : "00 Hannam-daero, Yongsan-gu, Seoul"}" autocomplete="street-address"></label>

    <p class="co-step">${esc(t("co.pay"))}</p>
    <div class="pay-list">
      ${Object.entries(PAYMENTS).map(([k, pm]) => `
        <button class="pay ${state.payment === k ? "on" : ""}" data-pay="${k}" aria-pressed="${state.payment === k}">
          <span class="pay-radio" aria-hidden="true"></span><span class="pay-name">${esc(pm.name())}</span><span class="pay-mark">${pm.mark}</span>
        </button>`).join("")}
    </div>
    <p class="drawer-note">${esc(t("co.demo"))}</p>`;
  foot.innerHTML = `
    <div class="totals"><div class="grand"><span>${esc(t("bag.total"))}</span><span>${won(bagTotal())}</span></div></div>
    <button class="btn-gold solid block" id="placeOrder"><span>${esc(t("co.place", { amount: won(bagTotal()) }))}</span></button>`;

  $$("[data-pay]", body).forEach((b) => b.addEventListener("click", () => {
    state.payment = b.dataset.pay;
    $$("[data-pay]", body).forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
  }));
  $("#placeOrder").addEventListener("click", (e) => {
    const fields = ["#coName", "#coPhone", "#coAddr"].map((s) => $(s, body));
    fields.forEach((f) => f.classList.toggle("bad", !f.value.trim()));
    if (fields.some((f) => !f.value.trim())) { toast(t("co.fill")); return; }
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.querySelector("span").textContent = t("co.processing");
    setTimeout(() => {
      const d = new Date();
      state.order = {
        no: "HM-" + d.getFullYear().toString().slice(2) + String(d.getMonth() + 1).padStart(2, "0") + "-" + Math.floor(1000 + Math.random() * 9000),
        total: bagTotal(), payment: state.payment,
        from: new Date(d.getTime() + 7 * 864e5), to: new Date(d.getTime() + 12 * 864e5),
      };
      state.bag = [];
      saveBag(); updateCounts();
      state.drawerStep = "thanks";
      renderDrawer();
    }, 1400);
  });
}

function drawThanks(body, foot) {
  const o = state.order;
  const f = (d) => d.toLocaleDateString(state.lang === "ko" ? "ko-KR" : "en-GB", { day: "numeric", month: "long" });
  body.innerHTML = `
    <div class="thanks">
      <svg aria-hidden="true"><use href="#ic-peak"/></svg>
      <h3>${esc(t("ty.title"))}</h3>
      <p>${esc(t("ty.text"))}</p>
      <div class="totals receipt">
        <div><span>${esc(t("ty.order"))}</span><span>${o.no}</span></div>
        <div><span>${esc(t("ty.paid"))}</span><span>${esc(PAYMENTS[o.payment].name())}</span></div>
        <div><span>${esc(t("ty.arrive"))}</span><span>${f(o.from)} – ${f(o.to)}</span></div>
        <div class="grand"><span>${esc(t("ty.total"))}</span><span>${won(o.total)}</span></div>
      </div>
      <p class="drawer-note">${esc(t("co.demo"))}</p>
    </div>`;
  foot.innerHTML = `<button class="btn-gold block" data-close><span>${esc(t("ty.continue"))}</span></button>`;
}

function drawSaved(body, foot) {
  foot.innerHTML = "";
  const items = PRODUCTS.filter((p) => state.saved.has(p.id));
  if (!items.length) { body.innerHTML = emptyHTML("saved.emptyH", "saved.emptyT"); return; }
  body.innerHTML = items.map((p) => `
    <div class="bag-line">
      <div class="thumb">${frameHTML(p.id, L(p.name))}</div>
      <div>
        <h4>${esc(L(p.name))}</h4>
        <p class="bag-meta">${esc(t("cat." + p.cat))} · ${won(p.price)}</p>
        <div class="bag-row">
          <button class="link-gold" data-view="${p.id}"><span>${esc(t("bag.move"))}</span><svg><use href="#ic-arrow"/></svg></button>
        </div>
        <button class="bag-remove" data-unsave="${p.id}">${esc(t("bag.remove"))}</button>
      </div>
    </div>`).join("");
  hydrate(body);
  $$("[data-view]", body).forEach((b) => b.addEventListener("click", () => openView(b.dataset.view)));
  $$("[data-unsave]", body).forEach((b) => b.addEventListener("click", () => toggleSaved(b.dataset.unsave)));
}

function initDrawer() {
  $("#drawerTabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    state.drawerTab = b.dataset.tab;
    if (state.drawerTab === "bag" && state.drawerStep === "thanks" && state.bag.length) state.drawerStep = "bag";
    renderDrawer();
  });
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open-drawer]");
    if (!o) return;
    state.drawerTab = o.dataset.openDrawer;
    if (state.drawerStep !== "checkout") state.drawerStep = "bag";
    openDrawer();
  });
}

/* ---------- 10. Search, menu, booking, newsletter ---------- */
function runSearch() {
  const q = $("#searchInput").value.trim().toLowerCase();
  const list = q
    ? PRODUCTS.filter((p) => [p.name.en, p.name.ko, p.desc.en, p.desc.ko, p.fabric.en, p.fabric.ko, p.region.en, p.region.ko, STRINGS.en["cat." + p.cat], STRINGS.ko["cat." + p.cat]]
        .join(" ").toLowerCase().includes(q))
    : PRODUCTS.slice(0, 4);
  $("#searchResults").innerHTML = list.length
    ? list.map((p, i) => `<li style="animation-delay:${i * 0.05}s"><button data-result="${p.id}">
        <span class="thumb">${frameHTML(p.id, L(p.name))}</span>
        <span><b>${esc(L(p.name))}</b><small>${esc(t("cat." + p.cat))} · ${esc(L(p.region))}</small></span>
        <span class="price">${won(p.price)}</span></button></li>`).join("")
    : `<li class="none">${esc(t("ui.noResults"))}</li>`;
  hydrate($("#searchResults"));
}

function initSearch() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-open-search]")) return;
    openOverlay("#search");
    runSearch();
    setTimeout(() => $("#searchInput").focus(), 300);
  });
  $("#searchInput").addEventListener("input", runSearch);
  $("#searchResults").addEventListener("click", (e) => { const r = e.target.closest("[data-result]"); if (r) openView(r.dataset.result); });
}

function initMenu() {
  $("#menuOpen").addEventListener("click", () => openOverlay("#menu"));
  $$("[data-menu-link]").forEach((a) => a.addEventListener("click", () => closeAll()));
}

function renderBooking(done = false) {
  const ko = state.lang === "ko";
  $("#bookBody").innerHTML = done
    ? `<div class="thanks"><svg aria-hidden="true"><use href="#ic-peak"/></svg><h3 id="bookTitle">${esc(t("bk.thanks"))}</h3><p>${esc(t("bk.thanksT"))}</p></div>`
    : `<p class="sec-label"><span>IV</span><span>${esc(t("bk.label"))}</span></p>
       <h3 id="bookTitle">${esc(t("bk.title"))}</h3>
       <p class="lede">${esc(t("bk.lede"))}</p>
       <form id="bookForm" novalidate>
         <label class="co-field"><span>${esc(t("bk.name"))}</span><input id="bkName" autocomplete="name" placeholder="${ko ? "김하린" : "Kim Ha-rin"}"></label>
         <label class="co-field"><span>${esc(t("bk.kakao"))}</span><input id="bkKakao" placeholder="harin.k / 010-0000-0000"></label>
         <label class="co-field"><span>${esc(t("bk.occasion"))}</span>
           <select id="bkOcc">${["bk.o1", "bk.o2", "bk.o3", "bk.o4", "bk.o5"].map((k) => `<option>${esc(t(k))}</option>`).join("")}</select></label>
         <label class="co-field"><span>${esc(t("bk.date"))}</span><input id="bkDate" type="date"></label>
         <label class="co-field"><span>${esc(t("bk.note"))}</span><textarea id="bkNote" rows="2"></textarea></label>
         <button class="btn-gold solid block" type="submit" style="margin-top:14px"><svg class="btn-kakao" aria-hidden="true"><use href="#ic-kakao"/></svg><span>${esc(t("bk.send"))}</span></button>
       </form>`;
  const form = $("#bookForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const req = [$("#bkName"), $("#bkKakao")];
    req.forEach((f) => f.classList.toggle("bad", !f.value.trim()));
    if (req.some((f) => !f.value.trim())) { toast(t("bk.fill")); return; }
    renderBooking(true);
  });
}

function initBooking() {
  $("#bookOpen").addEventListener("click", () => { renderBooking(); openOverlay("#book", { shade: true }); });
  $("#book").addEventListener("click", (e) => { if (e.target.id === "book") closeAll(); });
}

function initNewsletter() {
  $("#nlForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#nlEmail").value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const m = $("#nlMsg");
    m.textContent = t(ok ? "nl.ok" : "nl.err");
    m.classList.toggle("err", !ok);
    if (ok) $("#nlEmail").value = "";
  });
}

/* ---------- 11. Language, header, parallax, reveal, boot ---------- */
let toastTimer;
function toast(html) {
  const el = $("#toast");
  el.innerHTML = html;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 2800);
}

function setLang(lang) {
  state.lang = lang === "ko" ? "ko" : "en";
  store.set("lang", state.lang);
  document.documentElement.lang = state.lang;
  $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $$("[data-lang]").forEach((b) => b.classList.toggle("on", b.dataset.lang === state.lang));
  $("#heroCaption").textContent = L(HERO_SLIDES[hero.i].caption);
  renderPieces();
  if (state.view) renderView();
  if (isOpen("#drawer")) renderDrawer();
  if (isOpen("#search")) runSearch();
  if (isOpen("#book")) renderBooking(!$("#bookForm"));
}

// Gentle parallax on the hero, the collection images and the quote photo
function initParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const heroStage = $("#heroStage");
  const splits = $$(".split-img .frame");
  const quote = $(".quote-bg");
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (y < vh * 1.2) heroStage.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
    splits.forEach((f) => {
      const r = f.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;      // -1 … 1 through the viewport
      f.style.transform = `translate3d(0, ${p * -50}px, 0)`;
    });
    const qr = quote.parentElement.getBoundingClientRect();
    if (qr.bottom > 0 && qr.top < vh) quote.style.transform = `translate3d(0, ${((qr.top + qr.height / 2 - vh / 2) / vh) * -70}px, 0)`;
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  items.forEach((el) => io.observe(el));
}

function initChrome() {
  const hd = $("#header");
  const onScroll = () => hd.classList.toggle("solid", window.scrollY > 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.addEventListener("click", (e) => {
    const lang = e.target.closest("[data-lang]");
    if (lang) { if (lang.dataset.lang !== state.lang) setLang(lang.dataset.lang); return; }
    if (e.target.closest("[data-close-go]")) { closeAll(); return; }
    if (e.target.closest("[data-close]")) { closeAll(); return; }
    const demo = e.target.closest("[data-demo]");
    if (demo) { e.preventDefault(); toast(t("ui.demo")); }
  });
  $("#shade").addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && OVERLAYS.some(isOpen)) closeAll(); });
}

document.addEventListener("DOMContentLoaded", () => {
  hydrate();
  buildHero();
  initChrome();
  initPieces();
  initView();
  initDrawer();
  initSearch();
  initMenu();
  initBooking();
  initNewsletter();
  setLang(state.lang);
  updateCounts();
  initParallax();
  initReveal();
});
