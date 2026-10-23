/* =========================================================
   KOMAL — Nepali Style, Everyday Joy.
   Vanilla JS storefront demo (works from file://, no build)
   ---------------------------------------------------------
   1. IMAGES       ← put real photo paths here later
   2. Data         ← categories, products, slides, reviews
   3. STRINGS      ← Korean (default) + English copy
   4. State & helpers
   5. Rendering: placeholders, cards, sections
   6. Hero carousel (auto-slide, dots, swipe)
   7. Filter, sort, search
   8. Wishlist & cart
   9. Product sheet / modal
   10. Drawer: cart → checkout → confirmed, wishlist, my page
   11. Language, header, bottom nav, boot
   ========================================================= */

/* ---------- 1. IMAGES ----------
   Every photo on the site, in one list. The demo uses Unsplash photos.
   To use the client's own photos, drop them in an /images folder next to
   index.html and replace the value, e.g.
     "red-kurtha": "images/red-kurtha.jpg",
   An empty string or a broken path shows a plain grey panel with the name. */
const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMAGES = {
  // Hero slides (wide)
  "hero-festival":  U("1761125064998-44e9dbfcc05a", 2000),
  "hero-pashmina":  U("1545153252-0e2e698f0330", 2000),
  "hero-kurtha":    U("1777888766761-6af980dc6ef6", 2000),

  // Promo banner between Best Sellers and New Arrivals
  "promo-banner":   U("1769898556924-b23f5cbdabe5", 2000),

  // Category circles
  "cat-kurtha":      U("1759840278862-ef629e9b0f64", 300),
  "cat-sari":        U("1610189013429-a703f4b245cf", 300),
  "cat-gunyu":       U("1766763846079-b9da6d83e195", 300),
  "cat-dhaka":       U("1762175048416-8b9f181556fe", 300),
  "cat-pashmina":    U("1771978522828-13c354a22e34", 300),
  "cat-accessories": U("1723144290967-b9a692207d04", 300),

  // Shop-by-occasion tiles
  "occ-festival":   U("1761124739933-009df5603fbf", 700),
  "occ-wedding":    U("1756483571456-6fa86cb1ae53", 700),
  "occ-daily":      U("1776436817748-f8e10a7e75b0", 700),
  "occ-gift":       U("1718878404004-6502a550c23b", 700),

  // Products (keys match product ids)
  "red-kurtha":       U("1759840278381-bf7d5e332050"),
  "floral-kurtha":    U("1768651925875-d1523ed07cb6"),
  "crimson-sari":     U("1646979200020-941e1deb2670"),
  "pistachio-sari":   U("1609748341932-f0206c09412b"),
  "gunyu-festival":   U("1766763846459-67b2fe6b661c"),
  "gunyu-kids":       U("1763733595120-3580a4bd389e"),
  "dhaka-fabric":     U("1571498521264-5fcaa7f8edf4"),
  "dhaka-stole":      U("1693382288218-2ce85aa26974"),
  "pashmina-check":   U("1760551938129-01da7f950fe1"),
  "pashmina-stripe":  U("1771978537603-1a8283bdab89"),
  "chura-bangles":    U("1724720790533-160d6280fd81"),
  "kundan-necklace":  U("1756483560049-e7b2208f99a0"),
};

/* Where each photo should be anchored when cropped (CSS object-position).
   Only needed when the default centre crop cuts off a face. */
const FOCUS = {
  "hero-festival": "40% 35%",
  "hero-kurtha": "50% 48%",
  "promo-banner": "50% 52%",
  "cat-kurtha": "50% 25%",
  "cat-sari": "50% 18%",
  "cat-gunyu": "50% 20%",
  "cat-dhaka": "45% 30%",
  "cat-pashmina": "50% 25%",
  "occ-festival": "60% 30%",
  "occ-wedding": "50% 20%",
  "occ-daily": "50% 35%",
  "gunyu-festival": "50% 20%",
  "gunyu-kids": "50% 20%",
  "crimson-sari": "50% 15%",
  "kundan-necklace": "50% 30%",
};

/* ---------- 2. Data ---------- */
const CATEGORIES = ["kurtha", "sari", "gunyu", "dhaka", "pashmina", "accessories"];

/* Product fields
   price / was   — was = original price; set it to show a "% OFF" badge
   sold          — drives Best Seller ranking
   added         — higher = newer (used by "Newest" sort)
   occasions     — festival | wedding | daily | gift */
