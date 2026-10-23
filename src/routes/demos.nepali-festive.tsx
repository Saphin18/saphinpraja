import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Facebook,
  Home,
  Instagram,
  LayoutGrid,
  Minus,
  Plus,
  Ruler,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
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

export const Route = createFileRoute("/demos/nepali-festive")({
  validateSearch: validateDemoSearch,
  head: ({ match }) => {
    const base = demoHead(
      "/demos/nepali-festive",
      "RANGA — Nepali Festive Wear Store Demo",
      "Sample online store by Saphin Praja selling Nepali festive clothing into Korea: kurtha suruwal, saree, lehenga and daura suruwal, with an English/Korean toggle, occasion filters and KakaoPay / Naver Pay / Toss checkout.",
      match.search.n,
    );
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,600;1,6..96,500&family=Karla:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap",
        },
        { rel: "preload", as: "image", href: "/demos/nepali-festive/banner-dashain.webp" },
      ],
    };
  },
  component: Festive,
});

const IMG = "/demos/nepali-festive";

// English is the default here: the shop sells Nepali clothing into Korea, and the client
// reviews the demo in English. The KO toggle flips every visible string on the page.
type Lang = "en" | "ko";
type Size = "XS" | "S" | "M" | "L" | "XL" | "FREE";
type Colour = { name: string; ko: string; hex: string };
type Bi = { en: string; ko: string };
type Occasion = "dashain" | "tihar" | "teej" | "wedding" | "everyday";

type Product = {
  id: number;
  name: string;
  korean: string;
  // Romanised Nepali name, shown as a small third line. The whole point of the shop is
  // that the garment has a real name, so it is never hidden behind a translation.
  nepali: string;
  category: string;
  occasion: Occasion[];
  price: number;
  was?: number;
  img: string;
  tag?: "NEW" | "BEST";
  fabric: Bi;
  care: Bi;
  // One plain sentence telling a Korean shopper what the garment actually is.
  about: Bi;
  rating: number;
  reviews: number;
  sizes: Size[];
  colours: Colour[];
  soldOut?: Size[];
};

const T: Record<Lang, Record<string, string>> = {
  en: {
    promo: "Ships from Kathmandu to Korea in 5–8 days · Duties included · Free over ₩150,000",
    heroEyebrow: "Handmade in Nepal",
    heroT1: "Nepali clothes,",
    heroEm: "cut by the people",
    heroT2: "who sell them.",
    heroSub:
      "Fourteen tailors in Patan, runs of forty or fewer, and a flight to Seoul. Nothing here is bought wholesale and relabelled.",
    heroProof: "4.9 from 840+ customers in Korea",
    heroShop: "Shop everything",
    heroStory: "Meet the tailors",
    heroFeatured: "Featured",
    searchPlaceholder: "Search kurtha, saree, daura suruwal…",
    cart: "Cart",
    account: "Account",
    shop: "Shop",
    home: "Home",
    occasions: "Occasions",

    occAll: "All occasions",
    occDashain: "Dashain",
    occTihar: "Tihar",
    occTeej: "Teej",
    occWedding: "Wedding",
    occEveryday: "Everyday",
    occTitle: "Shop by occasion",
    occSub:
      "Nepali festivals have their own dress. Pick the day, we will show you what people wear.",
    occDashainNote: "Ten days, new clothes for everyone. Ordered in September.",
    occTiharNote: "Lights, colour and family. Reds, golds and children's sets.",
    occTeejNote: "Red from head to toe. Sarees and heavy kurtha sets.",
    occWeddingNote: "Lehenga, sherwani and the full gunyu cholo.",
    occEverydayNote: "Light cotton kurta, dhaka jackets, pashmina.",

    bestTitle: "Most ordered this month",
    bestSub: "What our Korean customers bought most in the last thirty days",
    newTitle: "Just arrived",
    newSub: "New pieces from the Kathmandu workshop",
    allTitle: "All clothing",
    allSub: "Every piece is made in Nepal and shipped direct",
    viewAll: "View all",
    empty: "Nothing in this combination yet. Try another occasion.",

    storyEyebrow: "OUR WORKSHOP",
    storyTitle1: "Made in Kathmandu,",
    storyTitle2: "worn in Seoul",
    storyBody:
      "RANGA began in 2017 as a single tailoring room in Patan. We work with fourteen tailors and two handloom families, and we make most pieces in runs of forty or fewer. Nothing here is bought from a wholesale market and relabelled — if it is on this page, we cut it.",
    st1t: "Our own tailors",
    st1d: "Fourteen people, paid monthly, not per piece.",
    st2t: "Handwoven dhaka",
    st2d: "Woven in Terhathum on wooden looms, not printed.",
    st3t: "Small runs",
    st3d: "Forty pieces or fewer, so the fabric stays good.",

    glossTitle: "What am I actually buying?",
    glossSub: "Nepali clothing has its own names. Here is what they mean, plainly.",
    gloss1t: "Kurtha Suruwal",
    gloss1d:
      "A long tunic (kurtha) worn over loose trousers (suruwal), with a long scarf called a dupatta. The everyday formal dress for women in Nepal — comfortable, modest, and fine for both an office and a festival.",
    gloss2t: "Daura Suruwal",
    gloss2d:
      "The national dress for Nepali men: a closed-neck shirt tied with eight strings, narrow trousers, and usually a dhaka topi cap. Worn at weddings, Dashain and formal occasions.",
    gloss3t: "Dhaka",
    gloss3d:
      "A handwoven cotton cloth with geometric patterns, made on wooden looms in eastern Nepal. The pattern is woven in, not printed on, so it looks the same on both sides.",
    gloss4t: "Gunyu Cholo",
    gloss4d:
      "A wrapped skirt (gunyu) with a fitted blouse (cholo) and a sash. Traditionally given to a girl at her coming of age, now worn at weddings and Teej.",

    shipTitle: "Getting it to Korea",
    ship1t: "5–8 days to your door",
    ship1d: "Sent by air from Kathmandu, tracked the whole way.",
    ship2t: "Duties already paid",
    ship2d: "The price you see is the price. No customs bill on arrival.",
    ship3t: "Exchange within 14 days",
    ship3d: "Wrong size? Send it back and we will cut the next one.",

    revTitle: "Customer reviews",
    revSub: "Verified purchases, Korea",

    sizeGuide: "Size guide",
    sizeTitle: "Size guide",
    sizeNote:
      "Nepali tailoring runs slightly smaller than Korean sizing. If you are between two sizes, take the larger one. Measurements in centimetres.",
    sizeCol1: "Size",
    sizeCol2: "Bust",
    sizeCol3: "Waist",
    sizeCol4: "Length",

    selectSize: "Select a size",
    selectColour: "Colour",
    sizeRequired: "Please choose a size first",
    soldOut: "Sold out",
    addToCart: "Add to cart",
    added: "Added to cart",
    fabric: "Fabric",
    care: "Care",
    aboutThis: "About this piece",

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
    menuWish: "Wishlist",
    menuAsk: "Questions and answers",
    menuHelp: "Help centre",
    signOut: "Sign out",

    newsTitle: "Before the next festival",
    newsSub: "We email once a month, before Dashain, Tihar and Teej. Nothing else.",
    newsPlaceholder: "Email address",
    newsCta: "Sign up",
    newsDone: "Thank you — you are on the list.",

    footShop: "Shop",
    footHelp: "Customer service",
    footAbout: "About",
    footSize: "Size guide",
    footShip: "Shipping and customs",
    footReturn: "Returns and exchanges",
    footFaq: "FAQ",
    footStory: "Our workshop",
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
      "This is a sample website built as a portfolio piece. The business details above are placeholders, the products and reviews are invented, and no order can be placed.",
  },
  ko: {
    promo: "카트만두에서 한국까지 5~8일 · 관세 포함 · 15만원 이상 무료배송",
    heroEyebrow: "네팔에서 손으로 짓습니다",
    heroT1: "파는 사람이",
    heroEm: "직접 짓는",
    heroT2: "네팔 옷.",
    heroSub:
      "파탄의 재단사 14명, 40벌 이하의 소량 생산, 그리고 서울행 비행기. 도매로 사와 라벨만 바꾼 제품은 없습니다.",
    heroProof: "한국 고객 840명 이상, 평점 4.9",
    heroShop: "전체 상품 보기",
    heroStory: "재단사 소개",
    heroFeatured: "추천",
    searchPlaceholder: "쿠르타, 사리, 다우라 수루왈 검색",
    cart: "장바구니",
    account: "마이페이지",
    shop: "쇼핑",
    home: "홈",
    occasions: "행사별",

    occAll: "전체",
    occDashain: "다샤인",
    occTihar: "티하르",
    occTeej: "티즈",
    occWedding: "결혼식",
    occEveryday: "데일리",
    occTitle: "행사별로 고르기",
    occSub: "네팔 축제에는 각각의 복장이 있습니다. 날을 고르시면 그에 맞는 옷을 보여드립니다.",
    occDashainNote: "열흘간 이어지는 최대 명절. 9월에 주문하세요.",
    occTiharNote: "빛과 색의 축제. 레드와 골드, 아동복 세트.",
    occTeejNote: "머리부터 발끝까지 붉은색. 사리와 쿠르타 세트.",
    occWeddingNote: "레헹가, 셰르와니, 구뉴 촐로 풀세트.",
    occEverydayNote: "가벼운 면 쿠르타, 다카 자켓, 파슈미나.",

    bestTitle: "이번 달 인기 상품",
    bestSub: "최근 30일간 한국 고객이 가장 많이 구매한 제품",
    newTitle: "신상품",
    newSub: "카트만두 공방에서 새로 들어온 제품",
    allTitle: "전체 상품",
    allSub: "모든 제품은 네팔에서 제작되어 직배송됩니다",
    viewAll: "전체 보기",
    empty: "해당 조건의 상품이 아직 없습니다. 다른 행사를 선택해 보세요.",

    storyEyebrow: "우리 공방",
    storyTitle1: "카트만두에서 만들고",
    storyTitle2: "서울에서 입습니다",
    storyBody:
      "RANGA는 2017년 파탄의 작은 재봉실에서 시작했습니다. 재단사 14명, 수직기 직조 가정 2곳과 함께 일하며 대부분의 제품을 40벌 이하로 만듭니다. 도매시장에서 사와 라벨만 바꾼 제품은 없습니다. 이 페이지에 있는 옷은 전부 저희가 직접 재단합니다.",
    st1t: "자체 재단사",
    st1d: "14명, 개수가 아닌 월급제로 일합니다.",
    st2t: "수직 다카",
    st2d: "테르하툼의 나무 베틀에서 짠 원단. 프린트가 아닙니다.",
    st3t: "소량 생산",
    st3d: "40벌 이하로 만들어 원단의 질을 지킵니다.",

    glossTitle: "어떤 옷인가요?",
    glossSub: "네팔 의상에는 고유한 이름이 있습니다. 쉽게 설명해 드립니다.",
    gloss1t: "쿠르타 수루왈",
    gloss1d:
      "긴 상의(쿠르타)에 넉넉한 바지(수루왈)를 입고 두파타라는 긴 스카프를 두르는 옷입니다. 네팔 여성의 일상적인 정장으로, 편안하고 단정해 사무실에도 축제에도 어울립니다.",
    gloss2t: "다우라 수루왈",
    gloss2d:
      "네팔 남성의 전통 의상입니다. 여덟 개의 끈으로 여미는 상의와 좁은 바지, 그리고 보통 다카 토피 모자를 함께 씁니다. 결혼식, 다샤인, 공식 행사에 입습니다.",
    gloss3t: "다카",
    gloss3d:
      "네팔 동부의 나무 베틀에서 짜는 기하학 무늬의 면직물입니다. 무늬를 인쇄한 것이 아니라 짜 넣기 때문에 앞뒤가 똑같이 보입니다.",
    gloss4t: "구뉴 촐로",
    gloss4d:
      "감아 입는 치마(구뉴)에 몸에 맞는 블라우스(촐로)와 허리끈을 두르는 옷입니다. 전통적으로 성년을 맞은 소녀에게 주던 옷으로, 지금은 결혼식과 티즈에 입습니다.",

    shipTitle: "한국까지 배송",
    ship1t: "문 앞까지 5~8일",
    ship1d: "카트만두에서 항공 발송, 전 구간 배송조회 가능합니다.",
    ship2t: "관세 포함 가격",
    ship2d: "보시는 가격이 최종 가격입니다. 수령 시 추가 비용이 없습니다.",
    ship3t: "14일 이내 교환",
    ship3d: "사이즈가 맞지 않으면 보내주세요. 다시 지어 드립니다.",

    revTitle: "구매 후기",
    revSub: "한국 구매 확인 후기",

    sizeGuide: "사이즈 가이드",
    sizeTitle: "사이즈 가이드",
    sizeNote:
      "네팔 의류는 한국 사이즈보다 약간 작게 나옵니다. 두 사이즈 사이라면 큰 쪽을 권해 드립니다. 단위는 센티미터입니다.",
    sizeCol1: "사이즈",
    sizeCol2: "가슴둘레",
    sizeCol3: "허리둘레",
    sizeCol4: "총장",

    selectSize: "사이즈 선택",
    selectColour: "색상",
    sizeRequired: "사이즈를 먼저 선택해 주세요",
    soldOut: "품절",
    addToCart: "장바구니 담기",
    added: "장바구니에 담았습니다",
    fabric: "소재",
    care: "세탁 방법",
    aboutThis: "제품 설명",

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
    menuWish: "위시리스트",
    menuAsk: "상품 문의",
    menuHelp: "고객센터",
    signOut: "로그아웃",

    newsTitle: "다음 축제 전에 알려드립니다",
    newsSub:
      "다샤인, 티하르, 티즈 전에 한 달에 한 번만 메일을 보냅니다. 그 외에는 보내지 않습니다.",
    newsPlaceholder: "이메일 주소",
    newsCta: "신청하기",
    newsDone: "감사합니다. 신청이 완료되었습니다.",

    footShop: "쇼핑",
    footHelp: "고객 지원",
    footAbout: "브랜드",
    footSize: "사이즈 가이드",
    footShip: "배송 및 관세",
    footReturn: "교환 및 반품",
    footFaq: "자주 묻는 질문",
    footStory: "우리 공방",
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
      "본 사이트는 포트폴리오용 샘플입니다. 위 사업자 정보는 임의의 표기이며 상품과 후기는 가상입니다. 실제 주문은 되지 않습니다.",
  },
};

