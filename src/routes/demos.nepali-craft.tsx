import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Facebook,
  Home,
  Instagram,
  LayoutGrid,
  Leaf,
  Minus,
  Plus,
  Ruler,
  Search,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";
import {
  DemoBanner,
  demoBusiness,
  demoHead,
  KOREA,
  validateDemoSearch,
} from "@/components/demo-banner";

export const Route = createFileRoute("/demos/nepali-craft")({
  validateSearch: validateDemoSearch,
  head: ({ match }) => {
    const base = demoHead(
      "/demos/nepali-craft",
      "TAANA — Handwoven Nepal Store Demo",
      "Sample online store by Saphin Praja selling handwoven Nepali textiles into Korea: dhaka, pashmina, allo nettle and yak wool cut as modern pieces, with an English/Korean toggle, material filters and KakaoPay / Naver Pay / Toss checkout.",
      match.search.n,
    );
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@200;300;400;500&display=swap",
        },
        { rel: "preload", as: "image", href: "/demos/nepali-craft/banner-loom.webp" },
      ],
    };
  },
  component: Craft,
});

const IMG = "/demos/nepali-craft";

type Lang = "en" | "ko";
type Size = "XS" | "S" | "M" | "L" | "XL" | "ONE";
type Colour = { name: string; ko: string; hex: string };
type Bi = { en: string; ko: string };
type Material = "dhaka" | "pashmina" | "allo" | "yak" | "hemp" | "silk";

type Product = {
  id: number;
  name: string;
  korean: string;
  category: string;
  material: Material;
  price: number;
  was?: number;
  img: string;
  tag?: "NEW";
  // Who made it and how long it took. This is the whole proposition of the shop, so it
  // sits on the card, not buried in a tab.
  maker: Bi;
  days: number;
  fabric: Bi;
  care: Bi;
  about: Bi;
  rating: number;
  reviews: number;
  sizes: Size[];
  colours: Colour[];
  soldOut?: Size[];
};

const T: Record<Lang, Record<string, string>> = {
  en: {
    promo: "Handwoven in Nepal · Air freight to Korea in 5–8 days · Free over ₩150,000",
    searchPlaceholder: "Search dhaka, pashmina, allo…",
    cart: "Cart",
    account: "Account",
    shop: "Shop",
    home: "Home",
    materials: "Materials",

    heroCta: "See the cloth",
    matTitle: "Shop by cloth",
    matSub:
      "Six fibres, each one spun and woven by hand. Start with the material, not the garment.",
    matAll: "All cloth",
    matDhaka: "Dhaka",
    matPashmina: "Pashmina",
    matAllo: "Allo nettle",
    matYak: "Yak wool",
    matHemp: "Hemp",
    matSilk: "Raw silk",
    matDhakaNote: "Handwoven cotton, geometric, the same on both sides.",
    matPashminaNote: "Mountain goat undercoat. Light, and very warm.",
    matAlloNote: "Himalayan nettle fibre. Strong, slightly rough, softens with wear.",
    matYakNote: "Yak down from above 3,000m. Warmer than merino, no itch.",
    matHempNote: "Grown without irrigation. Stiff at first, then it drapes.",
    matSilkNote: "Unbleached, uneven, with the slubs left in.",

    bestTitle: "Pieces people keep",
    bestSub: "Our most reordered garments",
    newTitle: "New from the loom",
    newSub: "Woven in the last six weeks",
    allTitle: "Everything",
    allSub: "Each piece names the person who wove it",
    viewAll: "View all",
    empty: "Nothing in this cloth yet. Try another material.",

    traceTitle: "From fibre to your door",
    traceSub: "Four steps, four places, all of them named.",
    tr1t: "Fibre",
    tr1d: "Nettle cut in Sankhuwasabha, pashmina combed in Mustang.",
    tr2t: "Spun",
    tr2d: "By hand, by a co-operative of 30 women in Bhaktapur.",
    tr3t: "Woven",
    tr3d: "On wooden looms, in the weaver's own home, paid per metre.",
    tr4t: "Cut",
    tr4d: "In our Patan studio, by four tailors, in runs of thirty.",

    makerTitle: "Who made this",
    makerDays: "days on the loom",

    storyEyebrow: "WHY HANDWOVEN",
    storyTitle1: "A loom makes",
    storyTitle2: "about four metres a day",
    storyBody:
      "A power loom makes four hundred. That difference is the entire price of everything on this page, and it is also the reason the cloth behaves differently — the tension varies slightly, the weave breathes, and it softens into the shape of the person wearing it rather than away from them. We are not asking you to buy this because it is Nepali. We are asking because it lasts.",
    st1t: "Paid per metre, monthly",
    st1d: "Not per piece, and never on completion of a whole order.",
    st2t: "No middle buyer",
    st2d: "We buy from the weaver. There is nobody between us.",
    st3t: "Mended free, forever",
    st3d: "Send it back at any point and we will repair it.",

    shipTitle: "Getting it to Korea",
    ship1t: "5–8 days to your door",
    ship1d: "Air freight from Kathmandu, tracked throughout.",
    ship2t: "Duties included",
    ship2d: "The listed price is final. No customs bill on arrival.",
    ship3t: "Repairs for life",
    ship3d: "Any piece, any age. You pay the postage one way.",

    revTitle: "What people say",
    revSub: "Verified purchases, Korea",

    sizeGuide: "Size guide",
    sizeTitle: "Size guide",
    sizeNote:
      "Handwoven cloth varies by up to two centimetres between pieces. Our cuts are relaxed — if you want it close to the body, size down. Measurements in centimetres.",
    sizeCol1: "Size",
    sizeCol2: "Chest",
    sizeCol3: "Waist",
    sizeCol4: "Length",

    selectSize: "Size",
    selectColour: "Colour",
    sizeRequired: "Please choose a size first",
    addToCart: "Add to cart",
    added: "Added to cart",
    fabric: "Cloth",
    care: "Care",

    cartTitle: "Your cart",
    cartEmpty: "Your cart is empty",
    cartEmptySub: "Add a piece and it will show up here.",
    keepShopping: "Keep shopping",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    youSave: "You save",
    toFree: "away from free shipping",
    checkout: "Checkout",
    backToCart: "Back to cart",

    delivery: "Delivery details",
    fullName: "Full name",
    phone: "Phone",
    addr: "Address",
    addrPlaceholder: "Street, building, unit",
    city: "City",
    postcode: "Postcode",
    payment: "Payment",
    placeOrder: "Place order",
    orderDone: "Order placed",
    orderDoneSub:
      "Thank you. This is a demo store, so nothing was charged and nothing will be sent.",
    orderNo: "Order number",
    continueShopping: "Continue shopping",

    accountTitle: "My account",
    accountDemo: "Demo account — signed in as a sample customer",
    member: "Member",
    orders: "Orders",
    coupons: "Coupons",
    points: "Points",
    recentOrders: "Recent orders",
    statusPrep: "Preparing",
    statusShip: "In transit",
    statusDone: "Delivered",
    menuProfile: "Profile and addresses",
    menuWish: "Saved pieces",
    menuRepair: "Request a repair",
    menuHelp: "Help centre",
    signOut: "Sign out",

    newsTitle: "Four letters a year",
    newsSub: "When a new cloth comes off the loom, and nothing else.",
    newsPlaceholder: "Email address",
    newsCta: "Sign up",
    newsDone: "Thank you — you are on the list.",

    footShop: "Shop",
    footHelp: "Customer service",
    footAbout: "About",
    footSize: "Size guide",
    footShip: "Shipping and customs",
    footReturn: "Returns and repairs",
    footFaq: "FAQ",
    footStory: "Why handwoven",
    footWeavers: "The weavers",
    footContact: "Contact",
    csHours: "Customer service 10:00–18:00 KST, Monday to Friday",

    coRegName: "Registered name",
    coRep: "Representative",
    coReg: "Business registration no.",
    coMail: "Mail-order licence",
    coPrivacy: "Privacy officer",
    coAddr: "Address",
    coReturn: "Returns address",
    coDisclaimer:
      "This is a sample website built as a portfolio piece. The business details above are placeholders, and the products, weavers and reviews are invented. No order can be placed.",
  },
  ko: {
    promo: "네팔 수직 제작 · 한국까지 항공 5~8일 · 15만원 이상 무료배송",
    searchPlaceholder: "다카, 파슈미나, 알로 검색",
    cart: "장바구니",
    account: "마이페이지",
    shop: "쇼핑",
    home: "홈",
    materials: "소재",

    heroCta: "원단 보기",
    matTitle: "원단으로 고르기",
    matSub: "여섯 가지 섬유, 모두 손으로 잣고 손으로 짰습니다. 옷이 아니라 원단에서 시작해 보세요.",
    matAll: "전체",
    matDhaka: "다카",
    matPashmina: "파슈미나",
    matAllo: "알로 (쐐기풀)",
    matYak: "야크 울",
    matHemp: "헴프",
    matSilk: "로우 실크",
    matDhakaNote: "수직 면직물. 기하학 무늬가 앞뒤로 똑같습니다.",
    matPashminaNote: "산양의 속털. 가볍고 아주 따뜻합니다.",
    matAlloNote: "히말라야 쐐기풀 섬유. 질기고 약간 거칠며 입을수록 부드러워집니다.",
    matYakNote: "해발 3,000m 이상의 야크 솜털. 메리노보다 따뜻하고 따갑지 않습니다.",
    matHempNote: "관개 없이 자랍니다. 처음엔 뻣뻣하지만 곧 자연스럽게 떨어집니다.",
    matSilkNote: "표백하지 않아 결이 고르지 않고 슬럽이 그대로 남아 있습니다.",

    bestTitle: "오래 입는 제품",
    bestSub: "재구매가 가장 많은 제품",
    newTitle: "새로 짠 제품",
    newSub: "최근 6주 사이에 짠 원단",
    allTitle: "전체 상품",
    allSub: "모든 제품에 직조한 사람의 이름이 적혀 있습니다",
    viewAll: "전체 보기",
    empty: "해당 원단의 상품이 아직 없습니다. 다른 소재를 선택해 보세요.",

    traceTitle: "섬유에서 문 앞까지",
    traceSub: "네 단계, 네 곳. 모두 이름을 밝힙니다.",
    tr1t: "섬유",
    tr1d: "쐐기풀은 상쿠와사바에서, 파슈미나는 무스탕에서.",
    tr2t: "방적",
    tr2d: "박타푸르 여성 30명의 협동조합이 손으로 잣습니다.",
    tr3t: "직조",
    tr3d: "직조공의 집에 있는 나무 베틀에서, 미터 단위로 지급합니다.",
    tr4t: "재단",
    tr4d: "파탄 스튜디오에서 재단사 4명이 30벌 단위로 만듭니다.",

    makerTitle: "만든 사람",
    makerDays: "일 직조",

    storyEyebrow: "왜 수직인가",
    storyTitle1: "베틀 하나가 하루에",
    storyTitle2: "짜는 길이는 약 4미터입니다",
    storyBody:
      "기계 직기는 400미터를 짭니다. 이 차이가 이 페이지에 있는 모든 가격의 이유이며, 동시에 원단이 다르게 움직이는 이유이기도 합니다. 장력이 미세하게 달라 숨을 쉬고, 몸에서 멀어지는 대신 입는 사람의 모양으로 부드러워집니다. 네팔산이라서 사달라는 말씀이 아닙니다. 오래 가기 때문에 권해 드립니다.",
    st1t: "미터당, 월 단위 지급",
    st1d: "벌당이 아니고, 주문 완납 후 지급도 아닙니다.",
    st2t: "중간 상인 없음",
    st2d: "직조공에게 직접 삽니다. 사이에 아무도 없습니다.",
    st3t: "평생 무료 수선",
    st3d: "언제든 보내주시면 수선해 드립니다.",

    shipTitle: "한국까지 배송",
    ship1t: "문 앞까지 5~8일",
    ship1d: "카트만두에서 항공 발송, 전 구간 배송조회 가능합니다.",
    ship2t: "관세 포함",
    ship2d: "표시된 가격이 최종 가격입니다. 수령 시 추가 비용이 없습니다.",
    ship3t: "평생 수선",
    ship3d: "제품과 구매 시기에 관계없이. 편도 배송비만 부담하시면 됩니다.",

    revTitle: "구매 후기",
    revSub: "한국 구매 확인 후기",

    sizeGuide: "사이즈 가이드",
    sizeTitle: "사이즈 가이드",
    sizeNote:
      "수직 원단은 제품마다 최대 2cm까지 차이가 납니다. 저희 패턴은 넉넉한 편이므로 몸에 맞게 입으시려면 한 치수 작게 선택하세요. 단위는 센티미터입니다.",
    sizeCol1: "사이즈",
    sizeCol2: "가슴둘레",
    sizeCol3: "허리둘레",
    sizeCol4: "총장",

    selectSize: "사이즈",
    selectColour: "색상",
    sizeRequired: "사이즈를 먼저 선택해 주세요",
    addToCart: "장바구니 담기",
    added: "장바구니에 담았습니다",
    fabric: "원단",
    care: "세탁 방법",

    cartTitle: "장바구니",
    cartEmpty: "장바구니가 비어 있습니다",
    cartEmptySub: "상품을 담으면 여기에 표시됩니다.",
    keepShopping: "쇼핑 계속하기",
    subtotal: "상품 금액",
    shipping: "배송비",
    free: "무료",
    total: "결제 금액",
    youSave: "할인 금액",
    toFree: "더 담으면 무료배송",
    checkout: "주문하기",
    backToCart: "장바구니로",

    delivery: "배송지 정보",
    fullName: "받는 분",
    phone: "연락처",
    addr: "주소",
    addrPlaceholder: "도로명, 건물, 호수",
    city: "도시",
    postcode: "우편번호",
    payment: "결제 수단",
    placeOrder: "결제하기",
    orderDone: "주문이 완료되었습니다",
    orderDoneSub: "감사합니다. 데모 사이트이므로 실제 결제와 배송은 이루어지지 않습니다.",
    orderNo: "주문번호",
    continueShopping: "쇼핑 계속하기",

    accountTitle: "마이페이지",
    accountDemo: "데모 계정 — 샘플 고객으로 로그인되어 있습니다",
    member: "등급",
    orders: "주문",
    coupons: "쿠폰",
    points: "포인트",
    recentOrders: "최근 주문",
    statusPrep: "상품준비중",
    statusShip: "배송중",
    statusDone: "배송완료",
    menuProfile: "회원정보 및 배송지",
    menuWish: "찜한 제품",
    menuRepair: "수선 신청",
    menuHelp: "고객센터",
    signOut: "로그아웃",

    newsTitle: "연 4회 소식",
    newsSub: "새 원단이 베틀에서 내려올 때만 보내드립니다. 그 외에는 보내지 않습니다.",
    newsPlaceholder: "이메일 주소",
    newsCta: "신청하기",
    newsDone: "감사합니다. 신청이 완료되었습니다.",

    footShop: "쇼핑",
    footHelp: "고객 지원",
    footAbout: "브랜드",
    footSize: "사이즈 가이드",
    footShip: "배송 및 관세",
    footReturn: "반품 및 수선",
    footFaq: "자주 묻는 질문",
    footStory: "왜 수직인가",
    footWeavers: "직조 장인들",
    footContact: "문의하기",
    csHours: "고객센터 평일 10:00~18:00 (KST)",

    coRegName: "상호",
    coRep: "대표자",
    coReg: "사업자등록번호",
    coMail: "통신판매업신고",
    coPrivacy: "개인정보관리책임자",
    coAddr: "주소",
    coReturn: "반품 주소",
    coDisclaimer:
      "본 사이트는 포트폴리오용 샘플입니다. 위 사업자 정보는 임의의 표기이며 상품, 직조공, 후기는 모두 가상입니다. 실제 주문은 되지 않습니다.",
  },
};