const PRODUCTS = [
  {
    id: "red-kurtha", cat: "kurtha",
    name: { ko: "레드 자수 쿠르타 세트", en: "Red Embroidered Kurtha Set" },
    desc: { ko: "앞판에 자수를 놓은 레드 쿠르타와 팬츠, 플로럴 두파타 3피스 세트.", en: "A red kurtha with an embroidered yoke, matching trousers and a floral dupatta." },
    price: 79000, was: 99000, isNew: true, handmade: true, rating: 4.8, reviews: 312, sold: 1250, added: 10,
    occasions: ["festival", "gift"],
    colors: [{ ko: "레드", en: "Red", hex: "#C62F33" }, { ko: "네이비", en: "Navy", hex: "#2E3A59" }],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "floral-kurtha", cat: "kurtha",
    name: { ko: "플로럴 프린트 쿠르타 셋업", en: "Floral Print Kurtha Co-ord" },
    desc: { ko: "블록 프린트 코튼 쿠르타와 와이드 팬츠 셋업. 출근룩으로도 잘 어울려요.", en: "A block-printed cotton kurtha with wide trousers — easy enough for the office." },
    price: 89000, isNew: true, handmade: true, rating: 4.7, reviews: 188, sold: 640, added: 12,
    occasions: ["daily"],
    colors: [{ ko: "블랙 플로럴", en: "Black Floral", hex: "#2F2A28" }, { ko: "크림", en: "Cream", hex: "#EEE6D6" }],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "crimson-sari", cat: "sari",
    name: { ko: "크림슨 조젯 사리", en: "Crimson Georgette Sari" },
    desc: { ko: "골드 레이스 보더를 두른 가벼운 조젯 사리. 결혼식과 축제를 위한 한 벌. 블라우스 원단 포함.", en: "Light georgette with a gold lace border — made for weddings and festivals. Blouse fabric included." },
    price: 189000, was: 229000, handmade: true, rating: 4.9, reviews: 96, sold: 410, added: 4,
    occasions: ["wedding", "festival"],
    colors: [{ ko: "크림슨", en: "Crimson", hex: "#C8102E" }, { ko: "마룬", en: "Maroon", hex: "#6E1F2B" }],
    sizes: ["Free"],
  },
  {
    id: "pistachio-sari", cat: "sari",
    name: { ko: "피스타치오 코튼 사리", en: "Pistachio Cotton Sari" },
    desc: { ko: "옐로 보더의 산뜻한 피스타치오 코튼 사리. 처음 사리를 입는 분께 추천해요.", en: "Fresh pistachio cotton with a yellow border — a lovely first sari." },
    price: 129000, isNew: true, rating: 4.6, reviews: 74, sold: 300, added: 11,
    occasions: ["daily", "wedding"],
    colors: [{ ko: "피스타치오", en: "Pistachio", hex: "#DDE6B8" }, { ko: "레몬", en: "Lemon", hex: "#F2D766" }],
    sizes: ["Free"],
  },
  {
    id: "gunyu-festival", cat: "gunyu",
    name: { ko: "핑크 페스티벌 촐로 세트", en: "Pink Festival Cholo Set" },
    desc: { ko: "자수 촐로 블라우스와 스커트, 시어 두파타 세트. 포테 목걸이와 함께 입는 네팔 축제룩이에요.", en: "An embroidered cholo blouse, skirt and sheer dupatta — Nepal's festival look, worn with a pote necklace." },
    price: 149000, was: 169000, isNew: true, handmade: true, rating: 4.9, reviews: 142, sold: 1100, added: 9,
    occasions: ["festival", "wedding"],
    colors: [{ ko: "핑크", en: "Pink", hex: "#F0B8C8" }, { ko: "레드", en: "Red", hex: "#B23A3F" }],
    sizes: ["S", "M", "L"],
  },
  {
    id: "gunyu-kids", cat: "gunyu",
    name: { ko: "키즈 구룽 구뉴 촐로", en: "Kids Gurung Gunyu Cholo" },
    desc: { ko: "체크 촐로와 그린 파투카, 골드 헤어 장식까지. 랩 방식이라 사이즈 조절이 쉬워요.", en: "A checked cholo, green patuka and gold hair piece, with an adjustable wrap." },
    price: 79000, handmade: true, rating: 4.8, reviews: 65, sold: 260, added: 6,
    occasions: ["festival", "gift"],
    colors: [{ ko: "레드 체크", en: "Red Check", hex: "#C8323C" }, { ko: "블루 체크", en: "Blue Check", hex: "#2F4C8F" }],
    sizes: ["5–6", "7–8", "9–10"],
  },
  {
    id: "dhaka-fabric", cat: "dhaka",
    name: { ko: "핸드룸 다카 원단 · 2m", en: "Handloom Dhaka Fabric · 2m" },
    desc: { ko: "팔파 지역 장인이 나무 베틀로 짠 다카 원단. 블라우스, 재킷, 소품 제작용으로 인기예요.", en: "Dhaka cloth hand-loomed in Palpa on wooden looms — popular for blouses, jackets and accessories." },
    price: 39000, handmade: true, rating: 4.9, reviews: 401, sold: 610, added: 3,
    occasions: ["festival", "gift"],
    colors: [{ ko: "멀티", en: "Multi", hex: "linear-gradient(135deg,#d6336c,#f59f00,#12b886,#228be6)" }, { ko: "레드", en: "Red", hex: "#B23A3F" }],
    sizes: ["Free"],
  },
  {
    id: "dhaka-stole", cat: "dhaka",
    name: { ko: "다카 패턴 스톨", en: "Dhaka Pattern Stole" },
    desc: { ko: "다카 패턴을 넣은 가벼운 스톨. 티셔츠나 원피스에 둘러 포인트를 주세요.", en: "A light stole in dhaka patterns — drape it over a tee or a dress." },
    price: 49000, isNew: true, handmade: true, rating: 4.7, reviews: 58, sold: 230, added: 13,
    occasions: ["daily", "gift"],
    colors: [{ ko: "머스터드", en: "Mustard", hex: "#D9A441" }, { ko: "세이지", en: "Sage", hex: "#9DB59A" }],
    sizes: ["Free"],
  },
  {
    id: "pashmina-check", cat: "pashmina",
    name: { ko: "체크 파시미나 숄", en: "Check Pashmina Shawl" },
    desc: { ko: "히말라야 산양 울로 짠 빅 사이즈 체크 숄. 가볍지만 한겨울에도 따뜻해요. 90 × 200cm.", en: "An oversized check shawl in Himalayan goat wool — feather-light, warm in deep winter. 90 × 200 cm." },
    price: 159000, was: 199000, handmade: true, rating: 4.9, reviews: 264, sold: 980, added: 7,
    occasions: ["gift", "daily"],
    colors: [{ ko: "베이지 체크", en: "Beige Check", hex: "#BFA98C" }, { ko: "그레이 체크", en: "Grey Check", hex: "#8C8C8C" }],
    sizes: ["Free"],
  },
  {
    id: "pashmina-stripe", cat: "pashmina",
    name: { ko: "스트라이프 파시미나 머플러", en: "Striped Pashmina Muffler" },
    desc: { ko: "핑크 스트라이프가 사랑스러운 파시미나 머플러. 코트 위에 툭 둘러주세요.", en: "A sweet pink-striped pashmina muffler — just loop it over your coat." },
    price: 89000, was: 109000, isNew: true, rating: 4.8, reviews: 133, sold: 520, added: 14,
    occasions: ["daily", "gift"],
    colors: [{ ko: "핑크", en: "Pink", hex: "#E58AA7" }, { ko: "아이보리", en: "Ivory", hex: "#F1EADC" }],
    sizes: ["Free"],
  },
  {
    id: "chura-bangles", cat: "accessories",
    name: { ko: "글라스 추라 뱅글 세트", en: "Glass Chura Bangle Set" },
    desc: { ko: "네팔 여성들이 축제 때 즐겨 끼는 유리 뱅글 24개 세트. 쿠르타, 사리와 찰떡이에요.", en: "A set of 24 glass bangles, worn by Nepali women at festivals — perfect with kurtha or sari." },
    price: 29000, was: 35000, isNew: true, handmade: true, rating: 4.7, reviews: 210, sold: 690, added: 15,
    occasions: ["festival", "gift"],
    colors: [{ ko: "골드 그린", en: "Gold Green", hex: "#3E7D52" }, { ko: "레드", en: "Red", hex: "#C8102E" }],
    sizes: ["S", "M", "L"],
  },
  {
    id: "kundan-necklace", cat: "accessories",
    name: { ko: "쿤단 초커 목걸이 세트", en: "Kundan Choker Necklace Set" },
    desc: { ko: "쿤단 스톤과 진주 드롭의 초커와 귀걸이 세트. 웨딩룩을 완성해 줘요.", en: "A kundan-stone choker with pearl drops and matching earrings — the finishing touch for a wedding look." },
    price: 59000, handmade: true, rating: 4.8, reviews: 87, sold: 340, added: 5,
    occasions: ["wedding", "gift"],
    colors: [{ ko: "골드", en: "Gold", hex: "#D8B25A" }],
    sizes: ["Free"],
  },
];

const SLIDES = [
  {
    img: "hero-festival", action: { occasion: "festival" }, align: "right",
    tag: { ko: "Dashain & Tihar 2026", en: "Dashain & Tihar 2026" },
    title: { ko: "새로운<br>페스티벌 컬렉션", en: "New Festival<br>Collection" },
    sub: { ko: "카트만두 거리에서 만난 축제의 컬러, 그대로 서울로", en: "The colours of a Kathmandu festival, straight to Seoul." },
    cta: { ko: "컬렉션 보기", en: "Shop the collection" },
  },
  {
    img: "hero-pashmina", action: { cat: "pashmina" },
    tag: { ko: "Handmade Week", en: "Handmade Week" },
    title: { ko: "핸드메이드<br>파시미나 위크", en: "Handmade<br>Pashmina Week" },
    sub: { ko: "히말라야 산양 울로 짠 숄과 머플러, 최대 20% 할인", en: "Shawls and mufflers in Himalayan wool — up to 20% off." },
    cta: { ko: "파시미나 보기", en: "Shop pashmina" },
  },
  {
    img: "hero-kurtha", action: { cat: "kurtha" },
    tag: { ko: "Best Pick", en: "Best Pick" },
    title: { ko: "쿠르타 세트<br>₩79,000부터", en: "Kurtha Sets<br>from ₩79,000" },
    sub: { ko: "매일 입기 좋은 코튼 쿠르타, 수루왈 팬츠까지 한 번에", en: "Easy cotton kurtha with suruwal trousers — ready for every day." },
    cta: { ko: "쿠르타 보기", en: "Shop kurtha" },
  },
];