const SIZES: Size[] = ["XS", "S", "M", "L", "XL"];
const FREE_SIZE: Size[] = ["FREE"];

const products: Product[] = [
  {
    id: 1,
    name: "Silk Kurtha Suruwal Set",
    korean: "실크 쿠르타 수루왈 세트",
    nepali: "Kurtha Suruwal",
    category: "Women",
    occasion: ["dashain", "tihar", "everyday"],
    price: 129000,
    img: "silk-kurtha",
    tag: "BEST",
    fabric: { en: "Banarasi silk blend, cotton lining", ko: "바나라시 실크 혼방, 면 안감" },
    care: { en: "Dry clean only", ko: "드라이클리닝" },
    about: {
      en: "A long tunic over loose trousers with a matching dupatta scarf. Three pieces, one set — the most worn formal dress in Nepal.",
      ko: "긴 상의와 넉넉한 바지에 같은 소재의 두파타 스카프까지 3피스 구성입니다. 네팔에서 가장 많이 입는 정장입니다.",
    },
    rating: 4.9,
    reviews: 212,
    sizes: SIZES,
    colours: [
      { name: "Deep Red", ko: "딥 레드", hex: "#8e1b2e" },
      { name: "Emerald", ko: "에메랄드", hex: "#1f5f4a" },
      { name: "Marigold", ko: "메리골드", hex: "#d79826" },
    ],
    soldOut: ["XS"],
  },
  {
    id: 2,
    name: "Bridal Lehenga, Crimson",
    korean: "브라이덜 레헹가 크림슨",
    nepali: "Lehenga",
    category: "Women",
    occasion: ["wedding"],
    price: 389000,
    img: "bridal-lehenga",
    fabric: { en: "Raw silk, hand zari embroidery", ko: "로우 실크, 수작업 자리 자수" },
    care: { en: "Dry clean only, store flat", ko: "드라이클리닝, 눕혀서 보관" },
    about: {
      en: "A full floor-length skirt with a fitted blouse and a long veil. Six weeks of hand embroidery by two people.",
      ko: "바닥까지 내려오는 풀 스커트에 블라우스와 긴 베일이 함께 구성됩니다. 두 명이 6주간 손으로 수를 놓습니다.",
    },
    rating: 5.0,
    reviews: 34,
    sizes: SIZES,
    colours: [
      { name: "Crimson", ko: "크림슨", hex: "#9c1127" },
      { name: "Wine", ko: "와인", hex: "#5e1020" },
    ],
  },
  {
    id: 3,
    name: "Dhaka Border Saree",
    korean: "다카 보더 사리",
    nepali: "Dhaka Sari",
    category: "Women",
    occasion: ["teej", "wedding", "dashain"],
    price: 169000,
    img: "dhaka-saree",
    tag: "BEST",
    fabric: { en: "Cotton silk, handwoven dhaka border", ko: "면 실크, 수직 다카 보더" },
    care: { en: "Gentle hand wash, cold", ko: "찬물 손세탁" },
    about: {
      en: "Six metres of cloth, wrapped and pleated, with a handwoven dhaka band along the edge. Blouse included and cut to your size.",
      ko: "6미터 원단을 감아 주름 잡아 입으며, 가장자리에 수직 다카 띠를 둘렀습니다. 블라우스가 포함되며 사이즈에 맞춰 재단됩니다.",
    },
    rating: 4.8,
    reviews: 118,
    sizes: SIZES,
    colours: [
      { name: "Red", ko: "레드", hex: "#a51c30" },
      { name: "Indigo", ko: "인디고", hex: "#2b3a67" },
    ],
  },
  {
    id: 4,
    name: "Gunyu Cholo Set",
    korean: "구뉴 촐로 세트",
    nepali: "Gunyu Cholo",
    category: "Women",
    occasion: ["wedding", "teej"],
    price: 149000,
    img: "gunyu-cholo",
    fabric: { en: "Handwoven cotton, silk sash", ko: "수직 면직물, 실크 허리끈" },
    care: { en: "Hand wash, line dry in shade", ko: "손세탁, 그늘에서 건조" },
    about: {
      en: "A wrapped skirt with a fitted blouse and a long sash tied at the waist. Traditionally a coming-of-age gift.",
      ko: "감아 입는 치마에 몸에 맞는 블라우스, 허리에 두르는 긴 끈으로 구성됩니다. 전통적으로 성년 선물로 주던 옷입니다.",
    },
    rating: 4.9,
    reviews: 41,
    sizes: SIZES,
    colours: [
      { name: "Red & Gold", ko: "레드 골드", hex: "#8e1b2e" },
      { name: "Saffron", ko: "사프란", hex: "#d58b16" },
    ],
  },
  {
    id: 5,
    name: "Gold Thread Anarkali",
    korean: "골드 스레드 아나르칼리",
    nepali: "Anarkali",
    category: "Women",
    occasion: ["wedding", "tihar"],
    price: 189000,
    was: 219000,
    img: "anarkali",
    fabric: { en: "Georgette, gold thread work", ko: "조젯, 금사 자수" },
    care: { en: "Dry clean only", ko: "드라이클리닝" },
    about: {
      en: "A tunic cut long and full so it flares from the chest down. Worn with narrow trousers and a dupatta.",
      ko: "가슴 아래부터 넓게 퍼지도록 길게 재단한 상의입니다. 좁은 바지와 두파타를 함께 입습니다.",
    },
    rating: 4.7,
    reviews: 76,
    sizes: SIZES,
    colours: [
      { name: "Midnight", ko: "미드나잇", hex: "#20223f" },
      { name: "Rose", ko: "로즈", hex: "#a8445c" },
    ],
  },
  {
    id: 6,
    name: "Velvet Embroidered Blouse",
    korean: "벨벳 자수 블라우스",
    nepali: "Cholo",
    category: "Women",
    occasion: ["everyday", "tihar"],
    price: 69000,
    img: "velvet-blouse",
    tag: "NEW",
    fabric: { en: "Cotton velvet, cotton lining", ko: "면 벨벳, 면 안감" },
    care: { en: "Dry clean recommended", ko: "드라이클리닝 권장" },
    about: {
      en: "A short fitted blouse to wear under a saree, or on its own with jeans. Cut close through the shoulder.",
      ko: "사리 안에 입거나 청바지와 단독으로 입는 짧은 블라우스입니다. 어깨에 꼭 맞게 재단했습니다.",
    },
    rating: 4.6,
    reviews: 58,
    sizes: SIZES,
    colours: [
      { name: "Bottle Green", ko: "보틀 그린", hex: "#1d4435" },
      { name: "Plum", ko: "플럼", hex: "#5a2240" },
    ],
  },
  {
    id: 7,
    name: "Daura Suruwal, Ivory",
    korean: "다우라 수루왈 아이보리",
    nepali: "Daura Suruwal",
    category: "Men",
    occasion: ["dashain", "wedding"],
    price: 159000,
    img: "daura-suruwal",
    tag: "BEST",
    fabric: { en: "Khadi cotton", ko: "카디 면" },
    care: { en: "Machine wash cold, iron warm", ko: "찬물 세탁, 중온 다림질" },
    about: {
      en: "Nepal's national dress for men: a closed-neck shirt tied with eight strings, worn with narrow trousers.",
      ko: "네팔 남성의 전통 의상입니다. 여덟 개의 끈으로 여미는 상의에 좁은 바지를 함께 입습니다.",
    },
    rating: 4.9,
    reviews: 143,
    sizes: SIZES,
    colours: [
      { name: "Ivory", ko: "아이보리", hex: "#efe6d4" },
      { name: "Slate", ko: "슬레이트", hex: "#4a5159" },
    ],
  },
  {
    id: 8,
    name: "Wedding Sherwani, Maroon",
    korean: "웨딩 셰르와니 마룬",
    nepali: "Sherwani",
    category: "Men",
    occasion: ["wedding"],
    price: 329000,
    img: "sherwani",
    fabric: { en: "Brocade silk, satin lining", ko: "브로케이드 실크, 새틴 안감" },
    care: { en: "Dry clean only", ko: "드라이클리닝" },
    about: {
      en: "A long buttoned coat worn over trousers for a wedding. Cut with a standing collar and a fitted waist.",
      ko: "결혼식에 바지 위에 입는 긴 코트입니다. 스탠드 칼라에 허리를 잡아 재단했습니다.",
    },
    rating: 4.8,
    reviews: 29,
    sizes: SIZES,
    colours: [
      { name: "Maroon", ko: "마룬", hex: "#6d1526" },
      { name: "Charcoal", ko: "차콜", hex: "#33363b" },
    ],
  },
  {
    id: 9,
    name: "Dhaka Nehru Jacket",
    korean: "다카 네루 자켓",
    nepali: "Dhaka Coat",
    category: "Men",
    occasion: ["everyday", "dashain"],
    price: 119000,
    img: "nehru-jacket",
    tag: "NEW",
    fabric: { en: "Handwoven dhaka cotton", ko: "수직 다카 면직물" },
    care: { en: "Hand wash cold, dry flat", ko: "찬물 손세탁, 눕혀서 건조" },
    about: {
      en: "A short collarless waistcoat in handwoven dhaka. Works over a kurta, and just as well over a white shirt.",
      ko: "수직 다카 원단으로 만든 칼라 없는 조끼입니다. 쿠르타 위에도, 흰 셔츠 위에도 잘 어울립니다.",
    },
    rating: 4.7,
    reviews: 87,
    sizes: SIZES,
    colours: [
      { name: "Red Weave", ko: "레드 위브", hex: "#8e1b2e" },
      { name: "Black Weave", ko: "블랙 위브", hex: "#2a2a2c" },
    ],
  },
  {
    id: 10,
    name: "Dhaka Topi",
    korean: "다카 토피",
    nepali: "Dhaka Topi",
    category: "Accessories",
    occasion: ["dashain", "wedding", "everyday"],
    price: 29000,
    img: "dhaka-topi",
    fabric: { en: "Handwoven dhaka cotton", ko: "수직 다카 면직물" },
    care: { en: "Spot clean only", ko: "부분 세탁만" },
    about: {
      en: "The Nepali cap, worn with daura suruwal and on national holidays. Each one is cut from a different part of the weave, so no two match exactly.",
      ko: "다우라 수루왈과 함께, 또 국경일에 쓰는 네팔 전통 모자입니다. 원단의 다른 부분에서 재단하므로 완전히 같은 것은 없습니다.",
    },
    rating: 4.9,
    reviews: 164,
    sizes: FREE_SIZE,
    colours: [
      { name: "Black & Red", ko: "블랙 레드", hex: "#2a2a2c" },
      { name: "Cream & Blue", ko: "크림 블루", hex: "#e8dfc9" },
    ],
  },
  {
    id: 11,
    name: "Handwoven Pashmina Shawl",
    korean: "수직 파슈미나 숄",
    nepali: "Pashmina",
    category: "Accessories",
    occasion: ["everyday", "wedding", "teej"],
    price: 89000,
    img: "pashmina-shawl",
    tag: "BEST",
    fabric: { en: "70% pashmina, 30% silk", ko: "파슈미나 70%, 실크 30%" },
    care: { en: "Dry clean, or hand wash very gently", ko: "드라이클리닝 또는 약하게 손세탁" },
    about: {
      en: "Mountain goat wool, spun and woven by hand. Light enough to fold into a bag, warm enough for a Seoul winter.",
      ko: "산양의 털을 손으로 잣고 짰습니다. 가방에 접어 넣을 만큼 가볍고 서울의 겨울에도 따뜻합니다.",
    },
    rating: 4.9,
    reviews: 231,
    sizes: FREE_SIZE,
    colours: [
      { name: "Natural", ko: "내추럴", hex: "#ddd2bd" },
      { name: "Deep Red", ko: "딥 레드", hex: "#8e1b2e" },
      { name: "Charcoal", ko: "차콜", hex: "#3a3a3c" },
    ],
  },
  {
    id: 12,
    name: "Children's Festive Kurtha",
    korean: "아동 페스티브 쿠르타",
    nepali: "Bal Kurtha",
    category: "Kids",
    occasion: ["tihar", "dashain"],
    price: 59000,
    img: "kids-kurtha",
    fabric: { en: "Cotton, soft mulmul lining", ko: "면, 부드러운 멀멀 안감" },
    care: { en: "Machine wash cold", ko: "찬물 세탁" },
    about: {
      en: "A small version of the adult set, cut from softer cotton so a child will actually keep it on. Ages 4 to 10.",
      ko: "어른 세트를 작게 만든 제품입니다. 아이가 벗지 않도록 더 부드러운 면으로 재단했습니다. 4~10세용.",
    },
    rating: 4.8,
    reviews: 52,
    sizes: SIZES,
    colours: [
      { name: "Marigold", ko: "메리골드", hex: "#d79826" },
      { name: "Red", ko: "레드", hex: "#a51c30" },
    ],
  },
];