const SIZES: Size[] = ["XS", "S", "M", "L", "XL"];
const ONE_SIZE: Size[] = ["ONE"];

const products: Product[] = [
  {
    id: 1,
    name: "Dhaka Weave Shirt",
    korean: "다카 위브 셔츠",
    category: "Shirts",
    material: "dhaka",
    price: 119000,
    img: "dhaka-shirt",
    maker: { en: "Woven by Sunita Rai, Terhathum", ko: "수니타 라이 · 테르하툼" },
    days: 3,
    fabric: { en: "100% handwoven cotton", ko: "수직 면 100%" },
    care: { en: "Machine wash cold, iron warm", ko: "찬물 세탁, 중온 다림질" },
    about: {
      en: "A straight-cut shirt in handwoven dhaka. The pattern runs through the cloth, so the inside of the collar looks the same as the outside.",
      ko: "수직 다카로 지은 스트레이트 셔츠입니다. 무늬가 원단을 관통해 짜여 있어 칼라 안쪽도 바깥쪽과 똑같습니다.",
    },
    rating: 4.8,
    reviews: 96,
    sizes: SIZES,
    colours: [
      { name: "Ash", ko: "애쉬", hex: "#8d8a82" },
      { name: "Clay", ko: "클레이", hex: "#a9705a" },
    ],
    soldOut: ["XS"],
  },
  {
    id: 2,
    name: "Undyed Pashmina Scarf",
    korean: "무염색 파슈미나 스카프",
    category: "Accessories",
    material: "pashmina",
    price: 98000,
    img: "pashmina-scarf",
    maker: { en: "Woven by Dolma Gurung, Mustang", ko: "돌마 구룽 · 무스탕" },
    days: 2,
    fabric: { en: "100% pashmina, undyed", ko: "파슈미나 100%, 무염색" },
    care: { en: "Hand wash cold, dry flat", ko: "찬물 손세탁, 눕혀서 건조" },
    about: {
      en: "The undercoat of a mountain goat, combed out by hand in spring. Left the colour it grew.",
      ko: "봄에 손으로 빗어낸 산양의 속털입니다. 자란 그대로의 색을 그대로 두었습니다.",
    },
    rating: 4.9,
    reviews: 184,
    sizes: ONE_SIZE,
    colours: [
      { name: "Natural", ko: "내추럴", hex: "#d9cfbc" },
      { name: "Soft Grey", ko: "소프트 그레이", hex: "#9c9890" },
    ],
  },
  {
    id: 3,
    name: "Himalayan Hemp Jacket",
    korean: "히말라얀 헴프 자켓",
    category: "Outerwear",
    material: "hemp",
    price: 229000,
    img: "hemp-jacket",
    tag: "NEW",
    maker: { en: "Woven by Bimala Tamang, Dolakha", ko: "비말라 타망 · 돌카" },
    days: 5,
    fabric: { en: "Handwoven hemp, cotton lining", ko: "수직 헴프, 면 안감" },
    care: { en: "Machine wash cold, line dry", ko: "찬물 세탁, 자연 건조" },
    about: {
      en: "A boxy unlined-look jacket with patch pockets. Stiff for the first month, then it falls properly.",
      ko: "패치 포켓이 달린 박시한 자켓입니다. 첫 한 달은 뻣뻣하지만 이후 자연스럽게 떨어집니다.",
    },
    rating: 4.7,
    reviews: 42,
    sizes: SIZES,
    colours: [
      { name: "Raw", ko: "로우", hex: "#c2b49a" },
      { name: "Charcoal", ko: "차콜", hex: "#3d3c39" },
    ],
  },
  {
    id: 4,
    name: "Allo Nettle Knit",
    korean: "알로 니트",
    category: "Knitwear",
    material: "allo",
    price: 139000,
    img: "allo-knit",
    maker: { en: "Spun by the Bhaktapur co-operative", ko: "박타푸르 협동조합 방적" },
    days: 4,
    fabric: { en: "70% allo nettle, 30% cotton", ko: "알로 70%, 면 30%" },
    care: { en: "Hand wash cold, dry flat", ko: "찬물 손세탁, 눕혀서 건조" },
    about: {
      en: "Himalayan nettle fibre, which is closer to linen than wool. Slightly rough at first and much softer after three washes.",
      ko: "히말라야 쐐기풀 섬유로, 울보다 린넨에 가깝습니다. 처음엔 약간 거칠지만 세 번 세탁하면 훨씬 부드러워집니다.",
    },
    rating: 4.6,
    reviews: 71,
    sizes: SIZES,
    colours: [
      { name: "Oat", ko: "오트", hex: "#cfc3ab" },
      { name: "Moss", ko: "모스", hex: "#6f7557" },
    ],
  },
  {
    id: 5,
    name: "Kurta-Line Dress",
    korean: "쿠르타 라인 드레스",
    category: "Dresses",
    material: "silk",
    price: 159000,
    img: "kurta-dress",
    maker: { en: "Cut in the Patan studio", ko: "파탄 스튜디오 재단" },
    days: 2,
    fabric: { en: "Raw silk, unbleached", ko: "로우 실크, 무표백" },
    care: { en: "Dry clean, or gentle hand wash", ko: "드라이클리닝 또는 약하게 손세탁" },
    about: {
      en: "The long straight line of a kurta, cut as a dress with side slits and deep pockets. Nothing fastens.",
      ko: "쿠르타의 길고 곧은 실루엣을 드레스로 재단했습니다. 옆트임과 깊은 주머니가 있고 여밈이 없습니다.",
    },
    rating: 4.8,
    reviews: 88,
    sizes: SIZES,
    colours: [
      { name: "Bone", ko: "본", hex: "#e3dccd" },
      { name: "Indigo", ko: "인디고", hex: "#2e3a52" },
    ],
  },
  {
    id: 6,
    name: "Wool Coat, Dhaka Trim",
    korean: "울 코트 다카 트림",
    category: "Outerwear",
    material: "dhaka",
    price: 319000,
    img: "dhaka-coat",
    maker: { en: "Woven by Sunita Rai, Terhathum", ko: "수니타 라이 · 테르하툼" },
    days: 7,
    fabric: { en: "Wool blend, handwoven dhaka facing", ko: "울 혼방, 수직 다카 배색" },
    care: { en: "Dry clean only", ko: "드라이클리닝" },
    about: {
      en: "A plain long coat with the handwoven pattern used only on the inside facing and the cuff turn-back. Quiet from the outside.",
      ko: "단정한 롱코트로, 수직 무늬는 안쪽 배색과 소맷단 접힘에만 사용했습니다. 밖에서는 드러나지 않습니다.",
    },
    rating: 4.9,
    reviews: 37,
    sizes: SIZES,
    colours: [
      { name: "Stone", ko: "스톤", hex: "#a8a299" },
      { name: "Black", ko: "블랙", hex: "#26262a" },
    ],
  },
  {
    id: 7,
    name: "Indigo Wrap Skirt",
    korean: "인디고 랩 스커트",
    category: "Bottoms",
    material: "hemp",
    price: 129000,
    img: "indigo-wrap",
    maker: { en: "Dyed by Ram Shrestha, Patan", ko: "람 슈레스타 · 파탄 염색" },
    days: 3,
    fabric: { en: "Handwoven hemp, natural indigo", ko: "수직 헴프, 천연 인디고" },
    care: { en: "Hand wash cold, separately", ko: "찬물 단독 손세탁" },
    about: {
      en: "Dipped eight times in a natural indigo vat, so it will fade slowly and unevenly, which is the point.",
      ko: "천연 인디고 통에 여덟 번 담가 염색했습니다. 천천히 그리고 고르지 않게 바래는 것이 이 제품의 특징입니다.",
    },
    rating: 4.7,
    reviews: 54,
    sizes: SIZES,
    colours: [
      { name: "Indigo", ko: "인디고", hex: "#2e3a52" },
      { name: "Pale Indigo", ko: "페일 인디고", hex: "#6b7c96" },
    ],
  },
  {
    id: 8,
    name: "Felted Yak Vest",
    korean: "펠트 야크 베스트",
    category: "Knitwear",
    material: "yak",
    price: 109000,
    img: "felted-vest",
    maker: { en: "Felted by Pema Sherpa, Solukhumbu", ko: "페마 셰르파 · 솔루쿰부" },
    days: 2,
    fabric: { en: "100% felted yak wool", ko: "야크 울 100% 펠트" },
    care: { en: "Air it. Wash only when you must.", ko: "통풍 건조. 꼭 필요할 때만 세탁하세요." },
    about: {
      en: "Wool pressed into cloth rather than woven, so there is no seam and no edge to fray.",
      ko: "짜지 않고 눌러 만든 원단이라 봉제선이 없고 올이 풀릴 가장자리도 없습니다.",
    },
    rating: 4.6,
    reviews: 33,
    sizes: SIZES,
    colours: [
      { name: "Slate", ko: "슬레이트", hex: "#55565a" },
      { name: "Camel", ko: "카멜", hex: "#a9825c" },
    ],
  },
  {
    id: 9,
    name: "Handloom Wide Trouser",
    korean: "핸드룸 와이드 팬츠",
    category: "Bottoms",
    material: "hemp",
    price: 119000,
    was: 139000,
    img: "wide-trouser",
    maker: { en: "Woven by Bimala Tamang, Dolakha", ko: "비말라 타망 · 돌카" },
    days: 3,
    fabric: { en: "Handwoven hemp cotton", ko: "수직 헴프 면" },
    care: { en: "Machine wash cold", ko: "찬물 세탁" },
    about: {
      en: "A wide straight leg with a drawstring waist. Cut long so it breaks on the foot.",
      ko: "허리에 끈이 들어간 와이드 스트레이트 핏입니다. 발등에서 한 번 접히도록 길게 재단했습니다.",
    },
    rating: 4.8,
    reviews: 112,
    sizes: SIZES,
    colours: [
      { name: "Raw", ko: "로우", hex: "#c2b49a" },
      { name: "Ink", ko: "잉크", hex: "#2d2e32" },
    ],
  },
  {
    id: 10,
    name: "Yak Wool Sweater",
    korean: "야크 울 스웨터",
    category: "Knitwear",
    material: "yak",
    price: 189000,
    img: "yak-sweater",
    tag: "NEW",
    maker: { en: "Knitted by Pema Sherpa, Solukhumbu", ko: "페마 셰르파 · 솔루쿰부" },
    days: 6,
    fabric: { en: "100% yak down", ko: "야크 솜털 100%" },
    care: { en: "Hand wash cold, dry flat", ko: "찬물 손세탁, 눕혀서 건조" },
    about: {
      en: "Yak down from above three thousand metres. Warmer than merino by weight, and it does not itch.",
      ko: "해발 3,000m 이상에서 얻은 야크 솜털입니다. 같은 무게의 메리노보다 따뜻하고 따갑지 않습니다.",
    },
    rating: 4.9,
    reviews: 67,
    sizes: SIZES,
    colours: [
      { name: "Undyed Brown", ko: "무염색 브라운", hex: "#7b6450" },
      { name: "Charcoal", ko: "차콜", hex: "#3d3c39" },
    ],
  },
  {
    id: 11,
    name: "Raw Silk Blouse",
    korean: "로우 실크 블라우스",
    category: "Shirts",
    material: "silk",
    price: 129000,
    img: "raw-silk-blouse",
    maker: { en: "Cut in the Patan studio", ko: "파탄 스튜디오 재단" },
    days: 2,
    fabric: { en: "Raw silk, unbleached", ko: "로우 실크, 무표백" },
    care: { en: "Dry clean recommended", ko: "드라이클리닝 권장" },
    about: {
      en: "Unbleached silk with the slubs left in, so the surface catches light unevenly. Dropped shoulder, no collar.",
      ko: "표백하지 않아 슬럽이 그대로 남아 빛을 고르지 않게 받습니다. 드롭 숄더에 칼라가 없습니다.",
    },
    rating: 4.7,
    reviews: 79,
    sizes: SIZES,
    colours: [
      { name: "Bone", ko: "본", hex: "#e3dccd" },
      { name: "Clay", ko: "클레이", hex: "#a9705a" },
    ],
  },
  {
    id: 12,
    name: "Dhaka Weave Tote",
    korean: "다카 위브 토트백",
    category: "Accessories",
    material: "dhaka",
    price: 79000,
    img: "dhaka-tote",
    maker: { en: "Woven by Sunita Rai, Terhathum", ko: "수니타 라이 · 테르하툼" },
    days: 1,
    fabric: { en: "Handwoven cotton, leather handles", ko: "수직 면, 가죽 손잡이" },
    care: { en: "Spot clean only", ko: "부분 세탁만" },
    about: {
      en: "A flat-bottomed tote in offcuts from the shirt cloth, so no two are patterned the same way.",
      ko: "셔츠 원단의 자투리로 만든 평평한 바닥의 토트백입니다. 무늬가 같은 제품이 하나도 없습니다.",
    },
    rating: 4.8,
    reviews: 128,
    sizes: ONE_SIZE,
    colours: [
      { name: "Ash Weave", ko: "애쉬 위브", hex: "#8d8a82" },
      { name: "Clay Weave", ko: "클레이 위브", hex: "#a9705a" },
    ],
  },
];