const REVIEWS = [
  { product: "red-kurtha", user: "김*연", rating: 5, date: "2026.10.18", opt: { ko: "레드 / M · 162cm", en: "Red / M · 162 cm" },
    text: { ko: "색감이 사진보다 더 예뻐요! 자수도 꼼꼼하고 원단이 시원해요.", en: "The colour is even prettier than the photos! Neat embroidery and a cool fabric." } },
  { product: "pashmina-check", user: "이*수", rating: 5, date: "2026.10.15", opt: { ko: "베이지 체크 / Free", en: "Beige Check / Free" },
    text: { ko: "정말 가볍고 따뜻해요. 엄마 선물로 샀는데 너무 좋아하셨어요.", en: "So light and warm. Bought it for my mom and she loved it." } },
  { product: "gunyu-festival", user: "박*린", rating: 5, date: "2026.10.12", opt: { ko: "핑크 / S · 158cm", en: "Pink / S · 158 cm" },
    text: { ko: "네팔 친구 결혼식에 입고 갔는데 다들 칭찬했어요. 핏도 딱 맞아요.", en: "Wore it to my Nepali friend's wedding and everyone complimented it. Perfect fit." } },
  { product: "dhaka-fabric", user: "최*호", rating: 4, date: "2026.10.09", opt: { ko: "멀티 / 2m", en: "Multi / 2 m" },
    text: { ko: "패턴이 정말 독특해요. 배송은 10일 정도 걸렸지만 기다릴 만했어요.", en: "The pattern is so unique. Delivery took about 10 days but it was worth the wait." } },
  { product: "crimson-sari", user: "정*아", rating: 5, date: "2026.10.05", opt: { ko: "크림슨 / Free", en: "Crimson / Free" },
    text: { ko: "사리 입는 법 안내 카드가 같이 와서 혼자서도 쉽게 입었어요!", en: "A how-to-drape card came with it, so I could wear it on my own!" } },
  { product: "chura-bangles", user: "한*별", rating: 5, date: "2026.10.02", opt: { ko: "골드 그린 / M", en: "Gold Green / M" },
    text: { ko: "가격 대비 퀄리티 최고. 쿠르타랑 같이 끼니까 분위기가 확 살아요.", en: "Great quality for the price. Totally lifts a kurtha outfit." } },
];

const FREE_SHIPPING_FROM = 100000;
const SHIPPING_FEE = 4000;

/* ---------- 3. STRINGS ---------- */
const STRINGS = {
  ko: {
    announce: "₩100,000 이상 구매 시 한국 전역 무료배송",
    tagline: "Nepali Style, Everyday Joy.",
    "search.ph": "쿠르타, 파시미나, 사리 검색",
    "best.title": "베스트셀러", "best.sub": "지금 가장 많이 찾는 네팔 아이템",
    "common.more": "더보기",
    "new.title": "신상품", "new.sub": "네팔에서 막 도착한 새로운 스타일",
    "sort.label": "정렬", "sort.recommended": "추천순", "sort.newest": "신상품순", "sort.popular": "인기순",
    "sort.priceLow": "낮은 가격순", "sort.priceHigh": "높은 가격순",
    "occ.title": "상황별 쇼핑", "occ.sub": "특별한 날도, 평범한 날도 네팔 스타일로",
    "occ.festival": "다사인 & 티하르", "occ.festivalSub": "축제 시즌 컬렉션",
    "occ.wedding": "웨딩", "occ.weddingSub": "하객룩부터 본식까지",
    "occ.daily": "데일리", "occ.dailySub": "매일 편하게 입는 네팔룩",
    "occ.gift": "선물", "occ.giftSub": "마음을 전하는 핸드메이드",
    "rev.title": "고객 리뷰", "rev.sub": "· 2,180개의 리뷰",
    "promo.tag": "MADE IN NEPAL", "promo.title": "카트만두에서 온 핸드메이드",
    "promo.sub": "네팔 장인이 직접 만든 이번 시즌 신상", "promo.cta": "신상품 보러가기",
    "footer.photos": "사진: Unsplash (데모용)",
    "why.title": "왜 KOMAL인가요?",
    "why.1": "네팔 핸드메이드", "why.1t": "현지 장인이 직접 만든 정품",
    "why.2": "7–12일 배송", "why.2t": "₩100,000 이상 무료배송",
    "why.3": "간편 결제", "why.3t": "카카오페이 · 네이버페이 · 토스",
    "why.4": "14일 무료 반품", "why.4t": "사이즈가 안 맞아도 걱정 없이",
    "footer.kakao": "카카오톡 채널 추가", "footer.cs": "고객센터", "footer.hours": "평일 10:00–18:00 (점심 12:00–13:00)",
    "footer.shop": "쇼핑", "footer.policy": "정책", "footer.terms": "이용약관", "footer.privacy": "개인정보처리방침",
    "footer.shipping": "배송 안내", "footer.returns": "교환·반품 안내",
    "footer.legal": "상호: KOMAL (데모) · 대표: —— · 사업자등록번호: 000-00-00000 · 통신판매업신고: 0000-서울-0000 · 이 페이지의 회사 정보는 디자인 데모용 예시입니다.",
    "nav.home": "홈", "nav.category": "카테고리", "nav.search": "검색", "nav.wish": "찜", "nav.my": "마이",
    "cat.all": "전체", "cat.kurtha": "쿠르타", "cat.sari": "사리", "cat.gunyu": "구뉴 촐로",
    "cat.dhaka": "다카", "cat.pashmina": "파시미나", "cat.accessories": "액세서리",

    // script-only strings
    off: "% OFF", tagNew: "NEW", tagHand: "Handmade in Nepal",
    addToCart: "장바구니 담기", added: "장바구니에 담았어요", wishOn: "찜 목록에 추가했어요", wishOff: "찜 목록에서 삭제했어요",
    color: "색상", size: "사이즈", free: "프리 사이즈", pickSize: "사이즈를 선택해 주세요",
    shipLine1: "네팔에서 7–12일 내 배송", shipLine2: "₩100,000 이상 무료배송", shipLine3: "14일 이내 무료 반품",
    reviewsWord: "리뷰",
    cart: "장바구니", checkout: "주문/결제", confirmed: "주문 완료", wishlist: "찜 목록", my: "마이페이지",
    emptyCart: "장바구니가 비어 있어요", emptyCartSub: "마음에 드는 네팔 아이템을 담아보세요.",
    emptyWish: "찜한 상품이 없어요", emptyWishSub: "하트를 눌러 마음에 드는 상품을 저장하세요.",
    goShop: "쇼핑하러 가기",
    toFree: "<b>{amount}</b> 더 담으면 무료배송!", gotFree: "🎉 무료배송 혜택이 적용되었어요",
    subtotal: "상품 금액", discount: "할인 금액", shipping: "배송비", total: "총 결제 금액", freeWord: "무료",
    order: "{amount} 주문하기", pay: "{amount} 결제하기", processing: "결제 중…",
    delivery: "배송지", name: "받는 분", phone: "휴대폰 번호", address: "주소", address2: "상세 주소",
    payMethod: "결제 수단", card: "신용카드", agree: "주문 내용을 확인했으며 결제에 동의합니다.",
    demoPay: "데모 화면입니다 — 실제 결제는 이루어지지 않아요.",
    fillAll: "배송 정보를 모두 입력해 주세요", agreeFirst: "결제 동의에 체크해 주세요",
    doneTitle: "주문이 완료되었어요!", doneText: "네팔에서 정성껏 포장해 보내드릴게요.",
    orderNo: "주문번호", paidBy: "결제 수단", eta: "도착 예정", paid: "결제 금액",
    keepShopping: "쇼핑 계속하기", orderList: "주문 내역 보기",
    resultFor: "‘{q}’ 검색 결과 <b>{n}개</b>", catResult: "<b>{label}</b> · {n}개", clear: "초기화",
    noResults: "찾으시는 상품이 없어요. 다른 검색어를 입력해 보세요.",
    myHello: "KOMAL 회원이 되어보세요", myHelloSub: "가입하면 적립금 3,000원을 드려요.",
    orders: "주문", coupons: "쿠폰", points: "적립금",
    kakaoLogin: "카카오로 3초 만에 시작하기", naverLogin: "네이버로 시작하기",
    menuOrders: "주문·배송 조회", menuWish: "찜한 상품", menuReviews: "내 리뷰", menuCs: "고객센터",
    demoLink: "디자인 데모입니다 — 실제 사이트에서 연결돼요.",
    langOn: "한국어로 변경했어요",
    items: "{n}개 상품",
    occLabel: { festival: "다사인 & 티하르", wedding: "웨딩", daily: "데일리", gift: "선물" },
  },
  en: {
    announce: "Free shipping across Korea over ₩100,000",
    tagline: "Nepali Style, Everyday Joy.",
    "search.ph": "Search kurtha, pashmina, sari",
    "best.title": "Best Sellers", "best.sub": "The Nepali pieces everyone's buying right now",
    "common.more": "See all",
    "new.title": "New Arrivals", "new.sub": "Fresh styles just landed from Nepal",
    "sort.label": "Sort", "sort.recommended": "Recommended", "sort.newest": "Newest", "sort.popular": "Most popular",
    "sort.priceLow": "Price: low to high", "sort.priceHigh": "Price: high to low",
    "occ.title": "Shop by Occasion", "occ.sub": "Big days and every day, the Nepali way",
    "occ.festival": "Dashain & Tihar", "occ.festivalSub": "Festival season edit",
    "occ.wedding": "Wedding", "occ.weddingSub": "From guest looks to the big day",
    "occ.daily": "Daily Wear", "occ.dailySub": "Easy Nepali style for every day",
    "occ.gift": "Gift", "occ.giftSub": "Handmade presents with heart",
    "rev.title": "Customer Reviews", "rev.sub": "· 2,180 reviews",
    "promo.tag": "MADE IN NEPAL", "promo.title": "Handmade, from Kathmandu",
    "promo.sub": "This season's new pieces, made by Nepali artisans", "promo.cta": "Shop new arrivals",
    "footer.photos": "Photos: Unsplash (demo only)",
    "why.title": "Why KOMAL?",
    "why.1": "Handmade in Nepal", "why.1t": "Made by local artisans",
    "why.2": "7–12 day delivery", "why.2t": "Free over ₩100,000",
    "why.3": "Easy payment", "why.3t": "KakaoPay · Naver Pay · Toss",
    "why.4": "Free 14-day returns", "why.4t": "No stress if the size is off",
    "footer.kakao": "Add KakaoTalk channel", "footer.cs": "Customer care", "footer.hours": "Weekdays 10:00–18:00 KST (lunch 12–13)",
    "footer.shop": "Shop", "footer.policy": "Policies", "footer.terms": "Terms of use", "footer.privacy": "Privacy policy",
    "footer.shipping": "Shipping info", "footer.returns": "Exchanges & returns",
    "footer.legal": "Company: KOMAL (demo) · CEO: —— · Business Reg. No. 000-00-00000 · Mail-order Reg. No. 0000-Seoul-0000 · All company details on this page are placeholders for a design demo.",
    "nav.home": "Home", "nav.category": "Category", "nav.search": "Search", "nav.wish": "Wishlist", "nav.my": "My Page",
    "cat.all": "All", "cat.kurtha": "Kurtha", "cat.sari": "Sari", "cat.gunyu": "Gunyu Cholo",
    "cat.dhaka": "Dhaka", "cat.pashmina": "Pashmina", "cat.accessories": "Accessories",

    off: "% OFF", tagNew: "NEW", tagHand: "Handmade in Nepal",
    addToCart: "Add to cart", added: "Added to cart", wishOn: "Saved to wishlist", wishOff: "Removed from wishlist",
    color: "Colour", size: "Size", free: "Free size", pickSize: "Please choose a size",
    shipLine1: "Delivered from Nepal in 7–12 days", shipLine2: "Free shipping over ₩100,000", shipLine3: "Free returns within 14 days",
    reviewsWord: "reviews",
    cart: "Cart", checkout: "Checkout", confirmed: "Order Confirmed", wishlist: "Wishlist", my: "My Page",
    emptyCart: "Your cart is empty", emptyCartSub: "Add a Nepali piece you love.",
    emptyWish: "No saved items yet", emptyWishSub: "Tap the heart on anything you like.",
    goShop: "Start shopping",
    toFree: "Add <b>{amount}</b> more for free shipping!", gotFree: "🎉 You've got free shipping",
    subtotal: "Subtotal", discount: "Discount", shipping: "Shipping", total: "Total", freeWord: "Free",
    order: "Order · {amount}", pay: "Pay {amount}", processing: "Processing…",
    delivery: "Delivery address", name: "Recipient", phone: "Phone", address: "Address", address2: "Apt, suite, etc.",
    payMethod: "Payment method", card: "Credit Card", agree: "I've checked my order and agree to pay.",
    demoPay: "Demo only — no real payment is taken.",
    fillAll: "Please fill in your delivery details", agreeFirst: "Please tick the payment agreement",
    doneTitle: "Order Confirmed!", doneText: "We'll pack it with care in Nepal and send it your way.",
    orderNo: "Order no.", paidBy: "Paid with", eta: "Arriving", paid: "Amount paid",
    keepShopping: "Keep shopping", orderList: "View my orders",
    resultFor: "Results for ‘{q}’ · <b>{n}</b>", catResult: "<b>{label}</b> · {n} items", clear: "Clear",
    noResults: "Nothing matched. Try another search.",
    myHello: "Join KOMAL", myHelloSub: "Sign up and get ₩3,000 in points.",
    orders: "Orders", coupons: "Coupons", points: "Points",
    kakaoLogin: "Start in 3 seconds with Kakao", naverLogin: "Continue with Naver",
    menuOrders: "Orders & delivery", menuWish: "Wishlist", menuReviews: "My reviews", menuCs: "Customer care",
    demoLink: "Design demo — this links up on the real site.",
    langOn: "Switched to English",
    items: "{n} items",
    occLabel: { festival: "Dashain & Tihar", wedding: "Wedding", daily: "Daily Wear", gift: "Gift" },
  },
};