const byId = new Map(products.map((p) => [p.id, p]));

const banners = [
  {
    img: "banner-dashain",
    eyebrow: "DASHAIN COLLECTION",
    title: { en: "New clothes for the ten days", ko: "열흘을 위한 새 옷" },
    sub: {
      en: "Order by the first week of September to have it in Korea in time",
      ko: "9월 첫째 주까지 주문하시면 한국에서 제때 받아보실 수 있습니다",
    },
    cta: { en: "Shop Dashain", ko: "다샤인 상품 보기" },
    occasion: "dashain" as const,
    align: "left" as const,
  },
  {
    img: "banner-wedding",
    eyebrow: "WEDDING",
    title: { en: "Lehenga, sherwani, gunyu cholo", ko: "레헹가, 셰르와니, 구뉴 촐로" },
    sub: {
      en: "Cut to your measurements and sent within three weeks",
      ko: "실측 사이즈로 재단하여 3주 이내에 발송합니다",
    },
    cta: { en: "Shop wedding", ko: "결혼식 상품 보기" },
    occasion: "wedding" as const,
    align: "right" as const,
  },
  {
    img: "banner-dhaka",
    eyebrow: "HANDWOVEN DHAKA",
    title: { en: "Woven in, never printed on", ko: "인쇄가 아닌 직조" },
    sub: {
      en: "Wooden looms in Terhathum, eastern Nepal",
      ko: "네팔 동부 테르하툼의 나무 베틀에서",
    },
    cta: { en: "Shop dhaka", ko: "다카 상품 보기" },
    occasion: "everyday" as const,
    align: "left" as const,
  },
];

const categories: { key: string; en: string; ko: string }[] = [
  { key: "All", en: "All", ko: "전체" },
  { key: "Women", en: "Women", ko: "여성" },
  { key: "Men", en: "Men", ko: "남성" },
  { key: "Kids", en: "Kids", ko: "아동" },
  { key: "Accessories", en: "Accessories", ko: "액세서리" },
];

const occasions: {
  key: Occasion | "all";
  label: keyof (typeof T)["en"];
  note: keyof (typeof T)["en"];
}[] = [
  { key: "dashain", label: "occDashain", note: "occDashainNote" },
  { key: "tihar", label: "occTihar", note: "occTiharNote" },
  { key: "teej", label: "occTeej", note: "occTeejNote" },
  { key: "wedding", label: "occWedding", note: "occWeddingNote" },
  { key: "everyday", label: "occEveryday", note: "occEverydayNote" },
];

const glossary: { t: keyof (typeof T)["en"]; d: keyof (typeof T)["en"] }[] = [
  { t: "gloss1t", d: "gloss1d" },
  { t: "gloss2t", d: "gloss2d" },
  { t: "gloss3t", d: "gloss3d" },
  { t: "gloss4t", d: "gloss4d" },
];

const heroIds = [1, 7, 3];
const bestIds = [1, 7, 11, 3];
const newIds = [9, 6, 2, 12];

const reviews = [
  {
    name: "김서연",
    size: "M",
    product: 1,
    rating: 5,
    text: {
      en: "I wore this to a Nepali friend's Dashain dinner and three people asked where it was from. The silk is heavier than I expected, in a good way. Arrived in six days.",
      ko: "네팔 친구의 다샤인 저녁 식사에 입고 갔는데 세 명이나 어디서 샀는지 물었습니다. 실크가 생각보다 묵직해서 더 좋았어요. 6일 만에 도착했습니다.",
    },
  },
  {
    name: "이준호",
    size: "L",
    product: 7,
    rating: 5,
    text: {
      en: "Bought for my wedding. The eight ties take a minute to learn but there is a card in the box showing how. Shoulders were a little tight so they recut it for free.",
      ko: "결혼식에 입으려고 구매했습니다. 끈 여덟 개 매는 법은 처음엔 헷갈리는데 설명 카드가 들어 있습니다. 어깨가 조금 껴서 말씀드렸더니 무료로 다시 지어주셨어요.",
    },
  },
  {
    name: "박민지",
    size: "FREE",
    product: 11,
    rating: 5,
    text: {
      en: "Softer than the pashmina I bought in Myeongdong for twice the price. I have worn it every day since November.",
      ko: "명동에서 두 배 가격에 산 파슈미나보다 부드럽습니다. 11월부터 매일 두르고 다녀요.",
    },
  },
  {
    name: "정하늘",
    size: "S",
    product: 3,
    rating: 4,
    text: {
      en: "Beautiful weave on the border. Wrapping a saree took me a few tries — worth watching a video first. The blouse fit perfectly.",
      ko: "보더의 직조가 정말 예쁩니다. 사리 감는 건 몇 번 연습이 필요했어요. 영상 먼저 보시길 권합니다. 블라우스는 딱 맞았습니다.",
    },
  },
];

const sizeChart: { size: Size; bust: number; waist: number; length: number }[] = [
  { size: "XS", bust: 82, waist: 64, length: 96 },
  { size: "S", bust: 86, waist: 68, length: 98 },
  { size: "M", bust: 90, waist: 72, length: 100 },
  { size: "L", bust: 96, waist: 78, length: 102 },
  { size: "XL", bust: 102, waist: 84, length: 104 },
];

const payMethods = [
  { key: "kakao", en: "KakaoPay", ko: "카카오페이" },
  { key: "naver", en: "Naver Pay", ko: "네이버페이" },
  { key: "toss", en: "Toss", ko: "토스" },
  { key: "card", en: "Credit card", ko: "신용카드" },
  { key: "bank", en: "Bank transfer", ko: "무통장입금" },
];