const byId = new Map(products.map((p) => [p.id, p]));

const banners = [
  {
    img: "banner-loom",
    eyebrow: "HANDWOVEN IN NEPAL",
    title: { en: "Four metres a day", ko: "하루 4미터" },
    sub: {
      en: "One weaver, one wooden loom, and the cloth every piece here is cut from",
      ko: "직조공 한 사람과 나무 베틀 하나. 이곳의 모든 옷이 이 원단에서 나옵니다",
    },
    material: "dhaka" as Material,
    align: "left" as const,
  },
  {
    img: "banner-pashmina",
    eyebrow: "PASHMINA",
    title: { en: "Combed, not shorn", ko: "깎지 않고 빗어냅니다" },
    sub: {
      en: "The undercoat of a mountain goat, taken by hand once a year in Mustang",
      ko: "무스탕에서 일 년에 한 번 손으로 빗어내는 산양의 속털",
    },
    material: "pashmina" as Material,
    align: "right" as const,
  },
  {
    img: "banner-field",
    eyebrow: "ALLO AND HEMP",
    title: { en: "Cut from the hillside", ko: "산비탈에서 베어옵니다" },
    sub: {
      en: "Nettle and hemp that grow without irrigation, at two thousand metres",
      ko: "해발 2,000m에서 관개 없이 자라는 쐐기풀과 헴프",
    },
    material: "allo" as Material,
    align: "left" as const,
  },
];

const categories: { key: string; en: string; ko: string }[] = [
  { key: "All", en: "All", ko: "전체" },
  { key: "Outerwear", en: "Outerwear", ko: "아우터" },
  { key: "Knitwear", en: "Knitwear", ko: "니트" },
  { key: "Shirts", en: "Shirts", ko: "셔츠" },
  { key: "Bottoms", en: "Bottoms", ko: "하의" },
  { key: "Dresses", en: "Dresses", ko: "원피스" },
  { key: "Accessories", en: "Accessories", ko: "액세서리" },
];

const materials: { key: Material; label: keyof (typeof T)["en"]; note: keyof (typeof T)["en"] }[] =
  [
    { key: "dhaka", label: "matDhaka", note: "matDhakaNote" },
    { key: "pashmina", label: "matPashmina", note: "matPashminaNote" },
    { key: "allo", label: "matAllo", note: "matAlloNote" },
    { key: "yak", label: "matYak", note: "matYakNote" },
    { key: "hemp", label: "matHemp", note: "matHempNote" },
    { key: "silk", label: "matSilk", note: "matSilkNote" },
  ];

const trace: { t: keyof (typeof T)["en"]; d: keyof (typeof T)["en"] }[] = [
  { t: "tr1t", d: "tr1d" },
  { t: "tr2t", d: "tr2d" },
  { t: "tr3t", d: "tr3d" },
  { t: "tr4t", d: "tr4d" },
];

const bestIds = [1, 2, 10, 9];
const newIds = [3, 10, 5, 12];