/* ---------- 4. State & helpers ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem("komal." + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("komal." + k, JSON.stringify(v)); } catch { /* ignore */ } },
};

const state = {
  lang: store.get("lang", "ko"),
  cat: "all",
  occasion: null,
  query: "",
  sort: "recommended",
  wish: new Set(store.get("wish", [])),
  cart: store.get("cart", []),           // [{ id, size, color, qty }]  color = index into product.colors
  sheet: null,                            // { id, size, color }
  drawer: null,                           // cart | checkout | done | wishlist | account
  payment: "kakao",
  lastOrder: null,
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = (key, vars = {}) => {
  let s = STRINGS[state.lang][key] ?? STRINGS.ko[key] ?? key;
  if (typeof s === "string") for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
};
const L = (obj) => obj[state.lang] ?? obj.ko;
const won = (n) => "₩" + n.toLocaleString("ko-KR");
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const pct = (p) => (p.was ? Math.round(((p.was - p.price) / p.was) * 100) : 0);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const catLabel = (id) => t("cat." + id);

const PAYMENTS = {
  kakao: { logo: "kakao", mark: "pay", label: () => (state.lang === "ko" ? "카카오페이" : "KakaoPay") },
  naver: { logo: "naver", mark: "N", label: () => (state.lang === "ko" ? "네이버페이" : "Naver Pay") },
  toss:  { logo: "toss", mark: "toss", label: () => (state.lang === "ko" ? "토스페이" : "Toss Pay") },
  card:  { logo: "card", mark: "CARD", label: () => t("card") },
};

/* ---------- 5. Rendering ---------- */

// Photo frame used everywhere. No photo (or a broken link) → grey panel with the name.
function media(key, label = "", eager = false) {
  const src = IMAGES[key];
  const pos = FOCUS[key] ? ` style="--pos:${FOCUS[key]}"` : "";
  const img = src
    ? `<img src="${esc(src)}" alt="${esc(label)}"${eager ? "" : ' loading="lazy"'} decoding="async" onload="this.classList.add('loaded')" onerror="this.parentNode.classList.add('empty');this.remove()">`
    : "";
  return `<div class="media${src ? "" : " empty"}" data-label="${esc(label)}"${pos}>${img}</div>`;
}

// Static frames written in index.html as <div class="media" data-img="key">
function hydrateStaticMedia() {
  $$(".media[data-img]").forEach((box) => {
    const key = box.dataset.img;
    const tmp = document.createElement("div");
    tmp.innerHTML = media(key, box.dataset.label || "");
    const built = tmp.firstElementChild;
    box.className = built.className;
    if (built.getAttribute("style")) box.setAttribute("style", built.getAttribute("style"));
    box.innerHTML = built.innerHTML;
    box.removeAttribute("data-img");
  });
}

function stars(n) {
  return `<span class="stars" aria-label="${n} / 5">${[1, 2, 3, 4, 5]
    .map((i) => `<svg class="${i <= n ? "" : "off"}"><use href="#i-star"/></svg>`).join("")}</span>`;
}

function priceHTML(p) {
  return `<div class="price-row">
    ${p.was ? `<span class="discount">${pct(p)}%</span>` : ""}
    <span class="price">${won(p.price)}</span>
    ${p.was ? `<span class="was">${won(p.was)}</span>` : ""}
  </div>`;
}

// Cards show sale + NEW on the photo; the detail view also shows the handmade tag
function tagsHTML(p, withHandmade = true) {
  const tags = [];
  if (p.was) tags.push(`<span class="tag sale">${pct(p)}${t("off")}</span>`);
  if (p.isNew) tags.push(`<span class="tag">${t("tagNew")}</span>`);
  if (p.handmade && withHandmade) tags.push(`<span class="tag hand">${t("tagHand")}</span>`);
  return tags.length ? `<div class="tags">${tags.join("")}</div>` : "";
}

function cardHTML(p, i, rank) {
  const on = state.wish.has(p.id);
  return `
  <article class="card" data-product="${p.id}" tabindex="0" style="animation-delay:${Math.min(i, 10) * 0.04}s">
    <div class="card-media">
      ${rank ? `<span class="rank">${rank}</span>` : ""}
      ${media(p.id, L(p.name))}
      ${tagsHTML(p, false)}
      <button class="add-mini" data-add="${p.id}"><svg><use href="#i-bag"/></svg>${esc(t("addToCart"))}</button>
      <button class="heart ${on ? "on" : ""}" data-wish="${p.id}" aria-pressed="${on}" aria-label="${esc(t("wishlist"))}">
        <svg><use href="#${on ? "i-heart-fill" : "i-heart"}"/></svg>
      </button>
    </div>
    <div class="card-info">
      <p class="card-brand">${esc(catLabel(p.cat))}</p>
      <h3 class="card-name">${esc(L(p.name))}</h3>
      ${priceHTML(p)}
      <div class="rating"><svg><use href="#i-star"/></svg>${p.rating.toFixed(1)} <span>(${p.reviews.toLocaleString()})</span></div>
      ${p.handmade ? `<span class="hand-line">${esc(t("tagHand"))}</span>` : ""}
    </div>
  </article>`;
}

function renderCategories() {
  $("#catRow").innerHTML = CATEGORIES.map((id) => `
    <button class="cat ${state.cat === id ? "is-active" : ""}" data-cat="${id}">
      <span class="cat-circle">${media("cat-" + id, catLabel(id))}</span>
      ${esc(catLabel(id))}
    </button>`).join("");
}

function renderBest() {
  const best = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8);
  $("#bestRow").innerHTML = best.map((p, i) => cardHTML(p, i, i + 1)).join("");
}