const company: { label: keyof (typeof T)["en"]; value: Bi }[] = [
  { label: "coRegName", value: { en: "RANGA Trading Co., Ltd.", ko: "주식회사 랑가트레이딩" } },
  { label: "coRep", value: { en: "Sample Name", ko: "홍길동" } },
  { label: "coReg", value: { en: "000-00-00000", ko: "000-00-00000" } },
  { label: "coMail", value: { en: "0000-Seoul-0000", ko: "제0000-서울-0000호" } },
  { label: "coPrivacy", value: { en: "Sample Name", ko: "홍길동" } },
  {
    label: "coAddr",
    value: {
      en: "00, Sample-ro, Mapo-gu, Seoul · Workshop: Patan, Lalitpur, Nepal",
      ko: "서울시 마포구 샘플로 00 · 공방: 네팔 랄릿푸르 파탄",
    },
  },
  {
    label: "coReturn",
    value: {
      en: "00, Sample-ro, Mapo-gu, Seoul 00000",
      ko: "서울시 마포구 샘플로 00, 00000",
    },
  },
];

const accountOrders = [
  { no: "RG-20261018-0412", product: 7, variant: "L · Ivory", status: "prep" as const },
  { no: "RG-20261002-0288", product: 11, variant: "FREE · Natural", status: "ship" as const },
  { no: "RG-20260914-0117", product: 1, variant: "M · Deep Red", status: "done" as const },
];

const FREE_SHIPPING = 150000;
const SHIPPING_FEE = 6000;
const SLIDE_MS = 3000;

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;
const keyOf = (id: number, size: Size, colour: string) => `${id}|${size}|${colour}`;
const lead = (p: Product, lang: Lang) => (lang === "ko" ? p.korean : p.name);
const sub = (p: Product, lang: Lang) => (lang === "ko" ? p.name : p.korean);

// A woven-looking diamond mark rather than letterspaced initials. A real mark is one of
// the cheapest legitimacy signals a small store can have.
function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  const stroke = light ? "#ffffff" : "#8e1b2e";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path d="M16 2 30 16 16 30 2 16 16 2Z" stroke={stroke} strokeWidth="1.6" />
      <path d="M16 8.5 23.5 16 16 23.5 8.5 16 16 8.5Z" stroke={stroke} strokeWidth="1.2" />
      <circle cx="16" cy="16" r="2.4" fill={light ? "#ffffff" : "#c8a94b"} />
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

function Stars({ n, gold = false }: { n: number; gold?: boolean }) {
  return (
    <span className="inline-flex items-center" style={{ gap: "1px" }} aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-3 w-3"
          strokeWidth={1.5}
          style={{
            fill: i <= Math.round(n) ? (gold ? "#c8a94b" : "#8e1b2e") : "transparent",
            color: i <= Math.round(n) ? (gold ? "#c8a94b" : "#8e1b2e") : "#c9bfb0",
          }}
        />
      ))}
    </span>
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
    <button type="button" onClick={() => onPick(p)} className="rga-card group text-left">
      <div className="rga-card-img">
        <img
          src={`${IMG}/${p.img}-sm.webp`}
          srcSet={`${IMG}/${p.img}-sm.webp 480w, ${IMG}/${p.img}.webp 1050w`}
          sizes="(min-width: 768px) 25vw, 50vw"
          alt={lead(p, lang)}
          loading="lazy"
          className="rga-card-photo"
        />
        {p.tag && <span className={`rga-tag rga-tag-${p.tag.toLowerCase()}`}>{p.tag}</span>}
      </div>
      <p className="rga-card-nep">{p.nepali}</p>
      <p className="rga-card-name">{lead(p, lang)}</p>
      <p className="rga-card-sub">{sub(p, lang)}</p>
      <p className="rga-card-price">
        {p.was && <span className="rga-was">{won(p.was)}</span>}
        <span>{won(p.price)}</span>
      </p>
      <p className="rga-card-rate">
        <Stars n={p.rating} />
        <span>
          {p.rating.toFixed(1)} ({p.reviews})
        </span>
      </p>
      <span className="rga-card-cta">{t.addToCart}</span>
    </button>
  );
}