const reviews = [
  {
    name: "윤지우",
    size: "M",
    product: 1,
    rating: 5,
    text: {
      en: "I did not expect the inside of the collar to be as neat as the outside, but it genuinely is — the pattern goes right through. Three months in and it has softened without losing shape.",
      ko: "칼라 안쪽이 바깥쪽만큼 깔끔할 줄은 몰랐는데 정말 그렇습니다. 무늬가 원단을 관통해 짜여 있어요. 3개월째인데 형태는 그대로인 채 부드러워졌습니다.",
    },
  },
  {
    name: "한도윤",
    size: "ONE",
    product: 2,
    rating: 5,
    text: {
      en: "Weightless and still warm enough on its own in November. The natural colour is slightly uneven, which I like — it reads as cloth rather than as a product.",
      ko: "무게가 거의 없는데 11월에 이것만 둘러도 따뜻합니다. 자연색이 살짝 고르지 않은데 저는 그 점이 좋습니다. 공산품이 아니라 천처럼 보여요.",
    },
  },
  {
    name: "최은서",
    size: "L",
    product: 10,
    rating: 5,
    text: {
      en: "Bought it after a wool sweater made me itch for a year. This one does not, at all. Heavier than it looks in the photographs.",
      ko: "일 년 내내 따가웠던 울 스웨터 때문에 샀습니다. 이건 전혀 따갑지 않아요. 사진으로 보는 것보다 묵직합니다.",
    },
  },
  {
    name: "서지안",
    size: "S",
    product: 7,
    rating: 4,
    text: {
      en: "The indigo did transfer onto a light bag the first week, exactly as the care note warned. Washed separately twice and it stopped. Beautiful colour.",
      ko: "첫 주에 밝은색 가방에 인디고가 묻었는데 세탁 안내에 적힌 그대로였습니다. 두 번 단독 세탁하니 괜찮아졌어요. 색이 정말 예쁩니다.",
    },
  },
];

const sizeChart: { size: Size; chest: number; waist: number; length: number }[] = [
  { size: "XS", chest: 92, waist: 78, length: 64 },
  { size: "S", chest: 98, waist: 82, length: 66 },
  { size: "M", chest: 104, waist: 88, length: 68 },
  { size: "L", chest: 110, waist: 94, length: 70 },
  { size: "XL", chest: 116, waist: 100, length: 72 },
];

const payMethods = [
  { key: "kakao", en: "KakaoPay", ko: "카카오페이" },
  { key: "naver", en: "Naver Pay", ko: "네이버페이" },
  { key: "toss", en: "Toss", ko: "토스" },
  { key: "card", en: "Credit card", ko: "신용카드" },
  { key: "bank", en: "Bank transfer", ko: "무통장입금" },
];

const company: { label: keyof (typeof T)["en"]; value: Bi }[] = [
  { label: "coRegName", value: { en: "TAANA Textiles Co., Ltd.", ko: "주식회사 타나텍스타일" } },
  { label: "coRep", value: { en: "Sample Name", ko: "홍길동" } },
  { label: "coReg", value: { en: "000-00-00000", ko: "000-00-00000" } },
  { label: "coMail", value: { en: "0000-Seoul-0000", ko: "제0000-서울-0000호" } },
  { label: "coPrivacy", value: { en: "Sample Name", ko: "홍길동" } },
  {
    label: "coAddr",
    value: {
      en: "00, Sample-gil, Seongdong-gu, Seoul · Studio: Patan, Lalitpur, Nepal",
      ko: "서울시 성동구 샘플길 00 · 스튜디오: 네팔 랄릿푸르 파탄",
    },
  },
  {
    label: "coReturn",
    value: {
      en: "00, Sample-gil, Seongdong-gu, Seoul 00000",
      ko: "서울시 성동구 샘플길 00, 00000",
    },
  },
];

const accountOrders = [
  { no: "TA-20261019-0233", product: 10, variant: "L · Undyed Brown", status: "prep" as const },
  { no: "TA-20261005-0190", product: 2, variant: "ONE · Natural", status: "ship" as const },
  { no: "TA-20260921-0074", product: 1, variant: "M · Ash", status: "done" as const },
];

const FREE_SHIPPING = 150000;
const SHIPPING_FEE = 6000;
const SLIDE_MS = 3000;

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;
const keyOf = (id: number, size: Size, colour: string) => `${id}|${size}|${colour}`;
const lead = (p: Product, lang: Lang) => (lang === "ko" ? p.korean : p.name);
const sub = (p: Product, lang: Lang) => (lang === "ko" ? p.name : p.korean);

// Warp and weft — the mark is the cloth itself, which is the whole brand argument.
function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  const c = light ? "#ffffff" : "#1f1e1b";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <rect x="3" y="3" width="26" height="26" stroke={c} strokeWidth="1.3" />
      <path d="M9 3v26M16 3v26M23 3v26" stroke={c} strokeWidth="1" />
      <path d="M3 11h26M3 21h26" stroke={light ? "#ffffff" : "#a9705a"} strokeWidth="1.6" />
    </svg>
  );
}

function TikTok({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.85-2.48V9.78a5.72 5.72 0 1 0 4.94 5.66V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48Z" />
    </svg>
  );
}

function ProductCard({
  p,
  onPick,
  lang,
  t,
}: {
  p: Product;
  onPick: (p: Product) => void;
  lang: Lang;
  t: Record<string, string>;
}) {
  return (
    <button type="button" onClick={() => onPick(p)} className="taa-card group text-left">
      <div className="taa-card-img">
        <img
          src={`${IMG}/${p.img}-sm.webp`}
          srcSet={`${IMG}/${p.img}-sm.webp 480w, ${IMG}/${p.img}.webp 1050w`}
          sizes="(min-width: 768px) 33vw, 50vw"
          alt={lead(p, lang)}
          loading="lazy"
          className="taa-card-photo"
        />
        {p.tag && <span className="taa-tag">{p.tag}</span>}
      </div>
      <p className="taa-card-name">{lead(p, lang)}</p>
      <p className="taa-card-sub">{sub(p, lang)}</p>
      <p className="taa-card-maker">
        {p.maker[lang]} · {p.days} {t.makerDays}
      </p>
      <p className="taa-card-price">
        {p.was && <span className="taa-was">{won(p.was)}</span>}
        <span>{won(p.price)}</span>
      </p>
    </button>
  );
}