function renderChips() {
  const ids = ["all", ...CATEGORIES];
  $("#chips").innerHTML = ids.map((id) => `
    <button class="chip ${state.cat === id && !state.occasion ? "is-active" : ""}" data-chip="${id}" role="tab">${esc(catLabel(id))}</button>`).join("");
}

function filteredProducts() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter((p) => {
    if (state.cat !== "all" && p.cat !== state.cat) return false;
    if (state.occasion && !p.occasions.includes(state.occasion)) return false;
    if (q) {
      const hay = [p.name.ko, p.name.en, p.desc.ko, p.desc.en, STRINGS.ko["cat." + p.cat], STRINGS.en["cat." + p.cat], p.cat].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const sorters = {
    recommended: () => 0,
    newest: (a, b) => b.added - a.added,
    popular: (a, b) => b.sold - a.sold,
    priceLow: (a, b) => a.price - b.price,
    priceHigh: (a, b) => b.price - a.price,
  };
  return [...list].sort(sorters[state.sort]);
}

function renderGrid() {
  const list = filteredProducts();
  $("#productGrid").innerHTML = list.length
    ? list.map((p, i) => cardHTML(p, i)).join("")
    : `<p class="empty">${esc(t("noResults"))}</p>`;

  // Result bar for search / occasion / category
  const bar = $("#resultBar");
  let msg = "";
  if (state.query) msg = t("resultFor", { q: esc(state.query), n: list.length });
  else if (state.occasion) msg = t("catResult", { label: esc(t("occLabel")[state.occasion]), n: list.length });
  else if (state.cat !== "all") msg = t("catResult", { label: esc(catLabel(state.cat)), n: list.length });
  bar.hidden = !msg;
  bar.innerHTML = msg ? `<span>${msg}</span><button id="clearFilters">${esc(t("clear"))}</button>` : "";
  if (msg) $("#clearFilters").addEventListener("click", resetFilters);

  renderChips();
  $$(".cat").forEach((c) => c.classList.toggle("is-active", c.dataset.cat === state.cat));
}

function renderReviews() {
  $("#reviewRow").innerHTML = REVIEWS.map((r) => {
    const p = byId(r.product);
    return `
    <article class="review" data-product="${p.id}">
      <div class="review-top">
        <div class="review-thumb">${media(p.id, L(p.name))}</div>
        <div>${stars(r.rating)}<p class="review-prod">${esc(L(p.name))}<br>${esc(L(r.opt))}</p></div>
      </div>
      <p class="review-text">${esc(L(r.text))}</p>
      <div class="review-meta"><b>${esc(r.user)}</b><span>${r.date}</span></div>
    </article>`;
  }).join("");
}

function renderAll() {
  renderCategories();
  renderBest();
  renderGrid();
  renderReviews();
  renderSlides();
}

/* ---------- 6. Hero carousel ---------- */
const SLIDE_MS = 2000; // auto-slide every 2 seconds
const carousel = { index: 0, timer: null, startX: 0, dx: 0, dragging: false, moved: false };

function renderSlides() {
  $("#heroTrack").innerHTML = SLIDES.map((s, i) => `
    <div class="slide${s.align === "right" ? " right" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${SLIDES.length}">
      ${media(s.img, "", i === 0)}
      <div class="slide-shade"></div>
      <div class="slide-copy container">
        <span class="slide-tag">${esc(L(s.tag))}</span>
        <h2>${L(s.title)}</h2>
        <p>${esc(L(s.sub))}</p>
        <button class="btn btn-light" data-slide-action="${i}">${esc(L(s.cta))}</button>
      </div>
    </div>`).join("");
  $("#heroDots").innerHTML = SLIDES.map((_, i) =>
    `<button role="tab" aria-label="Slide ${i + 1}" data-dot="${i}" class="${i === carousel.index ? "is-active" : ""}"></button>`).join("");
  goTo(carousel.index, false);
}

function goTo(i, user = true) {
  carousel.index = (i + SLIDES.length) % SLIDES.length;
  $("#heroTrack").style.transform = `translateX(${-carousel.index * 100}%)`;
  $$("#heroDots button").forEach((d, n) => d.classList.toggle("is-active", n === carousel.index));
  $$("#heroTrack .slide").forEach((sl, n) => sl.classList.toggle("active", n === carousel.index));
  $("#heroCount").textContent = `${carousel.index + 1} / ${SLIDES.length}`;
  if (user) restartAuto();
}

function restartAuto() {
  clearInterval(carousel.timer);
  carousel.timer = setInterval(() => goTo(carousel.index + 1, false), SLIDE_MS);
}

function initCarousel() {
  const vp = $("#heroViewport");
  const track = $("#heroTrack");
  $("#heroPrev").addEventListener("click", () => goTo(carousel.index - 1));
  $("#heroNext").addEventListener("click", () => goTo(carousel.index + 1));
  $("#heroDots").addEventListener("click", (e) => { const d = e.target.closest("[data-dot]"); if (d) goTo(+d.dataset.dot); });

  // Swipe / drag
  vp.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".hero-arrow, .hero-dots")) return;
    carousel.dragging = true; carousel.moved = false;
    carousel.startX = e.clientX; carousel.dx = 0;
    track.classList.add("dragging");
    clearInterval(carousel.timer);
  });
  window.addEventListener("pointermove", (e) => {
    if (!carousel.dragging) return;
    carousel.dx = e.clientX - carousel.startX;
    if (Math.abs(carousel.dx) > 6) carousel.moved = true;
    track.style.transform = `translateX(calc(${-carousel.index * 100}% + ${carousel.dx}px))`;
  });
  const end = () => {
    if (!carousel.dragging) return;
    carousel.dragging = false;
    track.classList.remove("dragging");
    const threshold = vp.offsetWidth * 0.15;
    if (carousel.dx < -threshold) goTo(carousel.index + 1);
    else if (carousel.dx > threshold) goTo(carousel.index - 1);
    else goTo(carousel.index);
  };
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
  // A drag should not also count as a tap on the slide button
  vp.addEventListener("click", (e) => { if (carousel.moved) { e.stopPropagation(); e.preventDefault(); carousel.moved = false; } }, true);


  $("#heroTrack").addEventListener("click", (e) => {
    const b = e.target.closest("[data-slide-action]");
    if (!b) return;
    const a = SLIDES[+b.dataset.slideAction].action;
    a.cat ? setCategory(a.cat) : setOccasion(a.occasion);
  });
  restartAuto();
}