function Festive() {
  const { n } = Route.useSearch();
  const biz = demoBusiness(
    Route.useSearch(),
    { name: "RANGA", area: "Mapo-gu, Seoul", address: "Mapo-gu, Seoul" },
    "#contact",
    KOREA,
  );

  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  const [category, setCategory] = useState("All");
  const [occasion, setOccasion] = useState<Occasion | "all">("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [slide, setSlide] = useState(0);
  const [guide, setGuide] = useState(false);
  const [account, setAccount] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      (occasion === "all" || p.occasion.includes(occasion)),
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

  function pickOccasion(o: Occasion | "all") {
    setOccasion(o);
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

  const heroProduct = byId.get(heroIds[slide % heroIds.length])!;
  const colourName = (c: Colour) => (lang === "ko" ? c.ko : c.name);

  const sectionHead = (title: string, subtitle: string, onView?: () => void) => (
    <div className="rga-head">
      <div>
        <h2 className="rga-head-title">{title}</h2>
        <p className="rga-head-sub">{subtitle}</p>
      </div>
      {onView && (
        <button type="button" onClick={onView} className="rga-head-link">
          {t.viewAll} <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="rga">
      <style>{`
        .rga {
          font-family: "Karla", "Noto Sans KR", ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          background: #fffbf5;
          color: #241613;
          padding-bottom: 4rem;
        }
        @media (min-width: 768px) { .rga { padding-bottom: 0; } }
        .rga h1, .rga h2, .rga .rga-serif {
          font-family: "Bodoni Moda", "Noto Serif KR", Georgia, serif;
          font-weight: 500;
          letter-spacing: -0.015em;
        }
        .rga em { font-style: italic; color: #9b1b30; }
        .rga-tab { font-variant-numeric: tabular-nums; }
        .rga-wrap { max-width: 72rem; margin: 0 auto; padding-left: 1.5rem; padding-right: 1.5rem; }
        @media (min-width: 768px) { .rga-wrap { padding-left: 2rem; padding-right: 2rem; } }
        .rga-scroll { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .rga-scroll::-webkit-scrollbar { display: none; }

        /* Header sits on cream, so the hero reads as type on paper, not a photo slab */
        .rga-promo { background: #5e1020; color: #f0ddb9; text-align: center; font-size: 11.5px; padding: 0.6rem 1rem; }
        .rga-header { position: sticky; top: 0; z-index: 40; background: #fffbf5; color: #241613; transition: box-shadow .4s; }
        .rga-header-float { box-shadow: none; }
        .rga-header-solid { box-shadow: 0 1px 0 rgba(36,22,19,.09), 0 8px 24px -18px rgba(36,22,19,.45); }
        .rga-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; height: 4.5rem; }
        .rga-brand { display: flex; align-items: center; gap: 0.65rem; flex-shrink: 0; }
        .rga-brand-name { font-family: "Bodoni Moda", Georgia, serif; font-size: 1.4rem; font-weight: 600; letter-spacing: 0.1em; }
        .rga-search { position: relative; flex: 1; max-width: 20rem; display: none; }
        @media (min-width: 900px) { .rga-search { display: block; } }
        .rga-search-box { width: 100%; border: 1px solid #ebdfcf; border-radius: 999px; background: #fff; padding: 0.6rem 1rem 0.6rem 2.3rem; font-size: 12.5px; color: #9a8373; }
        .rga-icons { display: flex; align-items: center; gap: 1.15rem; flex-shrink: 0; }
        .rga-langs { display: flex; align-items: center; font-size: 11.5px; font-weight: 500; letter-spacing: 0.04em; }
        .rga-lang-div { padding: 0 0.4rem; opacity: .35; }
        .rga-count { position: absolute; top: -7px; right: -10px; min-width: 17px; height: 17px; display: grid; place-items: center; border-radius: 999px; font-size: 10px; font-weight: 700; padding: 0 5px; background: #9b1b30; color: #fff; }
        .rga-nav { border-top: 1px solid #f0e6d8; }
        .rga-nav-row { display: flex; gap: 2rem; }
        .rga-nav-item { flex-shrink: 0; padding: 0.9rem 0; font-size: 13px; font-weight: 500; color: #7a6256; background: none; border-bottom: 2px solid transparent; transition: color .2s, border-color .2s; }
        .rga-nav-item:hover { color: #241613; }
        .rga-nav-item[data-on="true"] { color: #9b1b30; border-bottom-color: #9b1b30; }

        /* Hero: centred editorial type, then a triptych of images */
        .rga-hero { background: #fffbf5; padding-top: 3.5rem; }
        @media (min-width: 768px) { .rga-hero { padding-top: 5rem; } }
        .rga-hero-in { text-align: center; max-width: 46rem; margin: 0 auto; }
        .rga-eyebrow { font-size: 11.5px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: #9b1b30; }
        .rga-hero-title { margin-top: 1.1rem; font-size: clamp(2.5rem, 6.6vw, 4.5rem); line-height: 1.03; }
        .rga-hero-sub { margin: 1.4rem auto 0; font-size: 1.02rem; line-height: 1.8; color: #6b5245; max-width: 32rem; }
        .rga-hero-btns { margin-top: 2.1rem; display: flex; gap: 0.7rem; justify-content: center; flex-wrap: wrap; }
        .rga-pill { display: inline-flex; align-items: center; gap: 0.5rem; border-radius: 999px; padding: 0.95rem 1.9rem; font-size: 13.5px; font-weight: 700; transition: transform .22s, background-color .22s, border-color .22s; }
        .rga-pill-solid { background: #9b1b30; color: #fff; }
        .rga-pill-solid:hover { background: #7f1527; transform: translateY(-2px); }
        .rga-pill-ghost { border: 1px solid #ddcab2; color: #241613; }
        .rga-pill-ghost:hover { border-color: #241613; transform: translateY(-2px); }
        .rga-proof { margin-top: 2rem; display: inline-flex; align-items: center; gap: 0.6rem; font-size: 13px; color: #7a6256; }
        .rga-trip { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 3rem; }
        @media (min-width: 768px) { .rga-trip { grid-template-columns: 1fr 1.25fr 1fr; gap: 1.35rem; align-items: center; } }
        .rga-trip figure { position: relative; margin: 0; border-radius: 1.6rem; overflow: hidden; background: #f3e9db; box-shadow: 0 30px 60px -42px rgba(36,22,19,.65); }
        .rga-trip figure img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .rga-trip .t-side { aspect-ratio: 4/5; }
        .rga-trip .t-mid { aspect-ratio: 4/5; }
        @media (min-width: 768px) { .rga-trip .t-side { aspect-ratio: 3/4; } .rga-trip .t-mid { aspect-ratio: 5/6; } }
        .rga-float { position: absolute; left: 0.9rem; right: 0.9rem; bottom: 0.9rem; display: flex; align-items: flex-end; justify-content: space-between; gap: 0.8rem; background: rgba(255,251,245,.95); backdrop-filter: blur(8px); border-radius: 1rem; padding: 0.9rem 1rem; box-shadow: 0 14px 30px -18px rgba(36,22,19,.55); }
        .rga-float .lbl { font-size: 9.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #9b1b30; }
        .rga-float .nm { font-family: "Bodoni Moda", Georgia, serif; font-size: 1rem; font-weight: 600; margin-top: 0.2rem; }
        .rga-float .pr { font-size: 12.5px; font-weight: 600; color: #6b5245; }
        .rga-float button { flex-shrink: 0; border-radius: 999px; background: #241613; color: #fff; font-size: 12px; font-weight: 700; padding: 0.6rem 1.1rem; transition: background-color .2s; }
        .rga-float button:hover { background: #9b1b30; }

        /* Occasions: one quiet strip, not the spine of the shop */
        .rga-occ { background: #fff6ec; border-top: 1px solid #f0e6d8; border-bottom: 1px solid #f0e6d8; }
        .rga-occ-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 0.8rem; margin-top: 1.8rem; }
        @media (min-width: 768px) { .rga-occ-grid { grid-template-columns: repeat(5, minmax(0,1fr)); gap: 1rem; } }
        .rga-occ-card { text-align: left; border: 1px solid #ecdfcc; border-radius: 1.1rem; background: #fffbf5; padding: 1.15rem 1.15rem 1.3rem; transition: border-color .2s, transform .2s, box-shadow .2s; }
        .rga-occ-card:hover { border-color: #9b1b30; transform: translateY(-3px); box-shadow: 0 18px 36px -28px rgba(36,22,19,.6); }
        .rga-occ-card[data-on="true"] { border-color: #9b1b30; background: #fff; box-shadow: 0 18px 36px -28px rgba(155,27,48,.55); }
        .rga-occ-name { font-family: "Bodoni Moda", Georgia, serif; font-size: 1.05rem; font-weight: 600; color: #9b1b30; }
        .rga-occ-note { margin-top: 0.4rem; font-size: 12px; line-height: 1.65; color: #7a6256; }

        /* Sections */
        .rga-section { padding-top: 4.5rem; padding-bottom: 4.5rem; }
        .rga-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1.2rem; }
        .rga-head-title { font-size: clamp(1.7rem, 3.4vw, 2.4rem); }
        .rga-head-sub { margin-top: 0.6rem; font-size: 14px; line-height: 1.7; color: #7a6256; max-width: 42ch; }
        .rga-head-link { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 13px; font-weight: 700; color: #9b1b30; white-space: nowrap; transition: gap .2s; }
        .rga-head-link:hover { gap: 0.6rem; }
        .rga-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 2.6rem 1.3rem; margin-top: 2.4rem; }
        @media (min-width: 768px) { .rga-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 3rem 1.7rem; } }

        /* Product card */
        .rga-card-img { position: relative; width: 100%; aspect-ratio: 3/4; overflow: hidden; border-radius: 1.3rem; background: #f3e9db; }
        .rga-card-photo { width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.7,.2,1); }
        .rga-card:hover .rga-card-photo { transform: scale(1.05); }
        .rga-tag { position: absolute; top: 0.8rem; left: 0.8rem; font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em; padding: 0.3rem 0.65rem; border-radius: 999px; }
        .rga-tag-new { background: #241613; color: #fff; }
        .rga-tag-best { background: #be9a4e; color: #2b1c05; }
        .rga-card-nep { margin-top: 0.9rem; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #be9a4e; }
        .rga-card-name { margin-top: 0.3rem; font-family: "Bodoni Moda", Georgia, serif; font-size: 1.02rem; font-weight: 600; line-height: 1.3; }
        .rga-card-sub { margin-top: 0.15rem; font-size: 11.5px; color: #9a8373; }
        .rga-card-price { margin-top: 0.5rem; font-size: 13.5px; font-weight: 700; font-variant-numeric: tabular-nums; display: flex; align-items: baseline; gap: 0.45rem; }
        .rga-was { font-size: 11.5px; font-weight: 400; color: #b3a394; text-decoration: line-through; }
        .rga-card-rate { margin-top: 0.3rem; display: flex; align-items: center; gap: 0.35rem; font-size: 11px; color: #9a8373; }
        .rga-card-cta { display: inline-block; margin-top: 0.75rem; border-radius: 999px; border: 1px solid #ddcab2; padding: 0.45rem 1rem; font-size: 11.5px; font-weight: 700; color: #241613; opacity: 0; transform: translateY(4px); transition: opacity .25s, transform .25s, border-color .2s; }
        .rga-card:hover .rga-card-cta { opacity: 1; transform: none; border-color: #9b1b30; }

        /* Story */
        .rga-story { background: #fff6ec; border-top: 1px solid #f0e6d8; border-bottom: 1px solid #f0e6d8; }
        .rga-story-grid { display: grid; gap: 2.6rem; padding-top: 5rem; padding-bottom: 5rem; align-items: center; }
        @media (min-width: 768px) { .rga-story-grid { grid-template-columns: 1fr 1fr; gap: 4.5rem; } }
        .rga-story-imgs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .rga-story-imgs img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 1.3rem; box-shadow: 0 30px 60px -45px rgba(36,22,19,.7); }
        .rga-story-imgs img:last-child { margin-top: 2.6rem; }
        .rga-story-title { margin-top: 1.1rem; font-size: clamp(1.9rem, 4vw, 2.7rem); line-height: 1.15; }
        .rga-story-body { margin-top: 1.3rem; font-size: 14.5px; line-height: 1.95; color: #6b5245; }
        .rga-story-points { margin-top: 2rem; display: grid; gap: 1.2rem; }
        .rga-point-t { font-size: 14px; font-weight: 700; }
        .rga-point-d { margin-top: 0.25rem; font-size: 12.5px; line-height: 1.7; color: #8a7263; }

        /* Glossary */
        .rga-gloss-grid { display: grid; gap: 1.2rem; margin-top: 2.4rem; }
        @media (min-width: 768px) { .rga-gloss-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1.5rem; } }
        .rga-gloss-card { border: 1px solid #ecdfcc; border-radius: 1.3rem; background: #fff; padding: 1.6rem; }
        .rga-gloss-t { font-family: "Bodoni Moda", Georgia, serif; font-size: 1.2rem; font-weight: 600; color: #9b1b30; }
        .rga-gloss-d { margin-top: 0.6rem; font-size: 13.5px; line-height: 1.85; color: #6b5245; }

        /* Shipping */
        .rga-ship { background: #5e1020; color: #f6e8cf; }
        .rga-ship-grid { display: grid; gap: 1.8rem; padding-bottom: 3rem; }
        @media (min-width: 768px) { .rga-ship-grid { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 2.6rem; } }
        .rga-ship-item { display: flex; gap: 0.9rem; align-items: flex-start; }
        .rga-ship-t { font-size: 14px; font-weight: 700; }
        .rga-ship-d { margin-top: 0.3rem; font-size: 12.5px; line-height: 1.75; color: rgba(246,232,207,.75); }

        /* Reviews */
        .rga-rev-grid { display: grid; gap: 1.2rem; margin-top: 2.4rem; }
        @media (min-width: 768px) { .rga-rev-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 1.5rem; } }
        .rga-rev { border: 1px solid #ecdfcc; border-radius: 1.3rem; background: #fff; padding: 1.6rem; }
        .rga-rev-top { display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; }
        .rga-rev-name { font-size: 13.5px; font-weight: 700; }
        .rga-rev-meta { font-size: 11.5px; color: #9a8373; margin-top: 0.15rem; }
        .rga-rev-text { margin-top: 0.85rem; font-size: 13.5px; line-height: 1.85; color: #6b5245; }

        /* Newsletter */
        .rga-news { background: #fff6ec; border-top: 1px solid #f0e6d8; }
        .rga-news-in { padding-top: 4rem; padding-bottom: 4rem; text-align: center; }
        .rga-news-form { margin: 1.8rem auto 0; display: flex; gap: 0.6rem; max-width: 27rem; }
        .rga-news-input { flex: 1; border: 1px solid #ddcab2; border-radius: 999px; background: #fff; padding: 0.9rem 1.2rem; font-size: 13.5px; }
        .rga-news-btn { border-radius: 999px; background: #9b1b30; color: #fff; padding: 0.9rem 1.7rem; font-size: 13px; font-weight: 700; transition: background-color .2s, transform .2s; }
        .rga-news-btn:hover { background: #7f1527; transform: translateY(-2px); }

        /* Footer */
        .rga-foot { background: #241613; color: #e5d8c9; }
        .rga-foot-grid { display: grid; gap: 2.8rem; padding-top: 4rem; padding-bottom: 2.6rem; }
        @media (min-width: 768px) { .rga-foot-grid { grid-template-columns: 1.1fr 1fr; gap: 4.5rem; } }
        .rga-foot-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 1.5rem; }
        .rga-foot-h { font-size: 10.5px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #be9a4e; }
        .rga-foot-links { margin-top: 0.9rem; display: grid; gap: 0.6rem; }
        .rga-foot-links span { font-size: 13px; color: rgba(229,216,201,.78); }
        .rga-foot-pay { display: flex; flex-wrap: wrap; gap: 0.45rem 0.6rem; margin-top: 0.95rem; }
        .rga-pay { border: 1px solid rgba(229,216,201,.28); border-radius: 999px; padding: 0.3rem 0.75rem; font-size: 10.5px; }
        .rga-co { border-top: 1px solid rgba(229,216,201,.15); padding-top: 1.8rem; padding-bottom: 3.2rem; display: grid; gap: 0.5rem; }
        .rga-co-row { font-size: 11px; color: rgba(229,216,201,.6); line-height: 1.7; }
        .rga-co-row b { font-weight: 600; color: rgba(229,216,201,.85); }
        .rga-disclaim { margin-top: 1rem; font-size: 11px; line-height: 1.8; color: rgba(229,216,201,.45); }
        .rga-social { display: flex; gap: 1.1rem; margin-top: 1.2rem; }

        /* App-style bottom bar, phones only */
        .rga-tabs { position: fixed; left: 0; right: 0; bottom: 0; z-index: 45; display: grid; grid-template-columns: repeat(5,1fr); background: rgba(255,251,245,.97); backdrop-filter: blur(10px); border-top: 1px solid #ecdfcc; }
        @media (min-width: 768px) { .rga-tabs { display: none; } }
        .rga-tab-btn { padding: 0.6rem 0 0.7rem; display: grid; justify-items: center; gap: 0.22rem; font-size: 10px; font-weight: 500; color: #8a7263; position: relative; }
        .rga-tab-btn[data-on="true"] { color: #9b1b30; }

        /* Overlays */
        .rga-scrim { position: fixed; inset: 0; z-index: 50; background: rgba(36,22,19,.5); backdrop-filter: blur(2px); }
        .rga-drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 55; width: 100%; max-width: 27rem; background: #fffbf5; display: flex; flex-direction: column; }
        .rga-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 1.3rem 1.5rem; border-bottom: 1px solid #ecdfcc; }
        .rga-drawer-title { font-family: "Bodoni Moda", Georgia, serif; font-size: 1.2rem; font-weight: 600; }
        .rga-drawer-body { flex: 1; overflow-y: auto; padding: 1.5rem; }
        .rga-drawer-foot { border-top: 1px solid #ecdfcc; padding: 1.3rem 1.5rem 1.6rem; background: #fff; }
        .rga-line { display: grid; grid-template-columns: 5rem 1fr; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #f0e5d6; }
        .rga-line img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 0.8rem; background: #f3e9db; }
        .rga-line-name { font-size: 13.5px; font-weight: 700; line-height: 1.4; }
        .rga-line-var { margin-top: 0.2rem; font-size: 11.5px; color: #9a8373; }
        .rga-qty { margin-top: 0.6rem; display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; }
        .rga-qty-box { display: flex; align-items: center; border: 1px solid #e0cfb8; border-radius: 999px; }
        .rga-qty-btn { padding: 0.35rem 0.6rem; }
        .rga-qty-n { min-width: 1.8rem; text-align: center; font-size: 12.5px; font-variant-numeric: tabular-nums; }
        .rga-sum { display: flex; align-items: center; justify-content: space-between; font-size: 13.5px; padding: 0.3rem 0; color: #6b5245; }
        .rga-sum-total { font-size: 1.15rem; font-weight: 600; color: #241613; font-family: "Bodoni Moda", Georgia, serif; }
        .rga-btn { width: 100%; border-radius: 999px; background: #9b1b30; color: #fff; padding: 1rem; font-size: 13.5px; font-weight: 700; transition: background-color .2s, transform .2s; }
        .rga-btn:hover { background: #7f1527; transform: translateY(-2px); }
        .rga-btn-ghost { width: 100%; border-radius: 999px; border: 1px solid #ddcab2; color: #6b5245; padding: 0.9rem; font-size: 13px; font-weight: 700; margin-top: 0.6rem; }
        .rga-field { display: grid; gap: 0.35rem; margin-top: 1rem; }
        .rga-field label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #8a7263; text-transform: uppercase; }
        .rga-field input { border: 1px solid #e0cfb8; border-radius: 0.8rem; background: #fff; padding: 0.75rem 0.9rem; font-size: 13.5px; }
        .rga-two { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
        .rga-pay-list { display: grid; gap: 0.55rem; margin-top: 0.8rem; }
        .rga-pay-opt { display: flex; align-items: center; gap: 0.7rem; border: 1px solid #e0cfb8; border-radius: 0.9rem; background: #fff; padding: 0.8rem 0.95rem; font-size: 13.5px; }

        .rga-modal { position: fixed; inset: 0; z-index: 55; display: grid; place-items: center; padding: 1rem; }
        .rga-modal-card { width: 100%; max-width: 56rem; max-height: 88vh; overflow-y: auto; background: #fffbf5; border-radius: 1.6rem; }
        .rga-quick { display: grid; }
        @media (min-width: 768px) { .rga-quick { grid-template-columns: 1fr 1fr; } }
        .rga-quick img { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: #f3e9db; }
        .rga-quick-body { padding: 1.7rem; }
        @media (min-width: 768px) { .rga-quick-body { padding: 2.4rem; } }
        .rga-sizes { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.7rem; }
        .rga-size { min-width: 3.2rem; border: 1px solid #ddcab2; border-radius: 999px; padding: 0.6rem 0.85rem; font-size: 12.5px; font-weight: 500; background: #fff; transition: background-color .2s, border-color .2s, color .2s; }
        .rga-size[data-on="true"] { background: #241613; color: #fff; border-color: #241613; }
        .rga-size[disabled] { color: #c5b7a7; text-decoration: line-through; background: #f6efe5; }
        .rga-swatches { display: flex; flex-wrap: wrap; gap: 0.55rem; margin-top: 0.7rem; }
        .rga-swatch { display: flex; align-items: center; gap: 0.45rem; border: 1px solid #ddcab2; border-radius: 999px; padding: 0.4rem 0.8rem 0.4rem 0.45rem; font-size: 12px; background: #fff; }
        .rga-swatch[data-on="true"] { border-color: #241613; }
        .rga-dot { width: 0.95rem; height: 0.95rem; border-radius: 999px; border: 1px solid rgba(36,22,19,.2); }
        .rga-spec { margin-top: 1.5rem; border-top: 1px solid #ecdfcc; padding-top: 1.1rem; display: grid; gap: 0.65rem; }
        .rga-spec-row { display: grid; grid-template-columns: 6rem 1fr; gap: 0.7rem; font-size: 12.5px; line-height: 1.7; color: #6b5245; }
        .rga-spec-row b { font-weight: 700; color: #8a7263; }

        .rga-table { width: 100%; border-collapse: collapse; margin-top: 1.1rem; font-size: 13px; font-variant-numeric: tabular-nums; }
        .rga-table th, .rga-table td { border-bottom: 1px solid #ecdfcc; padding: 0.7rem 0.45rem; text-align: left; }
        .rga-table th { font-weight: 700; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #8a7263; }

        .rga-toast { position: fixed; left: 50%; bottom: 5.5rem; transform: translateX(-50%); z-index: 60; background: #241613; color: #fff; border-radius: 999px; padding: 0.8rem 1.3rem; font-size: 12.5px; display: flex; align-items: center; gap: 0.5rem; max-width: 90vw; box-shadow: 0 18px 40px -22px rgba(0,0,0,.9); }
        @media (min-width: 768px) { .rga-toast { bottom: 2.2rem; } }

        .rga-account-rows { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid #ecdfcc; border-radius: 1.1rem; background: #fff; margin-top: 1.1rem; overflow: hidden; }
        .rga-account-cell { padding: 1rem 0.5rem; text-align: center; border-right: 1px solid #ecdfcc; }
        .rga-account-cell:last-child { border-right: none; }
        .rga-account-n { font-family: "Bodoni Moda", Georgia, serif; font-size: 1.3rem; font-weight: 600; }
        .rga-account-l { margin-top: 0.15rem; font-size: 11px; color: #8a7263; }
        .rga-order { display: grid; grid-template-columns: 4rem 1fr; gap: 0.9rem; padding: 0.95rem 0; border-bottom: 1px solid #f0e5d6; }
        .rga-order img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 0.7rem; background: #f3e9db; }
        .rga-status { display: inline-block; font-size: 10.5px; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; border: 1px solid currentColor; }
        .rga-menu-row { display: flex; align-items: center; justify-content: space-between; padding: 0.95rem 0; border-bottom: 1px solid #f0e5d6; font-size: 13.5px; }

        @keyframes rga-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .rga-rise { animation: rga-rise .85s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes rga-in { from { transform: translateX(100%); } to { transform: none; } }
        .rga-drawer { animation: rga-in .34s cubic-bezier(.2,.7,.2,1); }
        @keyframes rga-pop { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .rga-pop { animation: rga-pop .28s cubic-bezier(.2,.7,.2,1); }
        @media (prefers-reduced-motion: reduce) {
          .rga-rise, .rga-drawer, .rga-pop { animation: none !important; }
          .rga-card-photo, .rga-occ-card, .rga-pill, .rga-btn { transition: none !important; }
        }
      `}</style>

      <DemoBanner forName={n} />

      <header className={`rga-header ${scrolled ? "rga-header-solid" : "rga-header-float"}`}>
        <div className="rga-promo">{t.promo}</div>
        <div className="rga-wrap rga-bar">
          <a href="#top" className="rga-brand">
            <Logo className="h-7 w-7" light={!scrolled} />
            <span className="rga-brand-name">{biz.name}</span>
          </a>
          <div className="rga-search">
            <Search
              className="absolute left-0 h-4 w-4"
              style={{ top: "50%", transform: "translateY(-50%)", opacity: 0.6 }}
            />
            <div className="rga-search-box">{t.searchPlaceholder}</div>
          </div>
          <div className="rga-icons">
            <div className="rga-langs" role="group" aria-label="Language">
              {(["en", "ko"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i === 1 && <span className="rga-lang-div">|</span>}
                  <button
                    type="button"
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    style={{ fontWeight: lang === l ? 500 : 300, opacity: lang === l ? 1 : 0.6 }}
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
              <User className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.cart}
              className="relative inline-flex items-center"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {count > 0 && <span className="rga-count rga-tab">{count}</span>}
            </button>
          </div>
        </div>
        <nav className="rga-nav">
          <div className="rga-wrap rga-scroll">
            <div className="rga-nav-row">
              {categories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => pickCategory(c.key)}
                  data-on={category === c.key}
                  className="rga-nav-item"
                >
                  {lang === "ko" ? c.ko : c.en}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero — centred type on cream, then a triptych. Deliberately not the split
          hero-with-floating-card that /demos/shop uses. */}
      <section id="top" className="rga-hero">
        <div className="rga-wrap">
          <div className="rga-hero-in">
            <p className="rga-eyebrow rga-rise">{t.heroEyebrow}</p>
            <h1 className="rga-hero-title rga-rise" style={{ animationDelay: "90ms" }}>
              {t.heroT1} <em>{t.heroEm}</em> {t.heroT2}
            </h1>
            <p className="rga-hero-sub rga-rise" style={{ animationDelay: "180ms" }}>
              {t.heroSub}
            </p>
            <div className="rga-hero-btns rga-rise" style={{ animationDelay: "260ms" }}>
              <button
                type="button"
                onClick={() => pickCategory("All")}
                className="rga-pill rga-pill-solid"
              >
                {t.heroShop}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </button>
              <a href="#story" className="rga-pill rga-pill-ghost">
                {t.heroStory}
              </a>
            </div>
            <p className="rga-proof rga-rise" style={{ animationDelay: "340ms" }}>
              <Stars n={5} gold />
              {t.heroProof}
            </p>
          </div>

          <div className="rga-trip rga-rise" style={{ animationDelay: "420ms" }}>
            <figure className="t-side">
              <img src={`${IMG}/${banners[slide].img}.webp`} alt="" loading="eager" />
            </figure>
            <figure className="t-mid">
              <img src={`${IMG}/${heroProduct.img}.webp`} alt={lead(heroProduct, lang)} />
              <div className="rga-float">
                <div style={{ minWidth: 0 }}>
                  <p className="lbl">{t.heroFeatured}</p>
                  <p className="nm">{lead(heroProduct, lang)}</p>
                  <p className="pr rga-tab">{won(heroProduct.price)}</p>
                </div>
                <button type="button" onClick={() => openQuick(heroProduct)}>
                  {t.addToCart}
                </button>
              </div>
            </figure>
            <figure className="t-side">
              <img
                src={`${IMG}/${banners[(slide + 1) % banners.length].img}.webp`}
                alt=""
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Shop by occasion — the thing a Korean shopper cannot work out on their own */}
      <section className="rga-occ">
        <div className="rga-wrap rga-section">
          {sectionHead(t.occTitle, t.occSub)}
          <div className="rga-occ-grid">
            {occasions.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => pickOccasion(o.key as Occasion)}
                data-on={occasion === o.key}
                className="rga-occ-card"
              >
                <p className="rga-occ-name">{t[o.label]}</p>
                <p className="rga-occ-note">{t[o.note]}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Most ordered */}
      <section className="rga-wrap rga-section">
        {sectionHead(t.bestTitle, t.bestSub, () => pickOccasion("all"))}
        <div className="rga-grid">
          {bestIds.map((id) => (
            <ProductCard key={id} p={byId.get(id)!} onPick={openQuick} lang={lang} t={t} />
          ))}
        </div>
      </section>

      {/* Workshop story */}
      <section className="rga-story">
        <div className="rga-wrap rga-story-grid">
          <div className="rga-story-imgs">
            <img src={`${IMG}/lookbook-a-sm.webp`} alt="" loading="lazy" />
            <img src={`${IMG}/lookbook-b-sm.webp`} alt="" loading="lazy" />
          </div>
          <div>
            <p className="rga-eyebrow" style={{ color: "#b08a52" }}>
              {t.storyEyebrow}
            </p>
            <h2 className="rga-story-title">
              {t.storyTitle1}
              <br />
              {t.storyTitle2}
            </h2>
            <p className="rga-story-body">{t.storyBody}</p>
            <div className="rga-story-points">
              {[
                [t.st1t, t.st1d],
                [t.st2t, t.st2d],
                [t.st3t, t.st3d],
              ].map(([title, desc]) => (
                <div key={title}>
                  <p className="rga-point-t">{title}</p>
                  <p className="rga-point-d">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Just arrived */}
      <section className="rga-wrap rga-section">
        {sectionHead(t.newTitle, t.newSub, () => pickOccasion("all"))}
        <div className="rga-grid">
          {newIds.map((id) => (
            <ProductCard key={id} p={byId.get(id)!} onPick={openQuick} lang={lang} t={t} />
          ))}
        </div>
      </section>

      {/* Full catalogue, with both filters live */}
      <section id="shop" className="rga-wrap rga-section">
        {sectionHead(t.allTitle, t.allSub)}
        <div className="rga-scroll" style={{ marginTop: "1.2rem" }}>
          <div style={{ display: "flex", gap: "0.45rem" }}>
            {(["all", ...occasions.map((o) => o.key)] as (Occasion | "all")[]).map((key) => {
              const found = occasions.find((o) => o.key === key);
              const label = found ? t[found.label] : t.occAll;
              const on = occasion === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setOccasion(key)}
                  style={{
                    flexShrink: 0,
                    border: `1px solid ${on ? "#8e1b2e" : "#e0cfb8"}`,
                    background: on ? "#8e1b2e" : "#fff",
                    color: on ? "#fff" : "#6b5245",
                    padding: "0.5rem 1rem",
                    fontSize: "11.5px",
                    fontWeight: 300,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        {visible.length === 0 ? (
          <p
            style={{
              marginTop: "2.5rem",
              fontSize: "12.5px",
              fontWeight: 300,
              color: "#8a7263",
              textAlign: "center",
            }}
          >
            {t.empty}
          </p>
        ) : (
          <div className="rga-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} p={p} onPick={openQuick} lang={lang} t={t} />
            ))}
          </div>
        )}
      </section>

      {/* Glossary — explains the garments to a buyer who has never worn them */}
      <section className="rga-occ">
        <div className="rga-wrap rga-section">
          {sectionHead(t.glossTitle, t.glossSub)}
          <div className="rga-gloss-grid">
            {glossary.map((g) => (
              <div key={g.t} className="rga-gloss-card">
                <p className="rga-gloss-t">{t[g.t]}</p>
                <p className="rga-gloss-d">{t[g.d]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping to Korea */}
      <section className="rga-ship">
        <div className="rga-wrap" style={{ paddingTop: "2.6rem" }}>
          <p className="rga-eyebrow" style={{ color: "#e9c979" }}>
            {t.shipTitle}
          </p>
        </div>
        <div className="rga-wrap rga-ship-grid" style={{ paddingTop: "1.2rem" }}>
          {[
            [Truck, t.ship1t, t.ship1d],
            [Shield, t.ship2t, t.ship2d],
            [Sparkles, t.ship3t, t.ship3d],
          ].map(([Icon, title, desc]) => {
            const Ico = Icon as typeof Truck;
            return (
              <div key={title as string} className="rga-ship-item">
                <Ico className="h-5 w-5 shrink-0" strokeWidth={1.4} style={{ color: "#e9c979" }} />
                <div>
                  <p className="rga-ship-t">{title as string}</p>
                  <p className="rga-ship-d">{desc as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section className="rga-wrap rga-section">
        {sectionHead(t.revTitle, t.revSub)}
        <div className="rga-rev-grid">
          {reviews.map((r) => {
            const p = byId.get(r.product)!;
            return (
              <div key={r.name} className="rga-rev">
                <div className="rga-rev-top">
                  <div>
                    <p className="rga-rev-name">{r.name}</p>
                    <p className="rga-rev-meta">
                      {lead(p, lang)} · {r.size}
                    </p>
                  </div>
                  <Stars n={r.rating} gold />
                </div>
                <p className="rga-rev-text">{r.text[lang]}</p>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setGuide(true)}
          style={{
            marginTop: "1.8rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "11.5px",
            fontWeight: 300,
            color: "#8e1b2e",
          }}
        >
          <Ruler className="h-4 w-4" strokeWidth={1.5} />
          {t.sizeGuide}
        </button>
      </section>

      {/* Newsletter */}
      <section className="rga-news">
        <div className="rga-wrap rga-news-in">
          <h2 className="rga-head-title">{t.newsTitle}</h2>
          <p className="rga-head-sub" style={{ maxWidth: "30rem", margin: "0.4rem auto 0" }}>
            {t.newsSub}
          </p>
          {subscribed ? (
            <p
              style={{
                marginTop: "1.4rem",
                fontSize: "12.5px",
                fontWeight: 300,
                color: "#8e1b2e",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Check className="h-4 w-4" strokeWidth={1.8} />
              {t.newsDone}
            </p>
          ) : (
            <form className="rga-news-form" onSubmit={subscribe}>
              <input
                type="email"
                required
                placeholder={t.newsPlaceholder}
                className="rga-news-input"
                aria-label={t.newsPlaceholder}
              />
              <button type="submit" className="rga-news-btn">
                {t.newsCta}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer — the legitimacy block. Every field here is deliberately a placeholder. */}
      <footer id="contact" className="rga-foot">
        <div className="rga-wrap">
          <div className="rga-foot-grid">
            <div>
              <div className="rga-brand">
                <Logo className="h-8 w-8" light />
                <span className="rga-brand-name">{biz.name}</span>
              </div>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "12px",
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: "rgba(229,216,201,.7)",
                  maxWidth: "24rem",
                }}
              >
                {t.storyBody}
              </p>
              <div className="rga-social">
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                <TikTok className="h-4 w-4" />
                <Facebook className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <p
                style={{
                  marginTop: "1.2rem",
                  fontSize: "11px",
                  fontWeight: 300,
                  color: "rgba(229,216,201,.6)",
                }}
              >
                {t.csHours}
                <br />
                {biz.phone}
              </p>
            </div>
            <div className="rga-foot-cols">
              <div>
                <p className="rga-foot-h">{t.footShop}</p>
                <div className="rga-foot-links">
                  {categories.slice(1).map((c) => (
                    <span key={c.key}>{lang === "ko" ? c.ko : c.en}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="rga-foot-h">{t.footHelp}</p>
                <div className="rga-foot-links">
                  <span>{t.footSize}</span>
                  <span>{t.footShip}</span>
                  <span>{t.footReturn}</span>
                  <span>{t.footFaq}</span>
                </div>
              </div>
              <div>
                <p className="rga-foot-h">{t.footAbout}</p>
                <div className="rga-foot-links">
                  <span>{t.footStory}</span>
                  <span>{t.footWeavers}</span>
                  <span>{t.footContact}</span>
                </div>
              </div>
              <div>
                <p className="rga-foot-h">{t.payment}</p>
                <div className="rga-foot-pay">
                  {payMethods.map((m) => (
                    <span key={m.key} className="rga-pay">
                      {lang === "ko" ? m.ko : m.en}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="rga-co">
            {company.map((c) => (
              <p key={c.label} className="rga-co-row">
                <b>{t[c.label]}</b> {c.value[lang]}
              </p>
            ))}
            <p className="rga-disclaim">{t.coDisclaimer}</p>
          </div>
        </div>
      </footer>

      {/* App-style bottom bar. Hidden from 768px up — a bottom bar on a desktop looks wrong,
          and the client's real deliverable is an Android app, so demo this on a phone. */}
      <nav className="rga-tabs">
        <button
          type="button"
          className="rga-tab-btn"
          data-on={true}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Home className="h-5 w-5" strokeWidth={1.4} />
          {t.home}
        </button>
        <button type="button" className="rga-tab-btn" onClick={() => pickCategory("All")}>
          <LayoutGrid className="h-5 w-5" strokeWidth={1.4} />
          {t.shop}
        </button>
        <button type="button" className="rga-tab-btn" onClick={() => pickOccasion("all")}>
          <Sparkles className="h-5 w-5" strokeWidth={1.4} />
          {t.occasions}
        </button>
        <button type="button" className="rga-tab-btn" onClick={() => setAccount(true)}>
          <User className="h-5 w-5" strokeWidth={1.4} />
          {t.account}
        </button>
        <button type="button" className="rga-tab-btn" onClick={() => setOpen(true)}>
          <span style={{ position: "relative" }}>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
            {count > 0 && <span className="rga-count rga-tab">{count}</span>}
          </span>
          {t.cart}
        </button>
      </nav>

      {/* Quick view */}
      {quick && (
        <>
          <div className="rga-scrim" onClick={() => setQuick(null)} />
          <div className="rga-modal">
            <div className="rga-modal-card rga-pop">
              <div className="rga-quick">
                <img src={`${IMG}/${quick.img}.webp`} alt={lead(quick, lang)} />
                <div className="rga-quick-body">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <div>
                      <p className="rga-card-nep">{quick.nepali}</p>
                      <h2 style={{ marginTop: "0.3rem", fontSize: "1.25rem" }}>
                        {lead(quick, lang)}
                      </h2>
                      <p className="rga-card-sub">{sub(quick, lang)}</p>
                    </div>
                    <button type="button" onClick={() => setQuick(null)} aria-label="Close">
                      <X className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                  </div>
                  <p
                    className="rga-tab"
                    style={{ marginTop: "0.9rem", fontSize: "1.05rem", fontWeight: 600 }}
                  >
                    {quick.was && <span className="rga-was">{won(quick.was)}</span>}{" "}
                    {won(quick.price)}
                  </p>
                  <p className="rga-card-rate">
                    <Stars n={quick.rating} />
                    <span>
                      {quick.rating.toFixed(1)} ({quick.reviews})
                    </span>
                  </p>

                  <p className="rga-card-nep" style={{ marginTop: "1.1rem" }}>
                    {t.aboutThis}
                  </p>
                  <p className="rga-gloss-d" style={{ marginTop: "0.4rem" }}>
                    {quick.about[lang]}
                  </p>

                  <div style={{ marginTop: "1.3rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p className="rga-field-label" style={{ fontSize: "11px", color: "#8a7263" }}>
                        {t.selectSize}
                      </p>
                      <button
                        type="button"
                        onClick={() => setGuide(true)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "11px",
                          fontWeight: 300,
                          color: "#8e1b2e",
                        }}
                      >
                        <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {t.sizeGuide}
                      </button>
                    </div>
                    <div className="rga-sizes">
                      {quick.sizes.map((s) => {
                        const out = quick.soldOut?.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={out}
                            title={out ? t.soldOut : undefined}
                            data-on={pickedSize === s}
                            className="rga-size"
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
                      <p style={{ marginTop: "0.5rem", fontSize: "11px", color: "#8e1b2e" }}>
                        {t.sizeRequired}
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: "1.1rem" }}>
                    <p style={{ fontSize: "11px", color: "#8a7263" }}>{t.selectColour}</p>
                    <div className="rga-swatches">
                      {quick.colours.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          data-on={pickedColour === c.name}
                          className="rga-swatch"
                          onClick={() => setPickedColour(c.name)}
                        >
                          <span className="rga-dot" style={{ background: c.hex }} />
                          {colourName(c)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rga-spec">
                    <p className="rga-spec-row">
                      <b>{t.fabric}</b>
                      <span>{quick.fabric[lang]}</span>
                    </p>
                    <p className="rga-spec-row">
                      <b>{t.care}</b>
                      <span>{quick.care[lang]}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addToCart}
                    className="rga-btn"
                    style={{ marginTop: "1.3rem" }}
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
          <div className="rga-scrim" onClick={() => setGuide(false)} />
          <div className="rga-modal">
            <div
              className="rga-modal-card rga-pop"
              style={{ maxWidth: "32rem", padding: "1.6rem" }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <h2 style={{ fontSize: "1.1rem" }}>{t.sizeTitle}</h2>
                <button type="button" onClick={() => setGuide(false)} aria-label="Close">
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <p className="rga-gloss-d" style={{ marginTop: "0.6rem" }}>
                {t.sizeNote}
              </p>
              <table className="rga-table">
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
                      <td style={{ fontWeight: 500 }}>{r.size}</td>
                      <td>{r.bust}</td>
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
          <div className="rga-scrim" onClick={() => setAccount(false)} />
          <aside className="rga-drawer">
            <div className="rga-drawer-head">
              <p className="rga-drawer-title">{t.accountTitle}</p>
              <button type="button" onClick={() => setAccount(false)} aria-label="Close">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="rga-drawer-body">
              <p style={{ fontSize: "10.5px", fontWeight: 300, color: "#8a7263" }}>
                {t.accountDemo}
              </p>
              <p style={{ marginTop: "0.7rem", fontSize: "1.05rem", fontWeight: 600 }}>김서연</p>
              <p style={{ fontSize: "11.5px", fontWeight: 300, color: "#8a7263" }}>
                {t.member} · Gold
              </p>
              <div className="rga-account-rows">
                <div className="rga-account-cell">
                  <p className="rga-account-n rga-tab">3</p>
                  <p className="rga-account-l">{t.orders}</p>
                </div>
                <div className="rga-account-cell">
                  <p className="rga-account-n rga-tab">2</p>
                  <p className="rga-account-l">{t.coupons}</p>
                </div>
                <div className="rga-account-cell">
                  <p className="rga-account-n rga-tab">4,820</p>
                  <p className="rga-account-l">{t.points}</p>
                </div>
              </div>

              <p className="rga-foot-h" style={{ color: "#8a7263", marginTop: "1.6rem" }}>
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
                const colour =
                  o.status === "prep" ? "#b08a52" : o.status === "ship" ? "#8e1b2e" : "#6b8f71";
                return (
                  <div key={o.no} className="rga-order">
                    <img src={`${IMG}/${p.img}-sm.webp`} alt="" loading="lazy" />
                    <div>
                      <p className="rga-line-name">{lead(p, lang)}</p>
                      <p className="rga-line-var">{o.variant}</p>
                      <p className="rga-line-var rga-tab">{o.no}</p>
                      <span className="rga-status" style={{ color: colour, marginTop: "0.35rem" }}>
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: "1.4rem" }}>
                {[t.menuProfile, t.menuWish, t.menuAsk, t.menuHelp].map((m) => (
                  <div key={m} className="rga-menu-row">
                    {m}
                    <ChevronRight
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      style={{ color: "#b3a394" }}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setAccount(false)}
                className="rga-btn-ghost"
                style={{ marginTop: "1.4rem" }}
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
          <div className="rga-scrim" onClick={() => setOpen(false)} />
          <aside className="rga-drawer">
            <div className="rga-drawer-head">
              <p className="rga-drawer-title">
                {step === "checkout" ? t.delivery : step === "done" ? t.orderDone : t.cartTitle}
              </p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {step === "cart" && (
              <>
                <div className="rga-drawer-body">
                  {lines.length === 0 ? (
                    <div style={{ textAlign: "center", paddingTop: "4rem" }}>
                      <ShoppingBag
                        className="h-8 w-8"
                        strokeWidth={1.2}
                        style={{ margin: "0 auto", color: "#d2c0aa" }}
                      />
                      <p style={{ marginTop: "0.9rem", fontSize: "13px", fontWeight: 500 }}>
                        {t.cartEmpty}
                      </p>
                      <p
                        style={{
                          marginTop: "0.3rem",
                          fontSize: "11.5px",
                          fontWeight: 300,
                          color: "#8a7263",
                        }}
                      >
                        {t.cartEmptySub}
                      </p>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rga-btn-ghost"
                        style={{ marginTop: "1.4rem" }}
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
                            fontWeight: 300,
                            color: "#8e1b2e",
                            background: "#fff2e8",
                            padding: "0.6rem 0.75rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {won(toFree)} {t.toFree}
                        </p>
                      )}
                      {lines.map((l) => (
                        <div key={l.key} className="rga-line">
                          <img src={`${IMG}/${l.product.img}-sm.webp`} alt="" loading="lazy" />
                          <div>
                            <p className="rga-line-name">{lead(l.product, lang)}</p>
                            <p className="rga-line-var">
                              {l.size} · {l.colour}
                            </p>
                            <div className="rga-qty">
                              <span className="rga-qty-box">
                                <button
                                  type="button"
                                  className="rga-qty-btn"
                                  onClick={() => change(l.key, -1)}
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3 w-3" strokeWidth={1.8} />
                                </button>
                                <span className="rga-qty-n">{l.qty}</span>
                                <button
                                  type="button"
                                  className="rga-qty-btn"
                                  onClick={() => change(l.key, 1)}
                                  aria-label="Increase"
                                >
                                  <Plus className="h-3 w-3" strokeWidth={1.8} />
                                </button>
                              </span>
                              <span
                                className="rga-tab"
                                style={{ fontSize: "12.5px", fontWeight: 500 }}
                              >
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
                  <div className="rga-drawer-foot">
                    <p className="rga-sum">
                      <span>{t.subtotal}</span>
                      <span className="rga-tab">{won(subtotal)}</span>
                    </p>
                    {saved > 0 && (
                      <p className="rga-sum" style={{ color: "#8e1b2e" }}>
                        <span>{t.youSave}</span>
                        <span className="rga-tab">−{won(saved)}</span>
                      </p>
                    )}
                    <p className="rga-sum">
                      <span>{t.shipping}</span>
                      <span className="rga-tab">{shipping === 0 ? t.free : won(shipping)}</span>
                    </p>
                    <p
                      className="rga-sum rga-sum-total"
                      style={{
                        borderTop: "1px solid #ecdfcc",
                        marginTop: "0.5rem",
                        paddingTop: "0.7rem",
                      }}
                    >
                      <span>{t.total}</span>
                      <span className="rga-tab">{won(subtotal + shipping)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep("checkout")}
                      className="rga-btn"
                      style={{ marginTop: "0.9rem" }}
                    >
                      {t.checkout}
                    </button>
                  </div>
                )}
              </>
            )}

            {step === "checkout" && (
              <form onSubmit={placeOrder} style={{ display: "contents" }}>
                <div className="rga-drawer-body">
                  <div className="rga-field">
                    <label htmlFor="rga-name">{t.fullName}</label>
                    <input id="rga-name" required />
                  </div>
                  <div className="rga-field">
                    <label htmlFor="rga-phone">{t.phone}</label>
                    <input id="rga-phone" required placeholder={biz.phone} inputMode="tel" />
                  </div>
                  <div className="rga-field">
                    <label htmlFor="rga-addr">{t.addr}</label>
                    <input id="rga-addr" required placeholder={t.addrPlaceholder} />
                  </div>
                  <div className="rga-two">
                    <div className="rga-field">
                      <label htmlFor="rga-city">{t.city}</label>
                      <input id="rga-city" required defaultValue={biz.area} />
                    </div>
                    <div className="rga-field">
                      <label htmlFor="rga-post">{t.postcode}</label>
                      <input id="rga-post" required inputMode="numeric" />
                    </div>
                  </div>

                  <p className="rga-foot-h" style={{ color: "#8a7263", marginTop: "1.5rem" }}>
                    {t.payment}
                  </p>
                  <div className="rga-pay-list">
                    {payMethods.map((m, i) => (
                      <label key={m.key} className="rga-pay-opt">
                        <input type="radio" name="rga-pay" defaultChecked={i === 0} />
                        {lang === "ko" ? m.ko : m.en}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rga-drawer-foot">
                  <p className="rga-sum rga-sum-total">
                    <span>{t.total}</span>
                    <span className="rga-tab">{won(subtotal + shipping)}</span>
                  </p>
                  <button type="submit" className="rga-btn" style={{ marginTop: "0.8rem" }}>
                    {t.placeOrder}
                  </button>
                  <button type="button" onClick={() => setStep("cart")} className="rga-btn-ghost">
                    {t.backToCart}
                  </button>
                </div>
              </form>
            )}

            {step === "done" && (
              <div className="rga-drawer-body" style={{ textAlign: "center", paddingTop: "4rem" }}>
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "999px",
                    background: "#8e1b2e",
                    color: "#fff",
                    margin: "0 auto",
                  }}
                >
                  <Check className="h-5 w-5" strokeWidth={2} />
                </span>
                <p style={{ marginTop: "1rem", fontSize: "1.05rem", fontWeight: 600 }}>
                  {t.orderDone}
                </p>
                <p className="rga-gloss-d" style={{ marginTop: "0.5rem" }}>
                  {t.orderDoneSub}
                </p>
                <p
                  className="rga-tab"
                  style={{ marginTop: "1rem", fontSize: "11.5px", color: "#8a7263" }}
                >
                  {t.orderNo} RG-20261023-0001
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setStep("cart");
                  }}
                  className="rga-btn"
                  style={{ marginTop: "1.5rem" }}
                >
                  {t.continueShopping}
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {toast && (
        <div className="rga-toast rga-pop">
          <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
          <span>
            {t.added} — {toast}
          </span>
        </div>
      )}
    </div>
  );
}