function Craft() {
  const { n } = Route.useSearch();
  const biz = demoBusiness(
    Route.useSearch(),
    { name: "TAANA", area: "Seongdong-gu, Seoul", address: "Seongdong-gu, Seoul" },
    "#contact",
    KOREA,
  );

  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  const [category, setCategory] = useState("All");
  const [material, setMaterial] = useState<Material | "all">("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [slide, setSlide] = useState(0);
  const [guide, setGuide] = useState(false);
  const [account, setAccount] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Measured, not hard-coded — see the note in the festive demo: the promo line wraps on
  // a phone and a fixed offset would leave the hero misaligned.
  const headRef = useRef<HTMLElement>(null);
  const [headH, setHeadH] = useState(0);

  const [quick, setQuick] = useState<Product | null>(null);
  const [pickedSize, setPickedSize] = useState<Size | null>(null);
  const [pickedColour, setPickedColour] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlide((s) => (s + 1) % banners.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [slide]);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const measure = () => setHeadH(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visible = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (material === "all" || p.material === material),
  );

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([key, qty]) => {
          const [id, size, colour] = key.split("|");
          return { key, product: byId.get(Number(id))!, size: size as Size, colour, qty };
        }),
    [cart],
  );

  const count = lines.reduce((n2, l) => n2 + l.qty, 0);
  const subtotal = lines.reduce((n2, l) => n2 + l.qty * l.product.price, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const toFree = Math.max(0, FREE_SHIPPING - subtotal);
  const saved = lines.reduce(
    (n2, l) => n2 + (l.product.was ? (l.product.was - l.product.price) * l.qty : 0),
    0,
  );

  function change(key: string, delta: number) {
    setCart((c) => {
      const next = Math.max(0, (c[key] ?? 0) + delta);
      const copy = { ...c };
      if (next === 0) delete copy[key];
      else copy[key] = next;
      return copy;
    });
  }

  function openQuick(p: Product) {
    setQuick(p);
    setPickedColour(p.colours[0].name);
    setPickedSize(p.sizes.length === 1 ? p.sizes[0] : null);
    setSizeError(false);
  }

  function addToCart() {
    if (!quick) return;
    if (!pickedSize) {
      setSizeError(true);
      return;
    }
    const colour = pickedColour ?? quick.colours[0].name;
    const key = keyOf(quick.id, pickedSize, colour);
    if (step === "done") setStep("cart");
    setCart((c) => ({ ...c, [key]: (c[key] ?? 0) + 1 }));
    setToast(`${lead(quick, lang)} · ${pickedSize} · ${colour}`);
    setQuick(null);
  }

  function pickMaterial(m: Material | "all") {
    setMaterial(m);
    setCategory("All");
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  function pickCategory(c: string) {
    setCategory(c);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  function placeOrder(e: FormEvent) {
    e.preventDefault();
    setStep("done");
    setCart({});
  }

  function subscribe(e: FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  const banner = banners[slide];
  const colourName = (c: Colour) => (lang === "ko" ? c.ko : c.name);

  const sectionHead = (title: string, subtitle: string, onView?: () => void) => (
    <div className="taa-head">
      <div>
        <h2 className="taa-head-title">{title}</h2>
        <p className="taa-head-sub">{subtitle}</p>
      </div>
      {onView && (
        <button type="button" onClick={onView} className="taa-head-link">
          {t.viewAll} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="taa">
      <style>{`
        .taa {
          font-family: "Noto Sans KR", ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          background: #f7f5f0;
          color: #1f1e1b;
          font-weight: 300;
          padding-bottom: 4rem;
        }
        @media (min-width: 768px) { .taa { padding-bottom: 0; } }
        .taa-tab { font-variant-numeric: tabular-nums; }
        .taa-wrap { max-width: 78rem; margin: 0 auto; padding-left: 1.25rem; padding-right: 1.25rem; }
        @media (min-width: 768px) { .taa-wrap { padding-left: 2.5rem; padding-right: 2.5rem; } }
        .taa-scroll { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .taa-scroll::-webkit-scrollbar { display: none; }
        .taa-caps { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; }

        /* Header ---------------------------------------------------------------- */
        .taa-promo { background: #1f1e1b; color: #ddd8ce; text-align: center; font-size: 10.5px; letter-spacing: 0.06em; padding: 0.55rem 1rem; }
        .taa-header { position: sticky; top: 0; z-index: 40; transition: background-color .45s, color .45s, box-shadow .45s; }
        .taa-header-float { color: #ffffff; }
        .taa-header-solid { background: rgba(247,245,240,.95); backdrop-filter: blur(8px); color: #1f1e1b; box-shadow: 0 1px 0 rgba(31,30,27,.08); }
        .taa-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; height: 4.25rem; }
        .taa-brand { display: flex; align-items: center; gap: 0.7rem; flex-shrink: 0; }
        .taa-brand-name { font-size: 1.05rem; font-weight: 400; letter-spacing: 0.42em; }
        .taa-search { position: relative; flex: 1; max-width: 20rem; display: none; }
        @media (min-width: 1024px) { .taa-search { display: block; } }
        .taa-search-box { width: 100%; border-bottom: 1px solid currentColor; opacity: .6; padding: 0.5rem 0 0.5rem 1.6rem; font-size: 11.5px; }
        .taa-icons { display: flex; align-items: center; gap: 1.2rem; flex-shrink: 0; }
        .taa-langs { display: flex; align-items: center; font-size: 10.5px; letter-spacing: 0.1em; }
        .taa-lang-div { padding: 0 0.4rem; opacity: .4; }
        .taa-count { position: absolute; top: -6px; right: -9px; min-width: 15px; height: 15px; display: grid; place-items: center; border-radius: 999px; font-size: 9.5px; padding: 0 4px; background: #a9705a; color: #fff; }
        .taa-nav { border-bottom: 1px solid rgba(31,30,27,.1); }
        .taa-header-float .taa-nav { border-color: rgba(255,255,255,.22); }
        .taa-nav-row { display: flex; gap: 2rem; }
        .taa-nav-item { flex-shrink: 0; padding: 0.8rem 0; font-size: 11.5px; letter-spacing: 0.06em; border-bottom: 1px solid transparent; background: none; transition: opacity .2s, border-color .2s; opacity: .62; }
        .taa-nav-item[data-on="true"] { opacity: 1; border-bottom-color: currentColor; }

        /* Hero -------------------------------------------------------------------- */
        .taa-hero { position: relative; margin-top: -8.35rem; }
        .taa-hero-frame { position: relative; width: 100%; aspect-ratio: 4/5; overflow: hidden; background: #e8e4db; }
        @media (min-width: 640px) { .taa-hero-frame { aspect-ratio: 16/9; } }
        @media (min-width: 1024px) { .taa-hero-frame { aspect-ratio: 2.2/1; } }
        .taa-hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 1.1s; }
        .taa-hero-top { position: absolute; left: 0; right: 0; top: 0; height: 240px; background: linear-gradient(to bottom, rgba(20,19,17,.5), rgba(20,19,17,0)); }
        .taa-hero-bottom { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,19,17,.6), rgba(20,19,17,.04) 50%, rgba(20,19,17,0)); }
        .taa-hero-copy { position: absolute; left: 0; right: 0; bottom: 0; color: #fff; padding-bottom: 3rem; }
        @media (min-width: 768px) { .taa-hero-copy { padding-bottom: 4.5rem; } }
        .taa-hero-title { margin-top: 0.9rem; font-size: 1.85rem; font-weight: 200; line-height: 1.18; letter-spacing: -0.01em; }
        @media (min-width: 768px) { .taa-hero-title { font-size: 3.4rem; } }
        .taa-hero-sub { margin-top: 0.8rem; font-size: 0.85rem; color: rgba(255,255,255,.85); max-width: 32rem; line-height: 1.7; }
        .taa-hero-copy[data-align="right"] { text-align: left; }
        @media (min-width: 768px) { .taa-hero-copy[data-align="right"] { text-align: right; } .taa-hero-copy[data-align="right"] .taa-hero-sub { margin-left: auto; } }
        .taa-hero-cta { margin-top: 1.7rem; display: inline-flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,.6); color: #fff; padding-bottom: 0.3rem; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; transition: gap .25s; }
        .taa-hero-cta:hover { gap: 0.9rem; }
        .taa-hero-dots { position: absolute; bottom: 1.5rem; right: 1.25rem; font-size: 10.5px; color: rgba(255,255,255,.8); letter-spacing: 0.1em; }
        @media (min-width: 768px) { .taa-hero-dots { right: 2.5rem; } }

        /* Materials ----------------------------------------------------------------- */
        .taa-mat-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; margin-top: 2rem; background: #e2ded4; border: 1px solid #e2ded4; }
        @media (min-width: 768px) { .taa-mat-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (min-width: 1024px) { .taa-mat-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
        .taa-mat { text-align: left; background: #f7f5f0; padding: 1.3rem 1rem 1.5rem; transition: background-color .25s; }
        .taa-mat:hover { background: #fff; }
        .taa-mat[data-on="true"] { background: #1f1e1b; color: #f7f5f0; }
        .taa-mat-name { font-size: 12.5px; font-weight: 400; letter-spacing: 0.04em; }
        .taa-mat-note { margin-top: 0.5rem; font-size: 10.5px; line-height: 1.7; opacity: .65; }

        /* Sections and grid ----------------------------------------------------------- */
        .taa-section { padding-top: 4.5rem; padding-bottom: 4.5rem; }
        .taa-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; }
        .taa-head-title { font-size: 1.35rem; font-weight: 300; letter-spacing: -0.01em; }
        @media (min-width: 768px) { .taa-head-title { font-size: 1.6rem; } }
        .taa-head-sub { margin-top: 0.5rem; font-size: 12px; opacity: .6; max-width: 32rem; line-height: 1.7; }
        .taa-head-link { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; opacity: .65; transition: opacity .2s; }
        .taa-head-link:hover { opacity: 1; }
        .taa-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3rem 1.25rem; margin-top: 2.2rem; }
        @media (min-width: 768px) { .taa-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3.5rem 2rem; } }
        @media (min-width: 1280px) { .taa-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }

        /* Product card ------------------------------------------------------------------ */
        .taa-card-img { position: relative; width: 100%; aspect-ratio: 3/4; overflow: hidden; background: #eae6dd; }
        .taa-card-photo { width: 100%; height: 100%; object-fit: cover; transition: transform .9s cubic-bezier(.2,.7,.2,1); }
        .taa-card:hover .taa-card-photo { transform: scale(1.035); }
        .taa-tag { position: absolute; top: 0.75rem; left: 0.75rem; font-size: 9px; letter-spacing: 0.2em; padding: 0.25rem 0.5rem; background: #f7f5f0; color: #1f1e1b; }
        .taa-card-name { margin-top: 0.9rem; font-size: 13px; font-weight: 400; line-height: 1.45; }
        .taa-card-sub { margin-top: 0.15rem; font-size: 11px; opacity: .5; }
        .taa-card-maker { margin-top: 0.5rem; font-size: 10.5px; line-height: 1.6; color: #a9705a; }
        .taa-card-price { margin-top: 0.5rem; font-size: 12.5px; font-variant-numeric: tabular-nums; display: flex; align-items: baseline; gap: 0.45rem; }
        .taa-was { font-size: 11px; opacity: .45; text-decoration: line-through; }

        /* Trace ----------------------------------------------------------------------- */
        .taa-trace { background: #1f1e1b; color: #e8e3d8; }
        .taa-trace-grid { display: grid; gap: 2rem; margin-top: 2.2rem; }
        @media (min-width: 768px) { .taa-trace-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2.5rem; } }
        .taa-trace-n { font-size: 10px; letter-spacing: 0.3em; color: #a9705a; }
        .taa-trace-t { margin-top: 0.7rem; font-size: 1.1rem; font-weight: 300; }
        .taa-trace-d { margin-top: 0.5rem; font-size: 11.5px; line-height: 1.85; opacity: .6; }
        .taa-trace .taa-head-title, .taa-trace .taa-head-sub { color: #e8e3d8; }

        /* Story ------------------------------------------------------------------------- */
        .taa-story-grid { display: grid; gap: 2.5rem; align-items: center; }
        @media (min-width: 768px) { .taa-story-grid { grid-template-columns: 1fr 1.05fr; gap: 4.5rem; } }
        .taa-story-imgs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
        .taa-story-imgs img { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #eae6dd; }
        .taa-story-imgs img:first-child { margin-top: 2.5rem; }
        .taa-story-title { margin-top: 1.1rem; font-size: 1.6rem; font-weight: 200; line-height: 1.3; }
        @media (min-width: 768px) { .taa-story-title { font-size: 2.2rem; } }
        .taa-story-body { margin-top: 1.4rem; font-size: 13px; line-height: 2.05; opacity: .72; }
        .taa-story-points { margin-top: 2rem; display: grid; gap: 1.1rem; }
        .taa-point { border-top: 1px solid #e2ded4; padding-top: 0.9rem; }
        .taa-point-t { font-size: 12.5px; font-weight: 400; }
        .taa-point-d { margin-top: 0.3rem; font-size: 11.5px; line-height: 1.7; opacity: .6; }

        /* Shipping ------------------------------------------------------------------------ */
        .taa-ship { border-top: 1px solid #e2ded4; border-bottom: 1px solid #e2ded4; background: #f0ede6; }
        .taa-ship-grid { display: grid; gap: 1.8rem; padding-top: 2.8rem; padding-bottom: 2.8rem; }
        @media (min-width: 768px) { .taa-ship-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2.8rem; } }
        .taa-ship-item { display: flex; gap: 0.9rem; align-items: flex-start; }
        .taa-ship-t { font-size: 12.5px; font-weight: 400; }
        .taa-ship-d { margin-top: 0.3rem; font-size: 11.5px; line-height: 1.75; opacity: .6; }

        /* Reviews --------------------------------------------------------------------------- */
        .taa-rev-grid { display: grid; gap: 2rem; margin-top: 2.2rem; }
        @media (min-width: 768px) { .taa-rev-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.5rem; } }
        .taa-rev { border-top: 1px solid #e2ded4; padding-top: 1.1rem; }
        .taa-rev-name { font-size: 12.5px; font-weight: 400; }
        .taa-rev-meta { margin-top: 0.15rem; font-size: 10.5px; opacity: .5; }
        .taa-rev-text { margin-top: 0.8rem; font-size: 12.5px; line-height: 2; opacity: .75; }

        /* Newsletter ------------------------------------------------------------------------- */
        .taa-news { background: #e9e5db; }
        .taa-news-in { padding-top: 3.6rem; padding-bottom: 3.6rem; max-width: 34rem; }
        .taa-news-form { margin-top: 1.5rem; display: flex; gap: 0.6rem; }
        .taa-news-input { flex: 1; border: none; border-bottom: 1px solid #b9b2a4; background: transparent; padding: 0.7rem 0.1rem; font-size: 12.5px; }
        .taa-news-btn { border-bottom: 1px solid #1f1e1b; padding: 0.7rem 0.2rem; font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; }

        /* Footer ------------------------------------------------------------------------------- */
        .taa-foot { background: #1f1e1b; color: #ddd8ce; }
        .taa-foot-grid { display: grid; gap: 2.8rem; padding-top: 4rem; padding-bottom: 2.6rem; }
        @media (min-width: 768px) { .taa-foot-grid { grid-template-columns: 1fr 1.2fr; gap: 5rem; } }
        .taa-foot-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 1.5rem; }
        .taa-foot-h { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: #a9705a; }
        .taa-foot-links { margin-top: 0.9rem; display: grid; gap: 0.6rem; }
        .taa-foot-links span { font-size: 12px; opacity: .72; }
        .taa-foot-pay { display: flex; flex-wrap: wrap; gap: 0.4rem 1rem; margin-top: 0.9rem; }
        .taa-pay { font-size: 10.5px; opacity: .6; }
        .taa-co { border-top: 1px solid rgba(221,216,206,.14); padding-top: 1.7rem; padding-bottom: 3.2rem; display: grid; gap: 0.45rem; }
        .taa-co-row { font-size: 10.5px; opacity: .55; line-height: 1.75; }
        .taa-co-row b { font-weight: 400; opacity: .85; }
        .taa-disclaim { margin-top: 1rem; font-size: 10.5px; line-height: 1.8; opacity: .4; }
        .taa-social { display: flex; gap: 1.1rem; margin-top: 1.3rem; }

        /* Bottom tab bar ------------------------------------------------------------------------ */
        .taa-tabs { position: fixed; left: 0; right: 0; bottom: 0; z-index: 45; display: grid; grid-template-columns: repeat(5, 1fr); background: #f7f5f0; border-top: 1px solid #e2ded4; }
        @media (min-width: 768px) { .taa-tabs { display: none; } }
        .taa-tab-btn { padding: 0.55rem 0 0.65rem; display: grid; justify-items: center; gap: 0.25rem; font-size: 9.5px; opacity: .6; position: relative; }
        .taa-tab-btn[data-on="true"] { opacity: 1; }

        /* Overlays -------------------------------------------------------------------------------- */
        .taa-scrim { position: fixed; inset: 0; z-index: 50; background: rgba(31,30,27,.45); }
        .taa-drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 55; width: 100%; max-width: 26rem; background: #f7f5f0; display: flex; flex-direction: column; }
        .taa-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 1.4rem; border-bottom: 1px solid #e2ded4; }
        .taa-drawer-title { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; }
        .taa-drawer-body { flex: 1; overflow-y: auto; padding: 1.4rem; }
        .taa-drawer-foot { border-top: 1px solid #e2ded4; padding: 1.2rem 1.4rem 1.5rem; }
        .taa-line { display: grid; grid-template-columns: 4.5rem 1fr; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #e7e3da; }
        .taa-line img { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #eae6dd; }
        .taa-line-name { font-size: 12.5px; font-weight: 400; line-height: 1.45; }
        .taa-line-var { margin-top: 0.2rem; font-size: 10.5px; opacity: .55; }
        .taa-qty { margin-top: 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; }
        .taa-qty-box { display: flex; align-items: center; border: 1px solid #ddd8cd; }
        .taa-qty-btn { padding: 0.3rem 0.5rem; }
        .taa-qty-n { min-width: 1.8rem; text-align: center; font-size: 12px; font-variant-numeric: tabular-nums; }
        .taa-sum { display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; padding: 0.28rem 0; }
        .taa-sum-total { font-size: 14px; font-weight: 400; }
        .taa-btn { width: 100%; background: #1f1e1b; color: #f7f5f0; padding: 1rem; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; transition: background-color .2s; }
        .taa-btn:hover { background: #a9705a; }
        .taa-btn-ghost { width: 100%; border: 1px solid #ddd8cd; padding: 0.9rem; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; margin-top: 0.6rem; opacity: .75; }
        .taa-field { display: grid; gap: 0.35rem; margin-top: 1rem; }
        .taa-field label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: .55; }
        .taa-field input { border: none; border-bottom: 1px solid #ddd8cd; background: transparent; padding: 0.5rem 0.1rem; font-size: 12.5px; }
        .taa-two { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
        .taa-pay-list { display: grid; gap: 0.1rem; margin-top: 0.8rem; }
        .taa-pay-opt { display: flex; align-items: center; gap: 0.7rem; border-bottom: 1px solid #e7e3da; padding: 0.75rem 0.1rem; font-size: 12.5px; }

        .taa-modal { position: fixed; inset: 0; z-index: 55; display: grid; place-items: center; padding: 1rem; }
        .taa-modal-card { width: 100%; max-width: 56rem; max-height: 88vh; overflow-y: auto; background: #f7f5f0; }
        .taa-quick { display: grid; }
        @media (min-width: 768px) { .taa-quick { grid-template-columns: 1fr 1fr; } }
        .taa-quick img { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #eae6dd; }
        .taa-quick-body { padding: 1.6rem; }
        @media (min-width: 768px) { .taa-quick-body { padding: 2.6rem; } }
        .taa-maker-box { margin-top: 1.2rem; border: 1px solid #e2ded4; padding: 0.9rem 1rem; }
        .taa-sizes { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.7rem; }
        .taa-size { min-width: 3.2rem; border: 1px solid #ddd8cd; padding: 0.55rem 0.7rem; font-size: 11.5px; background: transparent; }
        .taa-size[data-on="true"] { background: #1f1e1b; color: #f7f5f0; border-color: #1f1e1b; }
        .taa-size[disabled] { opacity: .35; text-decoration: line-through; }
        .taa-swatches { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 0.7rem; }
        .taa-swatch { display: flex; align-items: center; gap: 0.45rem; border: 1px solid #ddd8cd; padding: 0.35rem 0.65rem 0.35rem 0.4rem; font-size: 11.5px; }
        .taa-swatch[data-on="true"] { border-color: #1f1e1b; }
        .taa-dot { width: 0.85rem; height: 0.85rem; border: 1px solid rgba(31,30,27,.18); }
        .taa-spec { margin-top: 1.5rem; display: grid; gap: 0.7rem; }
        .taa-spec-row { display: grid; grid-template-columns: 4.5rem 1fr; gap: 0.7rem; font-size: 11.5px; line-height: 1.75; opacity: .72; border-top: 1px solid #e7e3da; padding-top: 0.7rem; }

        .taa-table { width: 100%; border-collapse: collapse; margin-top: 1.1rem; font-size: 12px; font-variant-numeric: tabular-nums; }
        .taa-table th, .taa-table td { border-bottom: 1px solid #e2ded4; padding: 0.6rem 0.4rem; text-align: left; }
        .taa-table th { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; opacity: .55; }

        .taa-toast { position: fixed; left: 50%; bottom: 5rem; transform: translateX(-50%); z-index: 60; background: #1f1e1b; color: #f7f5f0; padding: 0.75rem 1.2rem; font-size: 11.5px; display: flex; align-items: center; gap: 0.5rem; max-width: 90vw; }
        @media (min-width: 768px) { .taa-toast { bottom: 2rem; } }

        .taa-account-rows { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid #e2ded4; border-bottom: 1px solid #e2ded4; margin-top: 1.2rem; }
        .taa-account-cell { padding: 1rem 0.5rem; text-align: center; }
        .taa-account-n { font-size: 1.15rem; font-weight: 300; }
        .taa-account-l { margin-top: 0.2rem; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; opacity: .55; }
        .taa-order { display: grid; grid-template-columns: 3.5rem 1fr; gap: 0.9rem; padding: 0.9rem 0; border-bottom: 1px solid #e7e3da; }
        .taa-order img { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #eae6dd; }
        .taa-status { display: inline-block; font-size: 10px; letter-spacing: 0.1em; margin-top: 0.4rem; }
        .taa-menu-row { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 0; border-bottom: 1px solid #e7e3da; font-size: 12.5px; }

        @keyframes taa-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .taa-rise { animation: taa-rise .9s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes taa-in { from { transform: translateX(100%); } to { transform: none; } }
        .taa-drawer { animation: taa-in .32s cubic-bezier(.2,.7,.2,1); }
        @keyframes taa-pop { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .taa-pop { animation: taa-pop .26s cubic-bezier(.2,.7,.2,1); }
        @media (prefers-reduced-motion: reduce) {
          .taa-rise, .taa-drawer, .taa-pop { animation: none !important; }
          .taa-card-photo, .taa-mat { transition: none !important; }
        }
      `}</style>

      <DemoBanner forName={n} />

      <header
        ref={headRef}
        className={`taa-header ${scrolled ? "taa-header-solid" : "taa-header-float"}`}
      >
        <div className="taa-promo">{t.promo}</div>
        <div className="taa-wrap taa-bar">
          <a href="#top" className="taa-brand">
            <Logo className="h-6 w-6" light={!scrolled} />
            <span className="taa-brand-name">{biz.name}</span>
          </a>
          <div className="taa-search">
            <Search
              className="absolute left-0 h-4 w-4"
              style={{ top: "50%", transform: "translateY(-50%)", opacity: 0.55 }}
            />
            <div className="taa-search-box">{t.searchPlaceholder}</div>
          </div>
          <div className="taa-icons">
            <div className="taa-langs" role="group" aria-label="Language">
              {(["en", "ko"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i === 1 && <span className="taa-lang-div">/</span>}
                  <button
                    type="button"
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    style={{ opacity: lang === l ? 1 : 0.5 }}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setAccount(true)}
              aria-label={t.account}
              className="hidden md:inline-flex"
            >
              <User className="h-5 w-5" strokeWidth={1.3} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.cart}
              className="relative inline-flex items-center"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.3} />
              {count > 0 && <span className="taa-count taa-tab">{count}</span>}
            </button>
          </div>
        </div>
        <nav className="taa-nav">
          <div className="taa-wrap taa-scroll">
            <div className="taa-nav-row">
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => pickCategory(c.key)}
                  data-on={category === c.key}
                  className="taa-nav-item"
                >
                  {lang === "ko" ? c.ko : c.en}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <section
        id="top"
        className="taa-hero"
        style={headH ? { marginTop: `-${headH}px` } : undefined}
      >
        <div className="taa-hero-frame">
          {banners.map((b, i) => (
            <img
              key={b.img}
              src={`${IMG}/${b.img}.webp`}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className="taa-hero-img"
              style={{ opacity: i === slide ? 1 : 0 }}
            />
          ))}
          <div className="taa-hero-top" />
          <div className="taa-hero-bottom" />
          <div className="taa-hero-copy taa-wrap" data-align={banner.align}>
            <p className="taa-caps taa-rise" style={{ color: "rgba(255,255,255,.8)" }}>
              {banner.eyebrow}
            </p>
            <h1 className="taa-hero-title taa-rise">{banner.title[lang]}</h1>
            <p className="taa-hero-sub taa-rise">{banner.sub[lang]}</p>
            <button
              type="button"
              onClick={() => pickMaterial(banner.material)}
              className="taa-hero-cta taa-rise"
            >
              {t.heroCta} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="taa-hero-dots taa-tab">
            {String(slide + 1).padStart(2, "0")} — {String(banners.length).padStart(2, "0")}
          </div>
        </div>
      </section>

      {/* Shop by cloth — the material is the proposition, so it filters before the garment */}
      <section className="taa-wrap taa-section">
        {sectionHead(t.matTitle, t.matSub)}
        <div className="taa-mat-grid">
          {materials.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => pickMaterial(m.key)}
              data-on={material === m.key}
              className="taa-mat"
            >
              <p className="taa-mat-name">{t[m.label]}</p>
              <p className="taa-mat-note">{t[m.note]}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Most reordered */}
      <section className="taa-wrap taa-section" style={{ paddingTop: 0 }}>
        {sectionHead(t.bestTitle, t.bestSub, () => pickMaterial("all"))}
        <div className="taa-grid">
          {bestIds.map((id) => (
            <ProductCard key={id} p={byId.get(id)!} onPick={openQuick} lang={lang} t={t} />
          ))}
        </div>
      </section>

      {/* Traceability */}
      <section className="taa-trace">
        <div className="taa-wrap taa-section">
          {sectionHead(t.traceTitle, t.traceSub)}
          <div className="taa-trace-grid">
            {trace.map((s, i) => (
              <div key={s.t}>
                <p className="taa-trace-n">{String(i + 1).padStart(2, "0")}</p>
                <p className="taa-trace-t">{t[s.t]}</p>
                <p className="taa-trace-d">{t[s.d]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why handwoven */}
      <section className="taa-wrap taa-section">
        <div className="taa-story-grid">
          <div className="taa-story-imgs">
            <img src={`${IMG}/lookbook-a-sm.webp`} alt="" loading="lazy" />
            <img src={`${IMG}/lookbook-b-sm.webp`} alt="" loading="lazy" />
          </div>
          <div>
            <p className="taa-caps" style={{ color: "#a9705a" }}>
              {t.storyEyebrow}
            </p>
            <h2 className="taa-story-title">
              {t.storyTitle1}
              <br />
              {t.storyTitle2}
            </h2>
            <p className="taa-story-body">{t.storyBody}</p>
            <div className="taa-story-points">
              {[
                [t.st1t, t.st1d],
                [t.st2t, t.st2d],
                [t.st3t, t.st3d],
              ].map(([title, desc]) => (
                <div key={title} className="taa-point">
                  <p className="taa-point-t">{title}</p>
                  <p className="taa-point-d">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New from the loom */}
      <section className="taa-wrap taa-section" style={{ paddingTop: 0 }}>
        {sectionHead(t.newTitle, t.newSub, () => pickMaterial("all"))}
        <div className="taa-grid">
          {newIds.map((id) => (
            <ProductCard key={id} p={byId.get(id)!} onPick={openQuick} lang={lang} t={t} />
          ))}
        </div>
      </section>

      {/* Everything */}
      <section id="shop" className="taa-wrap taa-section" style={{ paddingTop: 0 }}>
        {sectionHead(t.allTitle, t.allSub)}
        <div className="taa-scroll" style={{ marginTop: "1.4rem" }}>
          <div style={{ display: "flex", gap: "1.4rem" }}>
            {(["all", ...materials.map((m) => m.key)] as (Material | "all")[]).map((key) => {
              const found = materials.find((m) => m.key === key);
              const label = found ? t[found.label] : t.matAll;
              const on = material === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMaterial(key)}
                  style={{
                    flexShrink: 0,
                    paddingBottom: "0.35rem",
                    borderBottom: `1px solid ${on ? "#1f1e1b" : "transparent"}`,
                    opacity: on ? 1 : 0.5,
                    fontSize: "11.5px",
                    letterSpacing: "0.06em",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        {visible.length === 0 ? (
          <p style={{ marginTop: "3rem", fontSize: "12.5px", opacity: 0.55, textAlign: "center" }}>
            {t.empty}
          </p>
        ) : (
          <div className="taa-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} p={p} onPick={openQuick} lang={lang} t={t} />
            ))}
          </div>
        )}
      </section>

      {/* Shipping */}
      <section className="taa-ship">
        <div className="taa-wrap" style={{ paddingTop: "2.8rem" }}>
          <p className="taa-caps" style={{ color: "#a9705a" }}>
            {t.shipTitle}
          </p>
        </div>
        <div className="taa-wrap taa-ship-grid" style={{ paddingTop: "1.4rem" }}>
          {[
            [Truck, t.ship1t, t.ship1d],
            [Check, t.ship2t, t.ship2d],
            [Leaf, t.ship3t, t.ship3d],
          ].map(([Icon, title, desc]) => {
            const Ico = Icon as typeof Truck;
            return (
              <div key={title as string} className="taa-ship-item">
                <Ico className="h-5 w-5 shrink-0" strokeWidth={1.2} style={{ color: "#a9705a" }} />
                <div>
                  <p className="taa-ship-t">{title as string}</p>
                  <p className="taa-ship-d">{desc as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section className="taa-wrap taa-section">
        {sectionHead(t.revTitle, t.revSub)}
        <div className="taa-rev-grid">
          {reviews.map((r) => {
            const p = byId.get(r.product)!;
            return (
              <div key={r.name} className="taa-rev">
                <p className="taa-rev-name">{r.name}</p>
                <p className="taa-rev-meta">
                  {lead(p, lang)} · {r.size} · {"★".repeat(r.rating)}
                </p>
                <p className="taa-rev-text">{r.text[lang]}</p>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setGuide(true)}
          style={{
            marginTop: "2rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            fontSize: "10.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.65,
          }}
        >
          <Ruler className="h-4 w-4" strokeWidth={1.3} />
          {t.sizeGuide}
        </button>
      </section>

      {/* Newsletter */}
      <section className="taa-news">
        <div className="taa-wrap">
          <div className="taa-news-in">
            <h2 className="taa-head-title">{t.newsTitle}</h2>
            <p className="taa-head-sub">{t.newsSub}</p>
            {subscribed ? (
              <p
                style={{
                  marginTop: "1.5rem",
                  fontSize: "12.5px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  color: "#a9705a",
                }}
              >
                <Check className="h-4 w-4" strokeWidth={1.6} />
                {t.newsDone}
              </p>
            ) : (
              <form className="taa-news-form" onSubmit={subscribe}>
                <input
                  type="email"
                  required
                  placeholder={t.newsPlaceholder}
                  className="taa-news-input"
                  aria-label={t.newsPlaceholder}
                />
                <button type="submit" className="taa-news-btn">
                  {t.newsCta}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer id="contact" className="taa-foot">
        <div className="taa-wrap">
          <div className="taa-foot-grid">
            <div>
              <div className="taa-brand">
                <Logo className="h-7 w-7" light />
                <span className="taa-brand-name">{biz.name}</span>
              </div>
              <p
                style={{
                  marginTop: "1.2rem",
                  fontSize: "12px",
                  lineHeight: 2,
                  opacity: 0.68,
                  maxWidth: "24rem",
                }}
              >
                {t.storyBody}
              </p>
              <div className="taa-social">
                <Instagram className="h-4 w-4" strokeWidth={1.3} />
                <TikTok className="h-4 w-4" />
                <Facebook className="h-4 w-4" strokeWidth={1.3} />
              </div>
              <p style={{ marginTop: "1.3rem", fontSize: "11px", opacity: 0.55 }}>
                {t.csHours}
                <br />
                {biz.phone}
              </p>
            </div>
            <div className="taa-foot-cols">
              <div>
                <p className="taa-foot-h">{t.footShop}</p>
                <div className="taa-foot-links">
                  {categories.slice(1).map((c) => (
                    <span key={c.key}>{lang === "ko" ? c.ko : c.en}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="taa-foot-h">{t.footHelp}</p>
                <div className="taa-foot-links">
                  <span>{t.footSize}</span>
                  <span>{t.footShip}</span>
                  <span>{t.footReturn}</span>
                  <span>{t.footFaq}</span>
                </div>
              </div>
              <div>
                <p className="taa-foot-h">{t.footAbout}</p>
                <div className="taa-foot-links">
                  <span>{t.footStory}</span>
                  <span>{t.footWeavers}</span>
                  <span>{t.footContact}</span>
                </div>
              </div>
              <div>
                <p className="taa-foot-h">{t.payment}</p>
                <div className="taa-foot-pay">
                  {payMethods.map((m) => (
                    <span key={m.key} className="taa-pay">
                      {lang === "ko" ? m.ko : m.en}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="taa-co">
            {company.map((c) => (
              <p key={c.label} className="taa-co-row">
                <b>{t[c.label]}</b> {c.value[lang]}
              </p>
            ))}
            <p className="taa-disclaim">{t.coDisclaimer}</p>
          </div>
        </div>
      </footer>

      <nav className="taa-tabs">
        <button
          type="button"
          className="taa-tab-btn"
          data-on={true}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Home className="h-5 w-5" strokeWidth={1.3} />
          {t.home}
        </button>
        <button type="button" className="taa-tab-btn" onClick={() => pickCategory("All")}>
          <LayoutGrid className="h-5 w-5" strokeWidth={1.3} />
          {t.shop}
        </button>
        <button type="button" className="taa-tab-btn" onClick={() => pickMaterial("all")}>
          <Leaf className="h-5 w-5" strokeWidth={1.3} />
          {t.materials}
        </button>
        <button type="button" className="taa-tab-btn" onClick={() => setAccount(true)}>
          <User className="h-5 w-5" strokeWidth={1.3} />
          {t.account}
        </button>
        <button type="button" className="taa-tab-btn" onClick={() => setOpen(true)}>
          <span style={{ position: "relative" }}>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.3} />
            {count > 0 && <span className="taa-count taa-tab">{count}</span>}
          </span>
          {t.cart}
        </button>
      </nav>

      {/* Quick view */}
      {quick && (
        <>
          <div className="taa-scrim" onClick={() => setQuick(null)} />
          <div className="taa-modal">
            <div className="taa-modal-card taa-pop">
              <div className="taa-quick">
                <img src={`${IMG}/${quick.img}.webp`} alt={lead(quick, lang)} />
                <div className="taa-quick-body">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <div>
                      <h2 style={{ fontSize: "1.3rem", fontWeight: 300 }}>{lead(quick, lang)}</h2>
                      <p className="taa-card-sub">{sub(quick, lang)}</p>
                    </div>
                    <button type="button" onClick={() => setQuick(null)} aria-label="Close">
                      <X className="h-5 w-5" strokeWidth={1.3} />
                    </button>
                  </div>
                  <p className="taa-tab" style={{ marginTop: "1rem", fontSize: "1rem" }}>
                    {quick.was && <span className="taa-was">{won(quick.was)}</span>}{" "}
                    {won(quick.price)}
                  </p>

                  <p
                    style={{
                      marginTop: "1.1rem",
                      fontSize: "12.5px",
                      lineHeight: 2,
                      opacity: 0.72,
                    }}
                  >
                    {quick.about[lang]}
                  </p>

                  <div className="taa-maker-box">
                    <p className="taa-caps" style={{ color: "#a9705a" }}>
                      {t.makerTitle}
                    </p>
                    <p style={{ marginTop: "0.5rem", fontSize: "12.5px" }}>{quick.maker[lang]}</p>
                    <p style={{ marginTop: "0.2rem", fontSize: "11px", opacity: 0.55 }}>
                      {quick.days} {t.makerDays}
                    </p>
                  </div>

                  <div style={{ marginTop: "1.4rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p className="taa-caps" style={{ opacity: 0.55 }}>
                        {t.selectSize}
                      </p>
                      <button
                        type="button"
                        onClick={() => setGuide(true)}
                        className="taa-caps"
                        style={{ opacity: 0.55 }}
                      >
                        {t.sizeGuide}
                      </button>
                    </div>
                    <div className="taa-sizes">
                      {quick.sizes.map((s) => {
                        const out = quick.soldOut?.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={out}
                            data-on={pickedSize === s}
                            className="taa-size"
                            onClick={() => {
                              setPickedSize(s);
                              setSizeError(false);
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    {sizeError && (
                      <p style={{ marginTop: "0.5rem", fontSize: "11px", color: "#a9705a" }}>
                        {t.sizeRequired}
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: "1.2rem" }}>
                    <p className="taa-caps" style={{ opacity: 0.55 }}>
                      {t.selectColour}
                    </p>
                    <div className="taa-swatches">
                      {quick.colours.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          data-on={pickedColour === c.name}
                          className="taa-swatch"
                          onClick={() => setPickedColour(c.name)}
                        >
                          <span className="taa-dot" style={{ background: c.hex }} />
                          {colourName(c)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="taa-spec">
                    <p className="taa-spec-row">
                      <b>{t.fabric}</b>
                      <span>{quick.fabric[lang]}</span>
                    </p>
                    <p className="taa-spec-row">
                      <b>{t.care}</b>
                      <span>{quick.care[lang]}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addToCart}
                    className="taa-btn"
                    style={{ marginTop: "1.5rem" }}
                  >
                    {t.addToCart}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Size guide */}
      {guide && (
        <>
          <div className="taa-scrim" onClick={() => setGuide(false)} />
          <div className="taa-modal">
            <div
              className="taa-modal-card taa-pop"
              style={{ maxWidth: "32rem", padding: "1.8rem" }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <h2 style={{ fontSize: "1.1rem", fontWeight: 300 }}>{t.sizeTitle}</h2>
                <button type="button" onClick={() => setGuide(false)} aria-label="Close">
                  <X className="h-5 w-5" strokeWidth={1.3} />
                </button>
              </div>
              <p style={{ marginTop: "0.7rem", fontSize: "12px", lineHeight: 1.9, opacity: 0.68 }}>
                {t.sizeNote}
              </p>
              <table className="taa-table">
                <thead>
                  <tr>
                    <th>{t.sizeCol1}</th>
                    <th>{t.sizeCol2}</th>
                    <th>{t.sizeCol3}</th>
                    <th>{t.sizeCol4}</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((r) => (
                    <tr key={r.size}>
                      <td>{r.size}</td>
                      <td>{r.chest}</td>
                      <td>{r.waist}</td>
                      <td>{r.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Account */}
      {account && (
        <>
          <div className="taa-scrim" onClick={() => setAccount(false)} />
          <aside className="taa-drawer">
            <div className="taa-drawer-head">
              <p className="taa-drawer-title">{t.accountTitle}</p>
              <button type="button" onClick={() => setAccount(false)} aria-label="Close">
                <X className="h-5 w-5" strokeWidth={1.3} />
              </button>
            </div>
            <div className="taa-drawer-body">
              <p style={{ fontSize: "10.5px", opacity: 0.5 }}>{t.accountDemo}</p>
              <p style={{ marginTop: "0.8rem", fontSize: "1.1rem", fontWeight: 300 }}>윤지우</p>
              <p style={{ fontSize: "11.5px", opacity: 0.55 }}>{t.member} · Indigo</p>
              <div className="taa-account-rows">
                <div className="taa-account-cell">
                  <p className="taa-account-n taa-tab">3</p>
                  <p className="taa-account-l">{t.orders}</p>
                </div>
                <div className="taa-account-cell">
                  <p className="taa-account-n taa-tab">1</p>
                  <p className="taa-account-l">{t.coupons}</p>
                </div>
                <div className="taa-account-cell">
                  <p className="taa-account-n taa-tab">6,140</p>
                  <p className="taa-account-l">{t.points}</p>
                </div>
              </div>

              <p className="taa-foot-h" style={{ color: "#a9705a", marginTop: "1.8rem" }}>
                {t.recentOrders}
              </p>
              {accountOrders.map((o) => {
                const p = byId.get(o.product)!;
                const label =
                  o.status === "prep"
                    ? t.statusPrep
                    : o.status === "ship"
                      ? t.statusShip
                      : t.statusDone;
                return (
                  <div key={o.no} className="taa-order">
                    <img src={`${IMG}/${p.img}-sm.webp`} alt="" loading="lazy" />
                    <div>
                      <p className="taa-line-name">{lead(p, lang)}</p>
                      <p className="taa-line-var">{o.variant}</p>
                      <p className="taa-line-var taa-tab">{o.no}</p>
                      <span className="taa-status" style={{ color: "#a9705a" }}>
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: "1.6rem" }}>
                {[t.menuProfile, t.menuWish, t.menuRepair, t.menuHelp].map((m) => (
                  <div key={m} className="taa-menu-row">
                    {m}
                    <ChevronRight className="h-4 w-4" strokeWidth={1.3} style={{ opacity: 0.4 }} />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAccount(false)}
                className="taa-btn-ghost"
                style={{ marginTop: "1.6rem" }}
              >
                {t.signOut}
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Cart / checkout */}
      {open && (
        <>
          <div className="taa-scrim" onClick={() => setOpen(false)} />
          <aside className="taa-drawer">
            <div className="taa-drawer-head">
              <p className="taa-drawer-title">
                {step === "checkout" ? t.delivery : step === "done" ? t.orderDone : t.cartTitle}
              </p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" strokeWidth={1.3} />
              </button>
            </div>

            {step === "cart" && (
              <>
                <div className="taa-drawer-body">
                  {lines.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: "4.5rem" }}>
                      <ShoppingBag
                        className="h-8 w-8"
                        strokeWidth={1}
                        style={{ margin: "0 auto", opacity: 0.3 }}
                      />
                      <p style={{ marginTop: "1rem", fontSize: "13px" }}>{t.cartEmpty}</p>
                      <p style={{ marginTop: "0.35rem", fontSize: "11.5px", opacity: 0.55 }}>
                        {t.cartEmptySub}
                      </p>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="taa-btn-ghost"
                        style={{ marginTop: "1.5rem" }}
                      >
                        {t.keepShopping}
                      </button>
                    </div>
                  ) : (
                    <>
                      {toFree > 0 && (
                        <p
                          style={{
                            fontSize: "11.5px",
                            color: "#a9705a",
                            paddingBottom: "0.7rem",
                          }}
                        >
                          {won(toFree)} {t.toFree}
                        </p>
                      )}
                      {lines.map((l) => (
                        <div key={l.key} className="taa-line">
                          <img src={`${IMG}/${l.product.img}-sm.webp`} alt="" loading="lazy" />
                          <div>
                            <p className="taa-line-name">{lead(l.product, lang)}</p>
                            <p className="taa-line-var">
                              {l.size} · {l.colour}
                            </p>
                            <div className="taa-qty">
                              <span className="taa-qty-box">
                                <button
                                  type="button"
                                  className="taa-qty-btn"
                                  onClick={() => change(l.key, -1)}
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3 w-3" strokeWidth={1.6} />
                                </button>
                                <span className="taa-qty-n">{l.qty}</span>
                                <button
                                  type="button"
                                  className="taa-qty-btn"
                                  onClick={() => change(l.key, 1)}
                                  aria-label="Increase"
                                >
                                  <Plus className="h-3 w-3" strokeWidth={1.6} />
                                </button>
                              </span>
                              <span className="taa-tab" style={{ fontSize: "12.5px" }}>
                                {won(l.product.price * l.qty)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                {lines.length > 0 && (
                  <div className="taa-drawer-foot">
                    <p className="taa-sum">
                      <span style={{ opacity: 0.65 }}>{t.subtotal}</span>
                      <span className="taa-tab">{won(subtotal)}</span>
                    </p>
                    {saved > 0 && (
                      <p className="taa-sum" style={{ color: "#a9705a" }}>
                        <span>{t.youSave}</span>
                        <span className="taa-tab">−{won(saved)}</span>
                      </p>
                    )}
                    <p className="taa-sum">
                      <span style={{ opacity: 0.65 }}>{t.shipping}</span>
                      <span className="taa-tab">{shipping === 0 ? t.free : won(shipping)}</span>
                    </p>
                    <p
                      className="taa-sum taa-sum-total"
                      style={{
                        borderTop: "1px solid #e2ded4",
                        marginTop: "0.6rem",
                        paddingTop: "0.8rem",
                      }}
                    >
                      <span>{t.total}</span>
                      <span className="taa-tab">{won(subtotal + shipping)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("checkout")}
                      className="taa-btn"
                      style={{ marginTop: "1rem" }}
                    >
                      {t.checkout}
                    </button>
                  </div>
                )}
              </>
            )}

            {step === "checkout" && (
              <form onSubmit={placeOrder} style={{ display: "contents" }}>
                <div className="taa-drawer-body">
                  <div className="taa-field">
                    <label htmlFor="taa-name">{t.fullName}</label>
                    <input id="taa-name" required />
                  </div>
                  <div className="taa-field">
                    <label htmlFor="taa-phone">{t.phone}</label>
                    <input id="taa-phone" required placeholder={biz.phone} inputMode="tel" />
                  </div>
                  <div className="taa-field">
                    <label htmlFor="taa-addr">{t.addr}</label>
                    <input id="taa-addr" required placeholder={t.addrPlaceholder} />
                  </div>
                  <div className="taa-two">
                    <div className="taa-field">
                      <label htmlFor="taa-city">{t.city}</label>
                      <input id="taa-city" required defaultValue={biz.area} />
                    </div>
                    <div className="taa-field">
                      <label htmlFor="taa-post">{t.postcode}</label>
                      <input id="taa-post" required inputMode="numeric" />
                    </div>
                  </div>

                  <p className="taa-foot-h" style={{ color: "#a9705a", marginTop: "1.8rem" }}>
                    {t.payment}
                  </p>
                  <div className="taa-pay-list">
                    {payMethods.map((m, i) => (
                      <label key={m.key} className="taa-pay-opt">
                        <input type="radio" name="taa-pay" defaultChecked={i === 0} />
                        {lang === "ko" ? m.ko : m.en}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="taa-drawer-foot">
                  <p className="taa-sum taa-sum-total">
                    <span>{t.total}</span>
                    <span className="taa-tab">{won(subtotal + shipping)}</span>
                  </p>
                  <button type="submit" className="taa-btn" style={{ marginTop: "0.9rem" }}>
                    {t.placeOrder}
                  </button>
                  <button type="button" onClick={() => setStep("cart")} className="taa-btn-ghost">
                    {t.backToCart}
                  </button>
                </div>
              </form>
            )}

            {step === "done" && (
              <div
                className="taa-drawer-body"
                style={{ textAlign: "center", paddingTop: "4.5rem" }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "3rem",
                    height: "3rem",
                    border: "1px solid #1f1e1b",
                    margin: "0 auto",
                  }}
                >
                  <Check className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <p style={{ marginTop: "1.1rem", fontSize: "1.05rem", fontWeight: 300 }}>
                  {t.orderDone}
                </p>
                <p
                  style={{ marginTop: "0.6rem", fontSize: "12px", lineHeight: 1.9, opacity: 0.65 }}
                >
                  {t.orderDoneSub}
                </p>
                <p
                  className="taa-tab"
                  style={{ marginTop: "1.1rem", fontSize: "11.5px", opacity: 0.5 }}
                >
                  {t.orderNo} TA-20261023-0001
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setStep("cart");
                  }}
                  className="taa-btn"
                  style={{ marginTop: "1.6rem" }}
                >
                  {t.continueShopping}
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {toast && (
        <div className="taa-toast taa-pop">
          <Check className="h-4 w-4 shrink-0" strokeWidth={1.6} />
          <span>
            {t.added} — {toast}
          </span>
        </div>
      )}
    </div>
  );
}