/* ---------- 7. Filter, sort, search ---------- */
function scrollToGrid() {
  const top = $("#new").getBoundingClientRect().top + window.scrollY - ($("#header").offsetHeight + 8);
  window.scrollTo({ top, behavior: "smooth" });
}

function setCategory(cat, scroll = true) {
  state.cat = cat; state.occasion = null; state.query = "";
  $("#searchInput").value = ""; syncSearchClear();
  renderGrid();
  if (scroll) scrollToGrid();
}

function setOccasion(occ) {
  state.occasion = occ; state.cat = "all"; state.query = "";
  $("#searchInput").value = ""; syncSearchClear();
  renderGrid();
  scrollToGrid();
}

function resetFilters() {
  state.cat = "all"; state.occasion = null; state.query = "";
  $("#searchInput").value = ""; syncSearchClear();
  renderGrid();
}

function syncSearchClear() { $("#searchClear").hidden = !$("#searchInput").value; }

function initFilters() {
  $("#catRow").addEventListener("click", (e) => { const c = e.target.closest("[data-cat]"); if (c) setCategory(c.dataset.cat); });
  $("#chips").addEventListener("click", (e) => { const c = e.target.closest("[data-chip]"); if (c) setCategory(c.dataset.chip, false); });
  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
  $$("[data-occasion]").forEach((b) => b.addEventListener("click", () => setOccasion(b.dataset.occasion)));
  $$("[data-promo-sort]").forEach((b) => b.addEventListener("click", () => {
    state.sort = b.dataset.promoSort; $("#sortSelect").value = state.sort;
    resetFilters(); scrollToGrid();
  }));
  $$("[data-cat-link]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); setCategory(a.dataset.catLink); }));
  $$("[data-sort-link]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    state.sort = a.dataset.sortLink; $("#sortSelect").value = state.sort;
    resetFilters(); scrollToGrid();
  }));

  // Search: filters live as you type, jumps to results on Enter
  const input = $("#searchInput");
  input.addEventListener("input", () => {
    state.query = input.value; state.cat = "all"; state.occasion = null;
    syncSearchClear(); renderGrid();
  });
  $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); input.blur(); scrollToGrid(); });
  $("#searchClear").addEventListener("click", () => { resetFilters(); input.focus(); });
}

/* ---------- 8. Wishlist & cart ---------- */
function toggleWish(id, btn) {
  const on = !state.wish.has(id);
  on ? state.wish.add(id) : state.wish.delete(id);
  store.set("wish", [...state.wish]);
  $$(`[data-wish="${id}"]`).forEach((b) => {
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
    $("use", b).setAttribute("href", on ? "#i-heart-fill" : "#i-heart");
  });
  if (btn) { btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }
  updateCounts("wish");
  toast(t(on ? "wishOn" : "wishOff"), on);
  if (state.drawer === "wishlist") renderDrawer();
}

function addToCart(id, size, color = 0, qty = 1) {
  const p = byId(id);
  const s = size || (p.sizes.includes("M") ? "M" : p.sizes[0]);
  const line = state.cart.find((l) => l.id === id && l.size === s && l.color === color);
  line ? (line.qty += qty) : state.cart.push({ id, size: s, color, qty });
  saveCart();
  updateCounts("cart");
  toast(`${t("added")} · ${L(p.name)}`, true);
}

function saveCart() { store.set("cart", state.cart); }
const cartQty = () => state.cart.reduce((n, l) => n + l.qty, 0);
const cartSubtotal = () => state.cart.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
const cartSaved = () => state.cart.reduce((n, l) => { const p = byId(l.id); return n + (p.was ? (p.was - p.price) * l.qty : 0); }, 0);
const shippingFor = (sub) => (sub === 0 || sub >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE);

function updateCounts(bump) {
  const counts = { cart: cartQty(), wish: state.wish.size };
  $$("[data-count]").forEach((el) => {
    const n = counts[el.dataset.count];
    el.textContent = n > 99 ? "99+" : n;
    el.classList.toggle("on", n > 0);
    if (bump === el.dataset.count && n > 0) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  });
}

// Card + review interactions (delegated across the whole page)
function initCards() {
  document.addEventListener("click", (e) => {
    const wish = e.target.closest("[data-wish]");
    if (wish && !wish.closest(".sheet")) { e.stopPropagation(); toggleWish(wish.dataset.wish, wish); return; }
    const add = e.target.closest("[data-add]");
    if (add) { e.stopPropagation(); addToCart(add.dataset.add); return; }
    const card = e.target.closest(".card[data-product], .review[data-product]");
    if (card) openSheet(card.dataset.product);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches(".card[data-product]")) openSheet(e.target.dataset.product);
  });
}

/* ---------- 9. Product sheet / modal ---------- */
const backdrop = $("#backdrop");
let lastFocus = null;

function lock(on) {
  if (on) {
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("on"));
  } else {
    backdrop.classList.remove("on");
    setTimeout(() => { if (!backdrop.classList.contains("on")) backdrop.hidden = true; }, 320);
  }
  document.body.classList.toggle("locked", on);
}

function closeAll() {
  $("#sheet").classList.remove("open");
  $("#sheet").setAttribute("aria-hidden", "true");
  $("#drawer").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  state.sheet = null;
  state.drawer = null;
  lock(false);
  setNavActive("home");
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

function openSheet(id) {
  const p = byId(id);
  if (!p) return;
  if (state.drawer) { $("#drawer").classList.remove("open"); state.drawer = null; }
  lastFocus = document.activeElement;
  state.sheet = { id, size: p.sizes.length === 1 ? p.sizes[0] : null, color: 0 };
  renderSheet();
  $("#sheet").scrollTop = 0;
  $("#sheet").classList.add("open");
  $("#sheet").setAttribute("aria-hidden", "false");
  lock(true);
}

function renderSheet() {
  const s = state.sheet;
  if (!s) return;
  const p = byId(s.id);
  const on = state.wish.has(p.id);
  const color = p.colors[s.color];

  $("#sheetBody").innerHTML = `
    <div class="pd">
      <div class="pd-media">${media(p.id, L(p.name), true)}</div>
      <div class="pd-info">
        <p class="pd-cat">${esc(catLabel(p.cat))}</p>
        <h2 class="pd-name">${esc(L(p.name))}</h2>
        <p class="pd-alt">${esc(state.lang === "ko" ? p.name.en : p.name.ko)}</p>
        ${priceHTML(p)}
        <div class="rating"><svg><use href="#i-star"/></svg>${p.rating.toFixed(1)} <span>· ${p.reviews.toLocaleString()} ${esc(t("reviewsWord"))}</span></div>
        ${tagsHTML(p)}
        <p class="pd-desc">${esc(L(p.desc))}</p>

        <p class="opt-label">${esc(t("color"))}<span>${esc(L(color))}</span></p>
        <div class="swatches">
          ${p.colors.map((c, i) => `<button class="swatch ${i === s.color ? "is-active" : ""}" style="--sw:${c.hex}" data-color="${i}" aria-label="${esc(L(c))}"></button>`).join("")}
        </div>

        <p class="opt-label">${esc(t("size"))}</p>
        <div class="sizes" id="sizes">
          ${p.sizes.map((z) => `<button class="size ${z === s.size ? "is-active" : ""}" data-size="${z}">${z === "Free" ? esc(t("free")) : z}</button>`).join("")}
        </div>

        <div class="pd-ship">
          <div><svg><use href="#i-truck"/></svg>${esc(t("shipLine1"))}</div>
          <div><svg><use href="#i-check"/></svg>${esc(t("shipLine2"))}</div>
          <div><svg><use href="#i-return"/></svg>${esc(t("shipLine3"))}</div>
        </div>

        <div class="pd-actions">
          <button class="heart ${on ? "on" : ""}" data-wish="${p.id}" aria-pressed="${on}" aria-label="${esc(t("wishlist"))}"><svg><use href="#${on ? "i-heart-fill" : "i-heart"}"/></svg></button>
          <button class="btn btn-primary" id="sheetAdd">${esc(t("addToCart"))} · ${won(p.price)}</button>
        </div>
      </div>
    </div>`;

  const body = $("#sheetBody");
  $$("[data-color]", body).forEach((b) => b.addEventListener("click", () => { s.color = +b.dataset.color; renderSheet(); }));
  $$("[data-size]", body).forEach((b) => b.addEventListener("click", () => {
    s.size = b.dataset.size;
    $$("[data-size]", body).forEach((x) => x.classList.toggle("is-active", x === b));
  }));
  $("[data-wish]", body).addEventListener("click", (e) => toggleWish(p.id, e.currentTarget));
  $("#sheetAdd").addEventListener("click", () => {
    if (!s.size) {
      const sizes = $("#sizes");
      sizes.classList.remove("shake"); void sizes.offsetWidth; sizes.classList.add("shake");
      toast(t("pickSize"));
      return;
    }
    addToCart(p.id, s.size, s.color);
    closeAll();
  });
}

/* ---------- 10. Drawer ---------- */
function openDrawer(view) {
  if (state.sheet) { $("#sheet").classList.remove("open"); state.sheet = null; }
  if (!state.drawer) lastFocus = document.activeElement;
  state.drawer = view;
  renderDrawer();
  $("#drawer").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  lock(true);
}

function renderDrawer() {
  const v = state.drawer;
  if (!v) return;
  const body = $("#drawerBody");
  const foot = $("#drawerFoot");
  const titles = { cart: t("cart") + (cartQty() ? ` (${cartQty()})` : ""), checkout: t("checkout"), done: t("confirmed"), wishlist: t("wishlist"), account: t("my") };
  $("#drawerTitle").textContent = titles[v];
  $("#drawerBack").hidden = v !== "checkout";
  body.scrollTop = 0;
  ({ cart: drawCart, checkout: drawCheckout, done: drawDone, wishlist: drawWish, account: drawAccount })[v](body, foot);
}

function emptyState(icon, title, sub) {
  return `<div class="empty-state">
    <div class="empty-icon"><svg><use href="#${icon}"/></svg></div>
    <strong>${esc(t(title))}</strong><p>${esc(t(sub))}</p>
    <button class="btn btn-dark" data-close>${esc(t("goShop"))}</button>
  </div>`;
}

function lineHTML(l, i) {
  const p = byId(l.id);
  const c = p.colors[l.color] || p.colors[0];
  return `
  <div class="line">
    ${media(p.id, L(p.name))}
    <div>
      <div class="line-top">
        <p class="line-name">${esc(L(p.name))}</p>
        <button class="line-x" data-remove="${i}" aria-label="Remove"><svg><use href="#i-close"/></svg></button>
      </div>
      <p class="line-opt">${esc(L(c))} / ${l.size === "Free" ? esc(t("free")) : l.size}</p>
      <div class="line-bottom">
        <div class="stepper"><button data-step="-1" data-i="${i}" aria-label="−">−</button><span>${l.qty}</span><button data-step="1" data-i="${i}" aria-label="+">+</button></div>
        <span class="line-price">${won(p.price * l.qty)}</span>
      </div>
    </div>
  </div>`;
}

function sumHTML(withDiscount = true) {
  const sub = cartSubtotal();
  const ship = shippingFor(sub);
  const saved = cartSaved();
  return `<div class="sum">
    <div><span>${esc(t("subtotal"))}</span><span>${won(sub + saved)}</span></div>
    ${withDiscount && saved ? `<div><span>${esc(t("discount"))}</span><span style="color:var(--crimson)">−${won(saved)}</span></div>` : ""}
    <div><span>${esc(t("shipping"))}</span><span>${ship ? won(ship) : esc(t("freeWord"))}</span></div>
    <div class="total"><span>${esc(t("total"))}</span><span>${won(sub + ship)}</span></div>
  </div>`;
}

function drawCart(body, foot) {
  if (!state.cart.length) { body.innerHTML = emptyState("i-bag", "emptyCart", "emptyCartSub"); foot.innerHTML = ""; return; }
  const sub = cartSubtotal();
  const left = FREE_SHIPPING_FROM - sub;
  body.innerHTML = `
    <div class="ship-meter">${left > 0 ? t("toFree", { amount: won(left) }) : t("gotFree")}
      <div class="meter"><i style="width:${Math.min(100, (sub / FREE_SHIPPING_FROM) * 100)}%"></i></div>
    </div>
    ${state.cart.map(lineHTML).join("")}`;
  foot.innerHTML = `${sumHTML()}<button class="btn btn-primary btn-block" id="toCheckout">${esc(t("order", { amount: won(sub + shippingFor(sub)) }))}</button>`;

  $$("[data-step]", body).forEach((b) => b.addEventListener("click", () => {
    const l = state.cart[+b.dataset.i];
    l.qty += +b.dataset.step;
    if (l.qty < 1) state.cart.splice(+b.dataset.i, 1);
    saveCart(); updateCounts(); renderDrawer();
  }));
  $$("[data-remove]", body).forEach((b) => b.addEventListener("click", () => {
    state.cart.splice(+b.dataset.remove, 1);
    saveCart(); updateCounts(); renderDrawer();
  }));
  $("#toCheckout").addEventListener("click", () => { state.drawer = "checkout"; renderDrawer(); });
}

function drawCheckout(body, foot) {
  if (!state.cart.length) { state.drawer = "cart"; renderDrawer(); return; }
  const ko = state.lang === "ko";
  const sub = cartSubtotal();
  const total = sub + shippingFor(sub);

  // Pre-filled demo details so the flow can be shown in a few taps
  body.innerHTML = `
    <section class="co-block">
      <h3>${esc(t("delivery"))}</h3>
      <div class="field-row">
        <label class="field"><span class="sr-only">${esc(t("name"))}</span><input id="coName" placeholder="${esc(t("name"))}" value="${ko ? "김지우" : "Kim Ji-woo"}" autocomplete="name"></label>
        <label class="field"><span class="sr-only">${esc(t("phone"))}</span><input id="coPhone" placeholder="${esc(t("phone"))}" value="010-1234-5678" inputmode="tel" autocomplete="tel"></label>
      </div>
      <label class="field"><span class="sr-only">${esc(t("address"))}</span><input id="coAddr" placeholder="${esc(t("address"))}" value="${ko ? "서울 마포구 와우산로 00" : "00 Wausan-ro, Mapo-gu, Seoul"}" autocomplete="street-address"></label>
      <label class="field"><span class="sr-only">${esc(t("address2"))}</span><input placeholder="${esc(t("address2"))}" value="${ko ? "101동 1001호" : "Bldg 101, Unit 1001"}"></label>
    </section>

    <section class="co-block">
      <h3>${esc(t("payMethod"))}</h3>
      <div class="pays">
        ${Object.entries(PAYMENTS).map(([k, pm]) => `
          <button class="pay ${state.payment === k ? "is-active" : ""}" data-pay="${k}" aria-pressed="${state.payment === k}">
            <span class="pay-logo ${pm.logo}">${pm.mark}</span>${esc(pm.label())}
            <span class="pay-tick"><svg><use href="#i-check"/></svg></span>
          </button>`).join("")}
      </div>
      <p class="co-note">${esc(t("demoPay"))}</p>
    </section>

    <label class="agree"><input type="checkbox" id="coAgree" checked> ${esc(t("agree"))}</label>`;

  foot.innerHTML = `${sumHTML()}<button class="btn btn-primary btn-block" id="payNow">${esc(t("pay", { amount: won(total) }))}</button>`;

  $$("[data-pay]", body).forEach((b) => b.addEventListener("click", () => {
    state.payment = b.dataset.pay;
    $$("[data-pay]", body).forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", x === b); });
  }));

  $("#payNow").addEventListener("click", (e) => {
    const fields = ["#coName", "#coPhone", "#coAddr"].map((s) => $(s, body));
    fields.forEach((f) => f.classList.toggle("invalid", !f.value.trim()));
    const missing = fields.find((f) => !f.value.trim());
    if (missing) { toast(t("fillAll")); missing.focus(); return; }
    if (!$("#coAgree").checked) { toast(t("agreeFirst")); return; }

    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = t("processing");
    setTimeout(() => {
      const d = new Date();
      const p2 = (n) => String(n).padStart(2, "0");
      state.lastOrder = {
        no: `KM${String(d.getFullYear()).slice(2)}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${Math.floor(10000 + Math.random() * 89999)}`,
        total, payment: state.payment,
        from: new Date(d.getTime() + 7 * 864e5), to: new Date(d.getTime() + 12 * 864e5),
      };
      state.cart = [];
      saveCart(); updateCounts();
      state.drawer = "done";
      renderDrawer();
    }, 1000);
  });
}

function drawDone(body, foot) {
  const o = state.lastOrder;
  const fmt = (d) => d.toLocaleDateString(state.lang === "ko" ? "ko-KR" : "en-GB", { month: "short", day: "numeric", weekday: "short" });
  body.innerHTML = `
    <div class="done">
      <div class="done-badge"><svg><use href="#i-check"/></svg></div>
      <h3>${esc(t("doneTitle"))}</h3>
      <p>${esc(t("doneText"))}</p>
      <div class="receipt">
        <div class="sum">
          <div><span>${esc(t("orderNo"))}</span><span>${o.no}</span></div>
          <div><span>${esc(t("paidBy"))}</span><span>${esc(PAYMENTS[o.payment].label())}</span></div>
          <div><span>${esc(t("eta"))}</span><span>${fmt(o.from)} – ${fmt(o.to)}</span></div>
          <div class="total"><span>${esc(t("paid"))}</span><span>${won(o.total)}</span></div>
        </div>
      </div>
      <p class="co-note">${esc(t("demoPay"))}</p>
    </div>`;
  foot.innerHTML = `
    <button class="btn btn-primary btn-block" data-close>${esc(t("keepShopping"))}</button>
    <button class="btn btn-ghost btn-block" data-demo-link>${esc(t("orderList"))}</button>`;
}

function drawWish(body, foot) {
  foot.innerHTML = "";
  const items = PRODUCTS.filter((p) => state.wish.has(p.id));
  if (!items.length) { body.innerHTML = emptyState("i-heart", "emptyWish", "emptyWishSub"); return; }
  body.innerHTML = items.map((p) => `
    <div class="line">
      ${media(p.id, L(p.name))}
      <div>
        <div class="line-top">
          <p class="line-name">${esc(L(p.name))}</p>
          <button class="line-x" data-unwish="${p.id}" aria-label="Remove"><svg><use href="#i-close"/></svg></button>
        </div>
        ${priceHTML(p)}
        <div class="line-bottom">
          <span class="rating"><svg><use href="#i-star"/></svg>${p.rating.toFixed(1)}</span>
          <button class="btn btn-dark" style="min-height:36px;padding:0 14px;font-size:.8rem" data-view="${p.id}">${esc(t("addToCart"))}</button>
        </div>
      </div>
    </div>`).join("");
  $$("[data-unwish]", body).forEach((b) => b.addEventListener("click", () => toggleWish(b.dataset.unwish)));
  $$("[data-view]", body).forEach((b) => b.addEventListener("click", () => openSheet(b.dataset.view)));
}

function drawAccount(body, foot) {
  foot.innerHTML = "";
  body.innerHTML = `
    <div class="acct-card">
      <strong>${esc(t("myHello"))}</strong>
      <p>${esc(t("myHelloSub"))}</p>
      <div class="acct-stats">
        <div><b>0</b><span>${esc(t("orders"))}</span></div>
        <div><b>0</b><span>${esc(t("coupons"))}</span></div>
        <div><b>₩0</b><span>${esc(t("points"))}</span></div>
      </div>
    </div>
    <div class="acct-login">
      <button class="btn btn-kakao btn-block" data-demo-link><svg><use href="#i-chat"/></svg>${esc(t("kakaoLogin"))}</button>
      <button class="btn btn-naver btn-block" data-demo-link>${esc(t("naverLogin"))}</button>
    </div>
    <nav class="menu-list">
      <a href="#top" data-demo-link>${esc(t("menuOrders"))}<svg><use href="#i-next"/></svg></a>
      <a href="#top" data-open="wishlist">${esc(t("menuWish"))}<svg><use href="#i-next"/></svg></a>
      <a href="#top" data-demo-link>${esc(t("menuReviews"))}<svg><use href="#i-next"/></svg></a>
      <a href="#top" data-demo-link>${esc(t("menuCs"))}<svg><use href="#i-next"/></svg></a>
    </nav>`;
}

function initOverlays() {
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) { e.preventDefault(); openDrawer(opener.dataset.open); return; }
    if (e.target.closest("[data-close]")) { closeAll(); return; }
    const demo = e.target.closest("[data-demo-link]");
    if (demo) { e.preventDefault(); toast(t("demoLink")); }
  });
  backdrop.addEventListener("click", closeAll);
  $("#drawerBack").addEventListener("click", () => { state.drawer = "cart"; renderDrawer(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && (state.sheet || state.drawer)) closeAll(); });

  // Swipe the bottom sheet down to close it (mobile)
  const sheet = $("#sheet");
  let y0 = null;
  sheet.addEventListener("touchstart", (e) => { if (sheet.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener("touchmove", (e) => {
    if (y0 === null) return;
    const dy = e.touches[0].clientY - y0;
    if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  sheet.addEventListener("touchend", (e) => {
    if (y0 === null) return;
    const dy = e.changedTouches[0].clientY - y0;
    sheet.style.transform = "";
    y0 = null;
    if (dy > 110) closeAll();
  });
}

/* ---------- 11. Language, header, bottom nav, toast, boot ---------- */
let toastTimer;
function toast(msg, ok = false) {
  const el = $("#toast");
  el.innerHTML = `${ok ? `<span class="t-dot"><svg><use href="#i-check"/></svg></span>` : ""}<span>${esc(msg)}</span>`;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), 2200);
}

function setLang(lang, announce = false) {
  state.lang = lang === "en" ? "en" : "ko";
  store.set("lang", state.lang);
  document.documentElement.lang = state.lang;
  $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  $$(".lang-toggle [data-lang]").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === state.lang));
  renderAll();
  if (state.sheet) renderSheet();
  if (state.drawer) renderDrawer();
  if (announce) toast(t("langOn"));
}

function setNavActive(name) {
  $$(".bottom-nav [data-nav]").forEach((b) => b.classList.toggle("is-active", b.dataset.nav === name));
}

function initChrome() {
  $$(".lang-toggle [data-lang]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.lang !== state.lang) setLang(b.dataset.lang, true);
  }));

  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Bottom navigation
  $(".bottom-nav").addEventListener("click", (e) => {
    const item = e.target.closest("[data-nav]");
    if (!item) return;
    setNavActive(item.dataset.nav);
    if (item.dataset.nav === "search") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => $("#searchInput").focus(), 300);
    }
    if (item.dataset.nav === "home") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateStaticMedia();
  initChrome();
  initCarousel();
  initFilters();
  initCards();
  initOverlays();
  setLang(state.lang);
  updateCounts();
});
