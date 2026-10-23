import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
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
  ShoppingBag,
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

export const Route = createFileRoute("/demos/clothing")({
  validateSearch: validateDemoSearch,
  head: ({ match }) => {
    const base = demoHead(
      "/demos/clothing",
      "SEORI Studio — Online Clothing Store Demo",
      "Sample Korean clothing store by Saphin Praja: Korean/English toggle, best sellers, size and colour picker, size guide, reviews, and KakaoPay / Naver Pay / Toss checkout.",
      match.search.n,
    );
    return {
      ...base,
      links: [
        ...base.links,
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap",
        },
        { rel: "preload", as: "image", href: "/demos/clothing/banner-coat.webp" },
      ],
    };
  },
  component: Clothing,
});

const IMG = "/demos/clothing";

type Lang = "ko" | "en";
type Size = "XS" | "S" | "M" | "L" | "XL";
type Colour = { name: string; hex: string };
type Bi = { ko: string; en: string };

type Product = {
  id: number;
  name: string;
  korean: string;
  category: string;
  price: number;
  was?: number;
  img: string;
  tag?: "NEW";
  fabric: Bi;
  care: Bi;
  rating: number;
  reviews: number;
  colours: Colour[];
  soldOut?: Size[];
};

const SIZES: Size[] = ["XS", "S", "M", "L", "XL"];

const T: Record<Lang, Record<string, string>> = {
  ko: {
    promo: "₩50,000 이상 무료배송 · 14일 이내 무료 반품",
    searchPlaceholder: "코트, 니트, 원피스 검색",
    cart: "장바구니",
    close: "닫기",
    selectSize: "사이즈 선택",
    bestTitle: "베스트",
    bestSub: "지난 7일간 가장 많이 구매한 제품",
    newTitle: "신상품",
    newSub: "이번 주 입고된 제품",
    viewAll: "전체보기",
    itemsSuffix: "개 제품",
    sizeGuide: "사이즈 가이드",
    storyEyebrow: "브랜드 스토리",
    storyTitle1: "서울 성수동에서",
    storyTitle2: "한 벌씩 만듭니다",
    storyBody:
      "2019년 작은 작업실에서 시작했습니다. 유행을 좇기보다 오래 입을 수 있는 옷을 만들고 싶었습니다. 모든 제품은 성수동 자체 공방에서 한 번에 60벌씩 생산하며, 원단과 봉제 공장 정보를 제품 상세에 공개하고 있습니다.",
    st1t: "천연 소재",
    st1d: "메리노, 리넨, 오가닉 코튼, 일본산 데님만 사용합니다",
    st2t: "소량 생산",
    st2d: "재고를 쌓지 않기 위해 한 번에 60벌만 만듭니다",
    st3t: "정직한 실측",
    st3d: "모든 제품을 평평하게 놓고 cm 단위로 실측해 공개합니다",
    reviewsTitle: "구매 후기",
    reviewsSub: "실제 구매 고객이 남긴 후기입니다",
    trust1t: "당일 출고",
    trust1d: "평일 오후 2시 이전 주문 시 당일 출고됩니다",
    trust2t: "14일 무료 반품",
    trust2d: "사이즈 교환 및 반품 배송비를 받지 않습니다",
    trust3t: "안전 결제",
    trust3d: "카카오페이 · 네이버페이 · 토스 · 신용카드",
    newsletterTitle: "신상품 소식 받기",
    newsletterBody: "새 제품과 입고 소식을 한 달에 한 번 보내드립니다.",
    newsletterPlaceholder: "이메일 주소",
    newsletterCta: "구독하기",
    newsletterDone: "구독 신청이 완료되었습니다",
    colour: "색상",
    size: "사이즈",
    fabricLabel: "소재",
    careLabel: "관리 방법",
    addToCart: "장바구니 담기",
    soldOutNote: "품절 · 2주 후 재입고 예정",
    pickSizeFirst: "사이즈를 선택해 주세요",
    reviewsCountSuffix: "개의 후기",
    freeShipNote: "₩50,000 이상 무료배송 · 14일 이내 무료 반품",
    guideIntro:
      "제품을 평평하게 놓고 실측한 수치입니다 (cm). 측정 방법에 따라 2~3cm 오차가 있을 수 있습니다.",
    guideSize: "사이즈",
    guideChest: "가슴단면",
    guideLength: "총장",
    guideShoulder: "어깨너비",
    guideTip: "사이즈가 고민되신다면 한 치수 큰 사이즈를 권해드립니다.",
    checkoutTitle: "주문서",
    orderDone: "주문 완료",
    orderDoneTitle: "주문이 완료되었습니다",
    orderDoneBody:
      "실제 운영 중인 쇼핑몰이라면 지금 주문이 판매자 관리자 페이지로 전달되고, 결제가 승인되고, 판매된 사이즈의 재고가 차감되며, 고객에게 송장번호가 발송됩니다.",
    keepShopping: "계속 쇼핑하기",
    cartEmpty: "장바구니에 담긴 제품이 없습니다",
    name: "받는 분",
    phone: "연락처",
    postcode: "우편번호",
    address: "주소",
    payMethod: "결제수단",
    totalPay: "총 결제금액",
    payNow: "결제하기",
    backToCart: "← 장바구니로 돌아가기",
    moreForFree: "더 구매하시면 무료배송입니다",
    freeUnlocked: "무료배송이 적용되었습니다",
    discount: "할인",
    itemTotal: "상품금액",
    shippingFee: "배송비",
    free: "무료",
    checkout: "주문하기",
    added: "장바구니에 담았습니다",
    tabHome: "홈",
    tabCategory: "카테고리",
    tabSearch: "검색",
    tabCart: "장바구니",
    tabMy: "마이페이지",
    qtyDown: "수량 줄이기",
    qtyUp: "수량 늘리기",
    csTitle: "고객센터",
    csHours: "평일 10:00 – 17:00 (점심 12:00 – 13:00)",
    csClosed: "주말 및 공휴일 휴무",
    companyInfo: "사업자 정보",
    coName: "상호명",
    coCeo: "대표자",
    coReg: "사업자등록번호",
    coMail: "통신판매업신고",
    coPrivacy: "개인정보보호책임자",
    coAddr: "주소",
    coReturn: "반품주소",
    shopInfo: "쇼핑 정보",
    shippingReturns: "배송 및 반품 안내",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    notice: "공지사항",
    faq: "자주 묻는 질문",
    fictional:
      "데모 사이트입니다. 사업자 정보와 제품 정보는 모두 가상이며 실제 판매가 이루어지지 않습니다.",
    sale: "세일",
    seasonAll: "전체 시즌",
    seasonSs: "봄 · 여름",
    seasonFw: "가을 · 겨울",
    accountTitle: "마이페이지",
    accountGreeting: "지은님, 안녕하세요",
    accountTier: "SILVER 회원",
    accountOrders: "주문",
    accountCoupons: "쿠폰",
    accountPoints: "적립금",
    orderHistory: "최근 주문 내역",
    orderDelivered: "배송완료",
    orderShipping: "배송중",
    orderPreparing: "상품준비중",
    orderNo: "주문번호",
    menuOrders: "주문 내역 전체보기",
    menuAddress: "배송지 관리",
    menuCoupons: "쿠폰함",
    menuWishlist: "위시리스트",
    menuInquiry: "1:1 문의",
    menuLogout: "로그아웃",
    accountDemo: "데모 사이트입니다. 실제 계정이 아니며 주문 내역은 예시입니다.",
  },
  en: {
    promo: "Free shipping over ₩50,000 · Free returns within 14 days",
    searchPlaceholder: "Search coats, knitwear, dresses",
    cart: "Cart",
    close: "Close",
    selectSize: "Select size",
    bestTitle: "Best sellers",
    bestSub: "Most purchased over the last 7 days",
    newTitle: "New arrivals",
    newSub: "Added this week",
    viewAll: "View all",
    itemsSuffix: " products",
    sizeGuide: "Size guide",
    storyEyebrow: "OUR STORY",
    storyTitle1: "Made one piece at a time",
    storyTitle2: "in Seongsu-dong, Seoul",
    storyBody:
      "We started in a small studio in 2019. Rather than chase trends, we wanted to make clothes worth keeping. Everything is produced in our own Seongsu-dong workshop in runs of sixty, and we publish our fabric and factory details on every product page.",
    st1t: "Natural fibres",
    st1d: "Merino, linen, organic cotton and Japanese denim only",
    st2t: "Small production runs",
    st2d: "Sixty pieces at a time, so nothing sits in a warehouse",
    st3t: "Honest measurements",
    st3d: "Every garment measured flat and published in centimetres",
    reviewsTitle: "Customer reviews",
    reviewsSub: "Written by verified buyers",
    trust1t: "Same-day dispatch",
    trust1d: "Orders placed before 2pm KST on weekdays ship the same day",
    trust2t: "14-day free returns",
    trust2d: "We cover return and exchange shipping both ways",
    trust3t: "Secure payment",
    trust3d: "KakaoPay · Naver Pay · Toss · Credit card",
    newsletterTitle: "New arrivals by email",
    newsletterBody: "One email a month, when new pieces land. Nothing else.",
    newsletterPlaceholder: "Email address",
    newsletterCta: "Subscribe",
    newsletterDone: "Thanks — you're subscribed",
    colour: "Colour",
    size: "Size",
    fabricLabel: "Fabric",
    careLabel: "Care",
    addToCart: "Add to cart",
    soldOutNote: "sold out · restocking in two weeks",
    pickSizeFirst: "Please choose a size first",
    reviewsCountSuffix: " reviews",
    freeShipNote: "Free shipping over ₩50,000 · free returns within 14 days",
    guideIntro:
      "Measured flat across the garment, in centimetres. Allow 2–3cm either way depending on how it is measured.",
    guideSize: "Size",
    guideChest: "Chest",
    guideLength: "Length",
    guideShoulder: "Shoulder",
    guideTip: "Between sizes? We'd suggest sizing up.",
    checkoutTitle: "Checkout",
    orderDone: "Order placed",
    orderDoneTitle: "Thank you for your order",
    orderDoneBody:
      "On a real store, the order would now reach the seller's admin page, the payment would be captured, stock for that size would be reduced, and the customer would be sent a tracking number.",
    keepShopping: "Continue shopping",
    cartEmpty: "Your cart is empty",
    name: "Recipient",
    phone: "Phone",
    postcode: "Postcode",
    address: "Address",
    payMethod: "Payment method",
    totalPay: "Total",
    payNow: "Place order",
    backToCart: "← Back to cart",
    moreForFree: "more for free shipping",
    freeUnlocked: "Free shipping applied",
    discount: "Discount",
    itemTotal: "Subtotal",
    shippingFee: "Shipping",
    free: "Free",
    checkout: "Checkout",
    added: "Added to cart",
    tabHome: "Home",
    tabCategory: "Category",
    tabSearch: "Search",
    tabCart: "Cart",
    tabMy: "Account",
    qtyDown: "decrease quantity",
    qtyUp: "increase quantity",
    csTitle: "Customer service",
    csHours: "Weekdays 10:00 – 17:00 (lunch 12:00 – 13:00)",
    csClosed: "Closed weekends and public holidays",
    companyInfo: "Company information",
    coName: "Registered name",
    coCeo: "Representative",
    coReg: "Business registration no.",
    coMail: "Mail-order licence",
    coPrivacy: "Privacy officer",
    coAddr: "Address",
    coReturn: "Returns address",
    shopInfo: "Shopping information",
    shippingReturns: "Shipping & returns",
    terms: "Terms of service",
    privacy: "Privacy policy",
    notice: "Notices",
    faq: "FAQ",
    fictional:
      "This is a demo site. The company details and products are fictional and nothing is actually for sale.",
    sale: "Sale",
    seasonAll: "All seasons",
    seasonSs: "Spring / Summer",
    seasonFw: "Autumn / Winter",
    accountTitle: "Account",
    accountGreeting: "Hello, Ji-eun",
    accountTier: "SILVER member",
    accountOrders: "Orders",
    accountCoupons: "Coupons",
    accountPoints: "Points",
    orderHistory: "Recent orders",
    orderDelivered: "Delivered",
    orderShipping: "In transit",
    orderPreparing: "Preparing",
    orderNo: "Order no.",
    menuOrders: "View all orders",
    menuAddress: "Delivery addresses",
    menuCoupons: "My coupons",
    menuWishlist: "Wishlist",
    menuInquiry: "Contact us",
    menuLogout: "Sign out",
    accountDemo: "Demo site — this is not a real account and the orders shown are examples.",
  },
};

const products: Product[] = [
  {
    id: 1,
    name: "Oversized Wool Coat",
    korean: "오버사이즈 울 코트",
    category: "Outer",
    price: 189000,
    img: "wool-coat",
    fabric: { ko: "울 80%, 나일론 20%", en: "80% wool, 20% nylon" },
    care: { ko: "드라이클리닝", en: "Dry clean only" },
    rating: 4.9,
    reviews: 284,
    colours: [
      { name: "Oatmeal", hex: "#d8ccb8" },
      { name: "Charcoal", hex: "#3a3a3c" },
    ],
    soldOut: ["XS"],
  },
  {
    id: 2,
    name: "Quilted Bomber",
    korean: "퀼팅 봄버 자켓",
    category: "Outer",
    price: 129000,
    img: "quilted-bomber",
    fabric: { ko: "리사이클 폴리에스터 100%", en: "100% recycled polyester" },
    care: { ko: "30도 이하 약식 세탁", en: "Gentle machine wash, 30°C" },
    rating: 4.7,
    reviews: 93,
    colours: [
      { name: "Black", hex: "#1c1c1e" },
      { name: "Sage", hex: "#9aa98c" },
    ],
  },
  {
    id: 3,
    name: "Merino Crewneck",
    korean: "메리노 크루넥 니트",
    category: "Knit",
    price: 79000,
    img: "merino-crew",
    fabric: { ko: "엑스트라 파인 메리노 100%", en: "100% extra-fine merino" },
    care: { ko: "손세탁 후 평평하게 건조", en: "Hand wash, dry flat" },
    rating: 4.8,
    reviews: 421,
    colours: [
      { name: "Ivory", hex: "#f1ece3" },
      { name: "Navy", hex: "#2b3550" },
      { name: "Camel", hex: "#c09a6b" },
    ],
  },
  {
    id: 4,
    name: "Cable Cardigan",
    korean: "케이블 가디건",
    category: "Knit",
    price: 98000,
    img: "cable-cardigan",
    tag: "NEW",
    fabric: { ko: "울 70%, 코튼 30%", en: "70% wool, 30% cotton" },
    care: { ko: "손세탁 후 평평하게 건조", en: "Hand wash, dry flat" },
    rating: 4.8,
    reviews: 61,
    colours: [
      { name: "Cream", hex: "#ece4d4" },
      { name: "Moss", hex: "#6f7355" },
    ],
    soldOut: ["XL"],
  },
  {
    id: 5,
    name: "Mohair Half-Zip",
    korean: "모헤어 하프집",
    category: "Knit",
    price: 112000,
    was: 140000,
    img: "mohair-halfzip",
    fabric: { ko: "모헤어 55%, 울 45%", en: "55% mohair, 45% wool" },
    care: { ko: "드라이클리닝", en: "Dry clean only" },
    rating: 4.6,
    reviews: 38,
    colours: [
      { name: "Dusty Blue", hex: "#8fa3b8" },
      { name: "Chocolate", hex: "#5b4435" },
    ],
    soldOut: ["S", "M"],
  },
  {
    id: 6,
    name: "Cotton Oxford Shirt",
    korean: "코튼 옥스포드 셔츠",
    category: "Top",
    price: 59000,
    img: "oxford-shirt",
    fabric: { ko: "오가닉 코튼 100%", en: "100% organic cotton" },
    care: { ko: "세탁기 사용 가능 (찬물)", en: "Machine wash cold" },
    rating: 4.7,
    reviews: 152,
    colours: [
      { name: "White", hex: "#f7f6f3" },
      { name: "Sky", hex: "#b9cad9" },
      { name: "Stripe", hex: "#9fb0c4" },
    ],
  },
  {
    id: 7,
    name: "Boxy Cotton Tee",
    korean: "박시 코튼 티셔츠",
    category: "Top",
    price: 29000,
    img: "boxy-tee",
    fabric: { ko: "코튼 100%, 240g 헤비웨이트", en: "100% cotton, 240gsm" },
    care: { ko: "세탁기 사용 가능 (찬물)", en: "Machine wash cold" },
    rating: 4.9,
    reviews: 719,
    colours: [
      { name: "White", hex: "#f7f6f3" },
      { name: "Black", hex: "#1c1c1e" },
      { name: "Butter", hex: "#efdca8" },
    ],
  },
  {
    id: 8,
    name: "Ribbed Turtleneck",
    korean: "립 터틀넥",
    category: "Top",
    price: 45000,
    img: "ribbed-turtleneck",
    fabric: { ko: "모달 60%, 코튼 40%", en: "60% modal, 40% cotton" },
    care: { ko: "세탁기 사용 가능 (찬물)", en: "Machine wash cold" },
    rating: 4.6,
    reviews: 84,
    colours: [
      { name: "Mocha", hex: "#8b6f5c" },
      { name: "Black", hex: "#1c1c1e" },
    ],
  },
  {
    id: 9,
    name: "Wide-Leg Trousers",
    korean: "와이드 슬랙스",
    category: "Bottom",
    price: 72000,
    img: "wide-trousers",
    tag: "NEW",
    fabric: { ko: "폴리에스터 92%, 스판 8%", en: "92% polyester, 8% elastane" },
    care: { ko: "드라이클리닝 권장", en: "Dry clean recommended" },
    rating: 4.8,
    reviews: 118,
    colours: [
      { name: "Charcoal", hex: "#3a3a3c" },
      { name: "Taupe", hex: "#a79582" },
    ],
  },
  {
    id: 10,
    name: "Straight Denim",
    korean: "스트레이트 데님",
    category: "Bottom",
    price: 89000,
    img: "straight-denim",
    fabric: { ko: "코튼 100%, 13oz 일본산 데님", en: "100% cotton, 13oz Japanese denim" },
    care: { ko: "뒤집어 단독 세탁", en: "Wash inside out, separately" },
    rating: 4.7,
    reviews: 203,
    colours: [
      { name: "Mid Blue", hex: "#5b7794" },
      { name: "Ecru", hex: "#ddd5c4" },
    ],
    soldOut: ["XS", "XL"],
  },
  {
    id: 11,
    name: "Linen Slip Dress",
    korean: "리넨 슬립 원피스",
    category: "Dress",
    price: 96000,
    img: "slip-dress",
    fabric: { ko: "워싱 리넨 100%", en: "100% washed linen" },
    care: { ko: "세탁기 사용 가능 (찬물)", en: "Machine wash cold" },
    rating: 4.8,
    reviews: 57,
    colours: [
      { name: "Sand", hex: "#ded2bd" },
      { name: "Black", hex: "#1c1c1e" },
    ],
  },
  {
    id: 12,
    name: "Pleated Midi Skirt",
    korean: "플리츠 미디 스커트",
    category: "Dress",
    price: 68000,
    was: 85000,
    img: "pleated-skirt",
    fabric: { ko: "리사이클 폴리에스터 100%", en: "100% recycled polyester" },
    care: { ko: "손세탁 권장", en: "Hand wash recommended" },
    rating: 4.7,
    reviews: 92,
    colours: [
      { name: "Pearl", hex: "#e8e3da" },
      { name: "Forest", hex: "#394a3f" },
    ],
  },
  {
    id: 13,
    name: "Long Trench Coat",
    korean: "롱 트렌치 코트",
    category: "Outer",
    price: 219000,
    img: "trench-coat",
    fabric: { ko: "코튼 개버딘 100%", en: "100% cotton gabardine" },
    care: { ko: "드라이클리닝", en: "Dry clean only" },
    rating: 4.9,
    reviews: 312,
    colours: [
      { name: "Camel", hex: "#c9a87c" },
      { name: "Black", hex: "#1c1c1e" },
    ],
    soldOut: ["XS"],
  },
  {
    id: 14,
    name: "Hooded Long Padding",
    korean: "후드 롱 패딩",
    category: "Outer",
    price: 259000,
    img: "long-padding",
    fabric: { ko: "덕다운 80%, 페더 20%", en: "80% duck down, 20% feather" },
    care: { ko: "전문 세탁 권장", en: "Professional clean recommended" },
    rating: 4.8,
    reviews: 187,
    colours: [
      { name: "Black", hex: "#1c1c1e" },
      { name: "Khaki", hex: "#7a7560" },
    ],
  },
  {
    id: 15,
    name: "Tweed Jacket",
    korean: "트위드 자켓",
    category: "Outer",
    price: 168000,
    img: "tweed-jacket",
    tag: "NEW",
    fabric: { ko: "울 혼방 트위드", en: "Wool-blend tweed" },
    care: { ko: "드라이클리닝", en: "Dry clean only" },
    rating: 4.8,
    reviews: 74,
    colours: [
      { name: "Cream", hex: "#eee6d8" },
      { name: "Navy", hex: "#2b3550" },
    ],
  },
  {
    id: 16,
    name: "Wool Muffler",
    korean: "울 머플러",
    category: "Acc",
    price: 49000,
    img: "wool-muffler",
    fabric: { ko: "램스울 100%", en: "100% lambswool" },
    care: { ko: "드라이클리닝", en: "Dry clean only" },
    rating: 4.7,
    reviews: 263,
    colours: [
      { name: "Oatmeal", hex: "#d8ccb8" },
      { name: "Charcoal", hex: "#3a3a3c" },
      { name: "Wine", hex: "#6d3b41" },
    ],
  },
  {
    id: 17,
    name: "Knit Midi Dress",
    korean: "니트 미디 원피스",
    category: "Dress",
    price: 118000,
    img: "knit-dress",
    tag: "NEW",
    fabric: { ko: "울 50%, 아크릴 50%", en: "50% wool, 50% acrylic" },
    care: { ko: "손세탁 후 평평하게 건조", en: "Hand wash, dry flat" },
    rating: 4.8,
    reviews: 96,
    colours: [
      { name: "Grey", hex: "#9b9a97" },
      { name: "Black", hex: "#1c1c1e" },
    ],
  },
  {
    id: 18,
    name: "Wool Blazer",
    korean: "울 블레이저",
    category: "Outer",
    price: 179000,
    img: "wool-blazer",
    fabric: { ko: "울 95%, 스판 5%", en: "95% wool, 5% elastane" },
    care: { ko: "드라이클리닝", en: "Dry clean only" },
    rating: 4.7,
    reviews: 141,
    colours: [
      { name: "Charcoal", hex: "#3a3a3c" },
      { name: "Oatmeal", hex: "#d8ccb8" },
    ],
    soldOut: ["XL"],
  },
  {
    id: 19,
    name: "Linen Shirt",
    korean: "리넨 셔츠",
    category: "Top",
    price: 69000,
    img: "linen-shirt",
    fabric: { ko: "워싱 리넨 100%", en: "100% washed linen" },
    care: { ko: "세탁기 사용 가능 (찬물)", en: "Machine wash cold" },
    rating: 4.8,
    reviews: 228,
    colours: [
      { name: "White", hex: "#f7f6f3" },
      { name: "Sky", hex: "#b9cad9" },
      { name: "Sand", hex: "#ded2bd" },
    ],
  },
  {
    id: 20,
    name: "Sleeveless Knit Vest",
    korean: "슬리브리스 니트 베스트",
    category: "Knit",
    price: 55000,
    img: "knit-vest",
    fabric: { ko: "코튼 70%, 레이온 30%", en: "70% cotton, 30% rayon" },
    care: { ko: "손세탁 권장", en: "Hand wash recommended" },
    rating: 4.6,
    reviews: 112,
    colours: [
      { name: "Cream", hex: "#ece4d4" },
      { name: "Navy", hex: "#2b3550" },
    ],
  },
  {
    id: 21,
    name: "Floral Midi Dress",
    korean: "플로럴 미디 원피스",
    category: "Dress",
    price: 89000,
    img: "floral-dress",
    tag: "NEW",
    fabric: { ko: "레이온 100%", en: "100% rayon" },
    care: { ko: "손세탁 권장", en: "Hand wash recommended" },
    rating: 4.9,
    reviews: 158,
    colours: [
      { name: "Ivory", hex: "#f1ece3" },
      { name: "Sage", hex: "#9aa98c" },
    ],
  },
  {
    id: 22,
    name: "Linen Shorts",
    korean: "리넨 반바지",
    category: "Bottom",
    price: 52000,
    img: "linen-shorts",
    fabric: { ko: "리넨 55%, 코튼 45%", en: "55% linen, 45% cotton" },
    care: { ko: "세탁기 사용 가능 (찬물)", en: "Machine wash cold" },
    rating: 4.6,
    reviews: 87,
    colours: [
      { name: "Sand", hex: "#ded2bd" },
      { name: "Black", hex: "#1c1c1e" },
    ],
  },
  {
    id: 23,
    name: "Cropped Cardigan",
    korean: "크롭 가디건",
    category: "Knit",
    price: 62000,
    img: "crop-cardigan",
    tag: "NEW",
    fabric: { ko: "코튼 80%, 나일론 20%", en: "80% cotton, 20% nylon" },
    care: { ko: "손세탁 권장", en: "Hand wash recommended" },
    rating: 4.7,
    reviews: 134,
    colours: [
      { name: "Butter", hex: "#efdca8" },
      { name: "Ivory", hex: "#f1ece3" },
      { name: "Sage", hex: "#9aa98c" },
    ],
  },
  {
    id: 24,
    name: "Sheer Blouse",
    korean: "시스루 블라우스",
    category: "Top",
    price: 58000,
    img: "sheer-blouse",
    fabric: { ko: "폴리에스터 100%", en: "100% polyester" },
    care: { ko: "손세탁 권장", en: "Hand wash recommended" },
    rating: 4.5,
    reviews: 69,
    colours: [
      { name: "Ivory", hex: "#f1ece3" },
      { name: "Black", hex: "#1c1c1e" },
    ],
  },
];

// Season rail. Anything not listed here is a year-round piece and shows in both.
const season: Record<number, "ss" | "fw"> = {
  1: "fw",
  2: "fw",
  3: "fw",
  4: "fw",
  5: "fw",
  7: "ss",
  8: "fw",
  11: "ss",
  13: "fw",
  14: "fw",
  15: "fw",
  16: "fw",
  17: "fw",
  18: "fw",
  19: "ss",
  20: "ss",
  21: "ss",
  22: "ss",
  23: "ss",
  24: "ss",
};

const byId = new Map(products.map((p) => [p.id, p]));

const banners = [
  {
    img: "banner-coat",
    eyebrow: "2026 AUTUMN / WINTER",
    title: { ko: "코트의 계절", en: "Coat season" },
    sub: { ko: "새 시즌 아우터가 입고되었습니다", en: "New season outerwear has arrived" },
    cta: { ko: "아우터 보기", en: "Shop outerwear" },
    category: "Outer",
    align: "left" as const,
  },
  {
    img: "banner-knit",
    eyebrow: "KNITWEAR",
    title: { ko: "매일의 니트", en: "Everyday knitwear" },
    sub: { ko: "메리노와 울로 짠 기본 니트", en: "Merino and wool basics" },
    cta: { ko: "니트 보기", en: "Shop knitwear" },
    category: "Knit",
    align: "right" as const,
  },
  {
    img: "banner-sale",
    eyebrow: "ARCHIVE",
    title: { ko: "지난 시즌", en: "Last season" },
    sub: { ko: "이전 시즌 제품을 정리합니다", en: "Previous season pieces, reduced" },
    cta: { ko: "전체 보기", en: "View all" },
    category: "All",
    align: "left" as const,
  },
];

const categories: { key: string; ko: string; en: string }[] = [
  { key: "All", ko: "전체", en: "All" },
  { key: "Outer", ko: "아우터", en: "Outerwear" },
  { key: "Knit", ko: "니트", en: "Knitwear" },
  { key: "Top", ko: "상의", en: "Tops" },
  { key: "Bottom", ko: "하의", en: "Bottoms" },
  { key: "Dress", ko: "원피스", en: "Dresses" },
  { key: "Acc", ko: "액세서리", en: "Accessories" },
];

// Example order history for the account panel.
const orders = [
  {
    no: "20261021-0117",
    date: "2026.10.21",
    productId: 21,
    size: "S",
    colour: "Ivory",
    status: "orderPreparing" as const,
  },
  {
    no: "20261020-0094",
    date: "2026.10.20",
    productId: 3,
    size: "M",
    colour: "Camel",
    status: "orderShipping" as const,
  },
  {
    no: "20261018-0042",
    date: "2026.10.18",
    productId: 13,
    size: "M",
    colour: "Camel",
    status: "orderDelivered" as const,
  },
];

const bestIds = [13, 3, 7, 10];
const newIds = [15, 21, 23, 17];

const reviews = [
  {
    name: { ko: "지은", en: "Ji-eun K." },
    fit: { ko: "164cm · 평소 S · S 구매", en: "164cm · usually S · bought S" },
    text: {
      ko: "얇은데 따뜻해서 가을부터 겨울까지 계속 입게 됩니다. 어깨 라인이 상세페이지 실측과 정확히 같았어요.",
      en: "Thin but warm, so I've worn it from autumn right through winter. The shoulder measurement matched the product page exactly.",
    },
    productId: 3,
    img: "merino-crew",
    rating: 5,
  },
  {
    name: { ko: "민서", en: "Minseo P." },
    fit: { ko: "178cm · 평소 M · L 구매", en: "178cm · usually M · bought L" },
    text: {
      ko: "오버핏으로 입고 싶어 한 치수 크게 주문했는데 잘 맞았습니다. 주문 다음 날 출고되어 이틀 만에 받았어요.",
      en: "Ordered a size up for the oversized fit and it was right. Dispatched the next day and arrived within two.",
    },
    productId: 1,
    img: "wool-coat",
    rating: 5,
  },
  {
    name: { ko: "하늘", en: "Haneul L." },
    fit: { ko: "170cm · 평소 M · M 구매", en: "170cm · usually M · bought M" },
    text: {
      ko: "색상이 고민되어 교환했는데 절차가 간단했고 배송비도 들지 않았습니다. 응대도 친절했어요.",
      en: "I exchanged it for a different colour. The process was simple, there was no shipping charge, and support were helpful.",
    },
    productId: 4,
    img: "cable-cardigan",
    rating: 4,
  },
];

const sizeChart: { size: Size; chest: number; length: number; shoulder: number }[] = [
  { size: "XS", chest: 96, length: 62, shoulder: 40 },
  { size: "S", chest: 101, length: 64, shoulder: 42 },
  { size: "M", chest: 106, length: 66, shoulder: 44 },
  { size: "L", chest: 111, length: 68, shoulder: 46 },
  { size: "XL", chest: 116, length: 70, shoulder: 48 },
];

const payMethods = [
  { en: "KakaoPay", ko: "카카오페이" },
  { en: "Naver Pay", ko: "네이버페이" },
  { en: "Toss", ko: "토스" },
  { en: "Card", ko: "신용카드" },
];

// Fictional registration details, clearly labelled as such in the footer.
const company: { label: keyof (typeof T)["ko"]; value: Bi }[] = [
  { label: "coName", value: { ko: "주식회사 서리스튜디오", en: "SEORI STUDIO Co., Ltd." } },
  { label: "coCeo", value: { ko: "김서연", en: "Kim Seo-yeon" } },
  { label: "coReg", value: { ko: "000-00-00000", en: "000-00-00000" } },
  { label: "coMail", value: { ko: "제0000-서울성동-0000호", en: "No. 0000-Seoul-Seongdong-0000" } },
  { label: "coPrivacy", value: { ko: "김서연", en: "Kim Seo-yeon" } },
  {
    label: "coAddr",
    value: {
      ko: "서울특별시 성동구 성수이로 00, 4층",
      en: "4F, 00 Seongsui-ro, Seongdong-gu, Seoul",
    },
  },
  {
    label: "coReturn",
    value: {
      ko: "서울특별시 성동구 성수이로 00, 1층 물류팀",
      en: "1F Logistics, 00 Seongsui-ro, Seongdong-gu, Seoul",
    },
  },
];

const FREE_SHIPPING = 50000;
const SHIPPING_FEE = 3000;
const SLIDE_MS = 5000;

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;
const keyOf = (id: number, size: Size, colour: string) => `${id}|${size}|${colour}`;
const lead = (p: Product, lang: Lang) => (lang === "ko" ? p.korean : p.name);
const sub = (p: Product, lang: Lang) => (lang === "ko" ? p.name : p.korean);

function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="2" fill={light ? "#ffffff" : "#171717"} />
      <path
        d="M25 14.5c-1.1-1.4-2.9-2.2-4.9-2.2-2.9 0-4.9 1.4-4.9 3.6 0 1.9 1.3 2.9 4.1 3.5l1.3.3c2.6.6 3.9 1.6 3.9 3.5 0 2.3-2.1 3.8-5.1 3.8-2.2 0-4-.8-5.1-2.2"
        fill="none"
        stroke={light ? "#171717" : "#ffffff"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TikTok({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.83-2.48v-3.1a5.65 5.65 0 1 0 4.92 5.6V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.24-1.48z" />
    </svg>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-px" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < Math.round(n) ? "fill-neutral-800 text-neutral-800" : "text-neutral-300"
          }`}
        />
      ))}
    </span>
  );
}

function ProductCard({
  p,
  onPick,
  lang,
}: {
  p: Product;
  onPick: (p: Product) => void;
  lang: Lang;
}) {
  const t = T[lang];
  return (
    <article className="group">
      <button
        type="button"
        onClick={() => onPick(p)}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-neutral-100 text-left"
      >
        <img
          src={`${IMG}/${p.img}-sm.webp`}
          alt={lead(p, lang)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
        {p.tag === "NEW" && (
          <span className="absolute left-3 top-3 bg-white/95 px-2 py-1 text-[10px] font-medium tracking-[0.12em] text-neutral-900">
            NEW
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-white/95 py-3 text-center text-[11px] font-medium tracking-[0.08em] text-neutral-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {t.selectSize}
        </span>
      </button>
      <div className="mt-3">
        <p className="truncate text-[13px] font-medium text-neutral-900">{lead(p, lang)}</p>
        <p className="truncate text-[11px] font-light text-neutral-400">{sub(p, lang)}</p>
        <p className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[13px] font-medium">{won(p.price)}</span>
          {p.was && (
            <span className="text-[11px] font-light text-neutral-400 line-through">
              {won(p.was)}
            </span>
          )}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-light text-neutral-500">
          <Stars n={p.rating} />
          <span>{p.rating}</span>
          <span className="text-neutral-300">·</span>
          <span>{p.reviews}</span>
        </p>
        <div className="mt-2 flex gap-1.5">
          {p.colours.map((c) => (
            <span
              key={c.name}
              title={c.name}
              style={{ backgroundColor: c.hex }}
              className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/15"
            />
          ))}
        </div>
      </div>
    </article>
  );
}

function Clothing() {
  const biz = demoBusiness(
    Route.useSearch(),
    {
      name: "SEORI STUDIO",
      area: "Seongsu-dong, Seoul",
      address: "Seongsu-dong, Seongdong-gu, Seoul",
    },
    "#shop",
    KOREA,
  );

  // English by default, like the other two clothing demos, so the page can be reviewed
  // without reading Korean. The KO toggle still flips every string on the page.
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];

  const [category, setCategory] = useState("All");
  const [seasonPick, setSeasonPick] = useState<"all" | "ss" | "fw">("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [slide, setSlide] = useState(0);
  const [guide, setGuide] = useState(false);
  const [account, setAccount] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // The header floats over the hero image until the page scrolls past it.
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
      (seasonPick === "all" || season[p.id] === undefined || season[p.id] === seasonPick),
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

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const toFree = Math.max(0, FREE_SHIPPING - subtotal);
  const saved = lines.reduce(
    (n, l) => n + (l.product.was ? (l.product.was - l.product.price) * l.qty : 0),
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
    setPickedSize(null);
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
  const catLabel = (key: string) => {
    const c = categories.find((x) => x.key === key)!;
    return lang === "ko" ? c.ko : c.en;
  };

  const sectionHead = (title: string, subtitle: string, onView?: () => void) => (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-[17px] font-medium tracking-tight">{title}</h2>
        <p className="mt-1 text-xs font-light text-neutral-500">{subtitle}</p>
      </div>
      {onView && (
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-0.5 text-[11px] font-light text-neutral-500 transition-colors hover:text-neutral-900"
        >
          {t.viewAll} <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="seo min-h-screen bg-white pb-16 text-neutral-900 md:pb-0">
      <style>{`
        .seo { font-family: "Noto Sans KR", ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        .seo-tab { font-variant-numeric: tabular-nums; }
        .seo-foot { display: grid; gap: 2.75rem; }
        .seo-foot-links { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem 1.5rem; }
        .seo-foot-pay { display: flex; flex-wrap: wrap; gap: 0.4rem 1.1rem; }
        @media (min-width: 768px) {
          .seo-foot { grid-template-columns: 1fr 1.15fr; gap: 4.5rem; }
        }
        .seo-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .seo-scroll::-webkit-scrollbar { display: none; }
        @keyframes seo-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .seo-rise { animation: seo-rise 0.8s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes seo-in { from { transform: translateX(100%); } to { transform: none; } }
        .seo-drawer { animation: seo-in 0.32s cubic-bezier(.2,.7,.2,1); }
        @keyframes seo-pop { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .seo-pop { animation: seo-pop 0.26s cubic-bezier(.2,.7,.2,1); }
        @media (prefers-reduced-motion: reduce) {
          .seo-rise, .seo-drawer, .seo-pop { animation: none !important; }
        }
      `}</style>

      <DemoBanner forName={biz.personalised ? biz.name : undefined} />

      <header
        className={`sticky top-0 z-40 transition-colors duration-500 ${
          scrolled ? "bg-white/95 text-neutral-900 backdrop-blur" : "text-white"
        }`}
      >
        <div
          className={`py-2 text-center text-[11px] font-light tracking-wide transition-colors duration-500 ${
            scrolled ? "text-neutral-600" : "text-white/85"
          }`}
        >
          {t.promo}
        </div>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 md:px-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <Logo className="h-7 w-7" light={!scrolled} />
            <span className="text-[15px] font-medium tracking-[0.18em]">{biz.name}</span>
          </a>
          <div className="relative hidden max-w-xs flex-1 md:block">
            <Search
              className={`absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-500 ${
                scrolled ? "text-neutral-400" : "text-white/70"
              }`}
            />
            <div
              className={`w-full border-b py-2 text-xs font-light transition-colors duration-500 ${
                scrolled ? "border-neutral-200 text-neutral-400" : "border-white/40 text-white/70"
              }`}
              style={{ paddingLeft: "1.5rem" }}
            >
              {t.searchPlaceholder}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <div
              className="flex items-center text-[11px] font-light"
              role="group"
              aria-label="Language"
            >
              {(["en", "ko"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i === 1 && (
                    <span className={scrolled ? "px-1.5 text-neutral-300" : "px-1.5 text-white/40"}>
                      |
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`transition-colors ${
                      lang === l ? "font-medium" : scrolled ? "text-neutral-400" : "text-white/60"
                    }`}
                  >
                    {l === "ko" ? "KO" : "EN"}
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t.cart}
              className="relative inline-flex items-center"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {count > 0 && (
                <span
                  className={`seo-tab absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-medium transition-colors duration-500 ${
                    scrolled ? "bg-neutral-900 text-white" : "bg-white text-neutral-900"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        <nav
          className={`seo-scroll overflow-x-auto border-b transition-colors duration-500 ${
            scrolled ? "border-neutral-100" : "border-white/20"
          }`}
        >
          <div className="mx-auto flex max-w-6xl px-5 md:px-6" style={{ gap: "1.75rem" }}>
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => pickCategory(c.key)}
                className={`shrink-0 border-b py-3.5 text-[12px] tracking-wide transition-colors ${
                  category === c.key
                    ? scrolled
                      ? "border-neutral-900 font-medium text-neutral-900"
                      : "border-white font-medium text-white"
                    : scrolled
                      ? "border-transparent font-light text-neutral-500 hover:text-neutral-900"
                      : "border-transparent font-light text-white/70 hover:text-white"
                }`}
              >
                {lang === "ko" ? c.ko : c.en}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Campaign banner — runs to the very top, behind the floating header */}
      <section id="top" className="relative" style={{ marginTop: "-9.25rem" }}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 sm:aspect-[16/9] md:aspect-[21/9]">
          {banners.map((b, i) => (
            <img
              key={b.img}
              src={`${IMG}/${b.img}.webp`}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === slide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* Top scrim keeps the floating header legible over light imagery */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: "230px",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.58), rgba(0,0,0,0))",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.05) 45%, rgba(0,0,0,0))",
            }}
          />
          <div
            className={`absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-12 text-white md:px-6 md:pb-16 ${
              banner.align === "right" ? "md:text-right" : ""
            }`}
          >
            <p className="seo-rise text-[10px] font-light tracking-[0.35em] text-white/80">
              {banner.eyebrow}
            </p>
            <h1 className="seo-rise mt-3 text-3xl font-medium tracking-tight md:text-5xl">
              {banner.title[lang]}
            </h1>
            <p className="seo-rise mt-2 text-sm font-light text-white/85">{banner.sub[lang]}</p>
            <button
              type="button"
              onClick={() => pickCategory(banner.category)}
              className="seo-rise mt-6 inline-flex items-center gap-1.5 border border-white/70 px-7 py-3 text-[11px] font-light tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-neutral-900"
            >
              {banner.cta[lang]}
            </button>
          </div>
          <div className="seo-tab absolute bottom-6 right-5 text-[11px] font-light text-white/80 md:right-6">
            {String(slide + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-6">
        {sectionHead(t.bestTitle, t.bestSub, () => pickCategory("All"))}
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {bestIds.map((id) => (
            <ProductCard key={id} p={byId.get(id)!} onPick={openQuick} lang={lang} />
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="border-y border-neutral-100 bg-neutral-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-6">
          <div className="grid grid-cols-2 gap-3">
            <img
              src={`${IMG}/lookbook-a-sm.webp`}
              alt=""
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
            <img
              src={`${IMG}/lookbook-b-sm.webp`}
              alt=""
              loading="lazy"
              className="mt-10 aspect-[3/4] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[10px] font-light tracking-[0.35em] text-neutral-500">
              {t.storyEyebrow}
            </p>
            <h2 className="mt-4 text-2xl font-medium leading-snug tracking-tight md:text-3xl">
              {t.storyTitle1}
              <br />
              {t.storyTitle2}
            </h2>
            <p className="mt-5 text-[13px] font-light leading-[1.9] text-neutral-600">
              {t.storyBody}
            </p>
            <div className="mt-8 space-y-4 border-t border-neutral-200 pt-7">
              {[
                [t.st1t, t.st1d],
                [t.st2t, t.st2d],
                [t.st3t, t.st3d],
              ].map(([title, desc]) => (
                <div key={title}>
                  <p className="text-[13px] font-medium">{title}</p>
                  <p className="mt-1 text-xs font-light leading-relaxed text-neutral-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-6">
        {sectionHead(t.newTitle, t.newSub, () => pickCategory("All"))}
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {newIds.map((id) => (
            <ProductCard key={id} p={byId.get(id)!} onPick={openQuick} lang={lang} />
          ))}
        </div>
      </section>

      {/* Full catalogue */}
      <section
        id="shop"
        className="mx-auto max-w-6xl border-t border-neutral-100 px-5 py-14 md:px-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[17px] font-medium tracking-tight">{catLabel(category)}</h2>
            <p className="mt-1 text-xs font-light text-neutral-500">
              {visible.length}
              {t.itemsSuffix}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 text-[11px]">
              {(
                [
                  ["all", t.seasonAll],
                  ["ss", t.seasonSs],
                  ["fw", t.seasonFw],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSeasonPick(key)}
                  aria-pressed={seasonPick === key}
                  className={`border-b pb-0.5 transition-colors ${
                    seasonPick === key
                      ? "border-neutral-900 font-medium text-neutral-900"
                      : "border-transparent font-light text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setGuide(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-light text-neutral-500 transition-colors hover:text-neutral-900"
            >
              <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t.sizeGuide}
            </button>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} p={p} onPick={openQuick} lang={lang} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-6">
          {sectionHead(t.reviewsTitle, t.reviewsSub)}
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.img} className="flex gap-4 bg-white p-5">
                <img
                  src={`${IMG}/${r.img}-sm.webp`}
                  alt=""
                  loading="lazy"
                  className="h-24 w-20 shrink-0 object-cover"
                />
                <div className="min-w-0">
                  <Stars n={r.rating} />
                  <blockquote className="mt-2 text-[12px] font-light leading-[1.8] text-neutral-700">
                    {r.text[lang]}
                  </blockquote>
                  <figcaption className="mt-3 text-[11px] font-light text-neutral-500">
                    <span className="font-medium text-neutral-900">{r.name[lang]}</span> ·{" "}
                    {r.fit[lang]}
                    <br />
                    <span className="text-neutral-400">{lead(byId.get(r.productId)!, lang)}</span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Service */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            [Truck, t.trust1t, t.trust1d],
            [Check, t.trust2t, t.trust2d],
            [ShoppingBag, t.trust3t, t.trust3d],
          ].map(([Icon, title, desc], i) => {
            const I = Icon as typeof Truck;
            return (
              <div key={i} className="border-t border-neutral-200 pt-5">
                <I className="h-5 w-5 text-neutral-900" strokeWidth={1.25} />
                <p className="mt-3 text-[13px] font-medium">{title as string}</p>
                <p className="mt-1.5 text-xs font-light leading-relaxed text-neutral-500">
                  {desc as string}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-neutral-100 bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 text-center md:px-6">
          <h2 className="text-[17px] font-medium tracking-tight">{t.newsletterTitle}</h2>
          <p className="mt-2 text-xs font-light text-neutral-400">{t.newsletterBody}</p>
          {subscribed ? (
            <p className="mt-6 text-[13px] font-light text-emerald-300">{t.newsletterDone}</p>
          ) : (
            <form
              onSubmit={subscribe}
              className="mx-auto mt-6 flex max-w-md items-center gap-0 border-b border-neutral-600"
            >
              <label htmlFor="nl-email" className="sr-only">
                {t.newsletterPlaceholder}
              </label>
              <input
                required
                id="nl-email"
                type="email"
                autoComplete="email"
                placeholder={t.newsletterPlaceholder}
                className="w-full bg-transparent py-3 text-sm font-light text-white outline-none placeholder:text-neutral-500"
              />
              <button
                type="submit"
                className="shrink-0 py-3 pl-4 text-[11px] font-light tracking-[0.1em] text-white transition-colors hover:text-neutral-400"
              >
                {t.newsletterCta}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer with full company information */}
      <footer className="border-t border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-6">
          <div className="seo-foot">
            {/* Left: who to contact */}
            <div>
              <div className="flex items-center gap-2.5">
                <Logo className="h-6 w-6" />
                <span className="text-[13px] font-medium tracking-[0.18em]">{biz.name}</span>
              </div>
              <p className="mt-6 text-[11px] font-medium">{t.csTitle}</p>
              <p className="seo-tab mt-1.5 text-xl font-medium tracking-tight">{biz.phone}</p>
              <p className="mt-2 text-[11px] font-light leading-relaxed text-neutral-500">
                {t.csHours}
                <br />
                {t.csClosed}
              </p>

              <div className="mt-6 flex gap-2.5">
                <span
                  aria-label="Instagram"
                  className="grid h-9 w-9 place-items-center border border-neutral-200 text-neutral-600"
                >
                  <Instagram className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span
                  aria-label="TikTok"
                  className="grid h-9 w-9 place-items-center border border-neutral-200 text-neutral-600"
                >
                  <TikTok className="h-4 w-4" />
                </span>
                <span
                  aria-label="Facebook"
                  className="grid h-9 w-9 place-items-center border border-neutral-200 text-neutral-600"
                >
                  <Facebook className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </div>

              <p className="mt-7 text-[11px] font-medium">{t.payMethod}</p>
              <div className="seo-foot-pay mt-3 text-[11px] font-light text-neutral-500">
                {payMethods.map((m) => (
                  <span key={m.en}>{lang === "ko" ? m.ko : m.en}</span>
                ))}
              </div>
            </div>

            {/* Right: the formal detail */}
            <div>
              <p className="text-[11px] font-medium">{t.shopInfo}</p>
              <div className="seo-foot-links mt-4 text-[11px] font-light text-neutral-500">
                <button
                  type="button"
                  onClick={() => setGuide(true)}
                  className="text-left transition-colors hover:text-neutral-900"
                >
                  {t.sizeGuide}
                </button>
                <span>{t.shippingReturns}</span>
                <span>{t.faq}</span>
                <span>{t.notice}</span>
                <span>{t.terms}</span>
                <span>{t.privacy}</span>
              </div>

              <p className="mt-8 text-[11px] font-medium">{t.companyInfo}</p>
              <dl className="mt-4 space-y-2 text-[11px] font-light leading-relaxed text-neutral-500">
                {company.map((row) => (
                  <div key={row.label} className="flex gap-3">
                    <dt className="w-28 shrink-0 text-neutral-400">{t[row.label]}</dt>
                    <dd className="min-w-0">{row.value[lang]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-12 border-t border-neutral-100 pt-6">
            <p className="text-[11px] font-light text-neutral-400">{t.fictional}</p>
            <p className="mt-2 text-[11px] font-light text-neutral-400">
              © {new Date().getFullYear()} {biz.name}
            </p>
          </div>
        </div>
      </footer>

      {/* Quick view */}
      {quick && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center md:p-6"
          onClick={() => setQuick(null)}
        >
          <div
            className="seo-pop grid max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-white md:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={lead(quick, lang)}
          >
            <img
              src={`${IMG}/${quick.img}.webp`}
              alt={lead(quick, lang)}
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="relative p-6 md:p-8">
              <button
                type="button"
                onClick={() => setQuick(null)}
                aria-label={t.close}
                className="absolute right-4 top-4 p-1 text-neutral-400 transition-colors hover:text-neutral-900"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <p className="text-[10px] font-light tracking-[0.3em] text-neutral-400">
                {catLabel(quick.category).toUpperCase()}
              </p>
              <h3 className="mt-2 pr-8 text-xl font-medium tracking-tight">{lead(quick, lang)}</h3>
              <p className="mt-0.5 text-[13px] font-light text-neutral-500">{sub(quick, lang)}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-light text-neutral-500">
                <Stars n={quick.rating} />
                <span>{quick.rating}</span>
                <span className="text-neutral-300">·</span>
                <span>
                  {quick.reviews}
                  {t.reviewsCountSuffix}
                </span>
              </p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-lg font-medium">{won(quick.price)}</span>
                {quick.was && (
                  <span className="text-[13px] font-light text-neutral-400 line-through">
                    {won(quick.was)}
                  </span>
                )}
              </p>

              <dl className="mt-5 space-y-1.5 border-y border-neutral-100 py-4 text-[11px] font-light">
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-neutral-400">{t.fabricLabel}</dt>
                  <dd className="text-neutral-700">{quick.fabric[lang]}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-neutral-400">{t.careLabel}</dt>
                  <dd className="text-neutral-700">{quick.care[lang]}</dd>
                </div>
              </dl>

              <div className="mt-5">
                <p className="text-[11px] font-medium">
                  {t.colour} <span className="font-light text-neutral-500">— {pickedColour}</span>
                </p>
                <div className="mt-2.5 flex gap-2">
                  {quick.colours.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setPickedColour(c.name)}
                      aria-label={c.name}
                      aria-pressed={pickedColour === c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`h-7 w-7 rounded-full ring-1 ring-inset ring-black/15 transition-all ${
                        pickedColour === c.name
                          ? "outline outline-1 outline-offset-2 outline-neutral-900"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium">{t.size}</p>
                  <button
                    type="button"
                    onClick={() => setGuide(true)}
                    className="text-[11px] font-light text-neutral-500 underline underline-offset-2 transition-colors hover:text-neutral-900"
                  >
                    {t.sizeGuide}
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {SIZES.map((s) => {
                    const out = quick.soldOut?.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={out}
                        onClick={() => {
                          setPickedSize(s);
                          setSizeError(false);
                        }}
                        className={`min-w-11 border px-3 py-2.5 text-[12px] transition-colors ${
                          out
                            ? "cursor-not-allowed border-neutral-100 font-light text-neutral-300 line-through"
                            : pickedSize === s
                              ? "border-neutral-900 bg-neutral-900 font-medium text-white"
                              : "border-neutral-200 font-light hover:border-neutral-900"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {quick.soldOut?.length ? (
                  <p className="mt-2 text-[11px] font-light text-neutral-400">
                    {quick.soldOut.join(", ")} {t.soldOutNote}
                  </p>
                ) : null}
                {sizeError && (
                  <p className="mt-2 text-[11px] text-neutral-900" role="alert">
                    {t.pickSizeFirst}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={addToCart}
                className="mt-6 w-full bg-neutral-900 py-4 text-[12px] font-medium tracking-[0.08em] text-white transition-colors hover:bg-neutral-700"
              >
                {t.addToCart}
              </button>
              <p className="mt-2.5 text-center text-[11px] font-light text-neutral-500">
                {t.freeShipNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Size guide */}
      {guide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setGuide(false)}
        >
          <div
            className="seo-pop w-full max-w-lg bg-white p-7"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t.sizeGuide}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium tracking-tight">{t.sizeGuide}</h3>
              <button
                type="button"
                onClick={() => setGuide(false)}
                aria-label={t.close}
                className="p-1 text-neutral-400 transition-colors hover:text-neutral-900"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <p className="mt-3 text-[11px] font-light leading-relaxed text-neutral-600">
              {t.guideIntro}
            </p>
            <table className="seo-tab mt-5 w-full border-collapse text-[13px] font-light">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-[10px] font-medium tracking-wide text-neutral-500">
                  <th className="py-2.5">{t.guideSize}</th>
                  <th className="py-2.5">{t.guideChest}</th>
                  <th className="py-2.5">{t.guideLength}</th>
                  <th className="py-2.5">{t.guideShoulder}</th>
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((r) => (
                  <tr key={r.size} className="border-b border-neutral-100">
                    <td className="py-3 font-medium">{r.size}</td>
                    <td className="py-3 text-neutral-600">{r.chest}</td>
                    <td className="py-3 text-neutral-600">{r.length}</td>
                    <td className="py-3 text-neutral-600">{r.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[11px] font-light text-neutral-500">{t.guideTip}</p>
          </div>
        </div>
      )}

      {/* Cart */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <aside
            className="seo-drawer flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            aria-label={t.cart}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 p-6">
              <h2 className="text-[15px] font-medium tracking-tight">
                {step === "checkout" ? t.checkoutTitle : step === "done" ? t.orderDone : t.cart}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.close}
                className="p-1 text-neutral-400 transition-colors hover:text-neutral-900"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {step === "done" ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-neutral-200">
                  <Check className="h-6 w-6" strokeWidth={1.25} />
                </div>
                <h3 className="mt-6 text-lg font-medium tracking-tight">{t.orderDoneTitle}</h3>
                <p className="mt-3 text-[12px] font-light leading-[1.9] text-neutral-600">
                  {t.orderDoneBody}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep("cart");
                    setOpen(false);
                  }}
                  className="mt-8 bg-neutral-900 px-8 py-3.5 text-[12px] font-medium tracking-[0.08em] text-white"
                >
                  {t.keepShopping}
                </button>
              </div>
            ) : lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="h-9 w-9 text-neutral-200" strokeWidth={1} />
                <p className="mt-4 text-[13px] font-light text-neutral-500">{t.cartEmpty}</p>
              </div>
            ) : step === "checkout" ? (
              <form onSubmit={placeOrder} className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex-1 space-y-5 p-6">
                  {[
                    { id: "co-name", label: t.name, type: "text", auto: "name" },
                    { id: "co-phone", label: t.phone, type: "tel", auto: "tel" },
                    { id: "co-post", label: t.postcode, type: "text", auto: "postal-code" },
                    { id: "co-address", label: t.address, type: "text", auto: "street-address" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="mb-2 block text-[11px] font-medium">
                        {f.label}
                      </label>
                      <input
                        required
                        id={f.id}
                        type={f.type}
                        autoComplete={f.auto}
                        className="w-full border-b border-neutral-200 pb-2 text-[13px] font-light outline-none transition-colors focus:border-neutral-900"
                      />
                    </div>
                  ))}
                  <fieldset className="pt-1">
                    <legend className="mb-2.5 text-[11px] font-medium">{t.payMethod}</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {payMethods.map((m, i) => (
                        <label
                          key={m.en}
                          className="flex cursor-pointer items-center justify-center border border-neutral-200 px-2 py-3 text-center text-[12px] font-light transition-colors has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:font-medium has-[:checked]:text-white"
                        >
                          <input
                            type="radio"
                            name="pay"
                            value={m.en}
                            defaultChecked={i === 0}
                            className="sr-only"
                          />
                          {lang === "ko" ? m.ko : m.en}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="space-y-3 border-t border-neutral-100 p-6">
                  <div className="flex justify-between text-[15px] font-medium">
                    <span>{t.totalPay}</span>
                    <span className="seo-tab">{won(subtotal + shipping)}</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-neutral-900 py-4 text-[12px] font-medium tracking-[0.08em] text-white transition-colors hover:bg-neutral-700"
                  >
                    {t.payNow}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="w-full text-[11px] font-light text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {t.backToCart}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="border-b border-neutral-100 px-6 py-4">
                  <p className="text-[11px] font-light text-neutral-600">
                    {toFree > 0 ? (
                      <>
                        <span className="seo-tab font-medium text-neutral-900">{won(toFree)}</span>{" "}
                        {t.moreForFree}
                      </>
                    ) : (
                      <span className="font-medium text-neutral-900">{t.freeUnlocked}</span>
                    )}
                  </p>
                  <div className="mt-2.5 h-px bg-neutral-100">
                    <div
                      className="h-px bg-neutral-900 transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }}
                    />
                  </div>
                </div>
                <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-6">
                  {lines.map((l) => (
                    <li key={l.key} className="flex items-center gap-4 py-5">
                      <img
                        src={`${IMG}/${l.product.img}-sm.webp`}
                        alt=""
                        className="h-24 w-18 shrink-0 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">{lead(l.product, lang)}</p>
                        <p className="mt-1 text-[11px] font-light text-neutral-500">
                          {l.size} · {l.colour}
                        </p>
                        <p className="seo-tab mt-1.5 text-[13px]">{won(l.product.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 border border-neutral-200 px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => change(l.key, -1)}
                          aria-label={`${lead(l.product, lang)} ${l.size} ${t.qtyDown}`}
                          className="p-1 transition-colors hover:bg-neutral-100"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="seo-tab w-5 text-center text-[13px] font-light">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => change(l.key, 1)}
                          aria-label={`${lead(l.product, lang)} ${l.size} ${t.qtyUp}`}
                          className="p-1 transition-colors hover:bg-neutral-100"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2.5 border-t border-neutral-100 p-6">
                  {saved > 0 && (
                    <div className="flex justify-between text-[11px] font-light text-neutral-600">
                      <span>{t.discount}</span>
                      <span className="seo-tab">−{won(saved)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] font-light text-neutral-600">
                    <span>{t.itemTotal}</span>
                    <span className="seo-tab">{won(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-light text-neutral-600">
                    <span>{t.shippingFee}</span>
                    <span className="seo-tab">{shipping === 0 ? t.free : won(shipping)}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-100 pt-3 text-[15px] font-medium">
                    <span>{t.totalPay}</span>
                    <span className="seo-tab">{won(subtotal + shipping)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className="mt-3 w-full bg-neutral-900 py-4 text-[12px] font-medium tracking-[0.08em] text-white transition-colors hover:bg-neutral-700"
                  >
                    {t.checkout}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* Account */}
      {account && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setAccount(false)}
        >
          <aside
            className="seo-drawer flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            aria-label={t.accountTitle}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 p-6">
              <h2 className="text-[15px] font-medium tracking-tight">{t.accountTitle}</h2>
              <button
                type="button"
                onClick={() => setAccount(false)}
                aria-label={t.close}
                className="p-1 text-neutral-400 transition-colors hover:text-neutral-900"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Who is signed in */}
              <div className="flex items-center gap-4 px-6 py-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500">
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium">{t.accountGreeting}</p>
                  <p className="mt-0.5 text-[11px] font-light tracking-[0.12em] text-neutral-500">
                    {t.accountTier}
                  </p>
                </div>
              </div>

              {/* Orders / coupons / points */}
              <div className="mx-6 grid grid-cols-3 border-y border-neutral-100">
                {[
                  [t.accountOrders, String(orders.length)],
                  [t.accountCoupons, "2"],
                  [t.accountPoints, "3,200"],
                ].map(([label, value], i) => (
                  <div
                    key={label}
                    className={`py-4 text-center ${i < 2 ? "border-r border-neutral-100" : ""}`}
                  >
                    <p className="seo-tab text-lg font-medium">{value}</p>
                    <p className="mt-0.5 text-[11px] font-light text-neutral-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Order history */}
              <div className="px-6 pt-7">
                <p className="text-[11px] font-medium">{t.orderHistory}</p>
                <ul className="mt-4 space-y-4">
                  {orders.map((o) => {
                    const prod = byId.get(o.productId)!;
                    return (
                      <li key={o.no} className="flex gap-4">
                        <img
                          src={`${IMG}/${prod.img}-sm.webp`}
                          alt=""
                          loading="lazy"
                          className="h-24 w-18 shrink-0 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 text-[10px] font-medium ${
                                o.status === "orderDelivered"
                                  ? "bg-neutral-100 text-neutral-600"
                                  : "bg-neutral-900 text-white"
                              }`}
                            >
                              {t[o.status]}
                            </span>
                            <span className="seo-tab text-[11px] font-light text-neutral-400">
                              {o.date}
                            </span>
                          </div>
                          <p className="mt-1.5 truncate text-[13px] font-medium">
                            {lead(prod, lang)}
                          </p>
                          <p className="mt-0.5 text-[11px] font-light text-neutral-500">
                            {o.size} · {o.colour}
                          </p>
                          <p className="seo-tab mt-1 text-[11px] font-light text-neutral-400">
                            {t.orderNo} {o.no}
                          </p>
                        </div>
                        <p className="seo-tab shrink-0 text-[13px]">{won(prod.price)}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Menu */}
              <ul className="mt-8 border-t border-neutral-100">
                {[t.menuOrders, t.menuAddress, t.menuCoupons, t.menuWishlist, t.menuInquiry].map(
                  (label) => (
                    <li key={label}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between border-b border-neutral-100 px-6 py-4 text-left text-[13px] font-light transition-colors hover:bg-neutral-50"
                      >
                        {label}
                        <ChevronRight className="h-4 w-4 text-neutral-300" />
                      </button>
                    </li>
                  ),
                )}
              </ul>

              <div className="px-6 py-6">
                <button
                  type="button"
                  onClick={() => setAccount(false)}
                  className="w-full border border-neutral-200 py-3.5 text-[12px] font-light tracking-[0.08em] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                >
                  {t.menuLogout}
                </button>
                <p className="mt-4 text-[11px] font-light leading-relaxed text-neutral-400">
                  {t.accountDemo}
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Toast */}
      {toast && !open && (
        <div className="seo-pop fixed bottom-20 left-1/2 z-40 -translate-x-1/2 bg-neutral-900 px-5 py-3 text-[11px] font-light text-white shadow-lg md:bottom-6">
          {t.added} · {toast}
        </div>
      )}

      {/* App-style bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-100 bg-white md:hidden">
        <div className="grid grid-cols-5">
          {[
            {
              icon: Home,
              label: t.tabHome,
              action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            },
            { icon: LayoutGrid, label: t.tabCategory, action: () => pickCategory("All") },
            {
              icon: Search,
              label: t.tabSearch,
              action: () => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }),
            },
            { icon: ShoppingBag, label: t.tabCart, action: () => setOpen(true), badge: count },
            { icon: User, label: t.tabMy, action: () => setAccount(true) },
          ].map((tab) => {
            const I = tab.icon;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={tab.action}
                className="relative flex flex-col items-center gap-1 py-2.5 text-neutral-500 active:text-neutral-900"
              >
                <I className="h-5 w-5" strokeWidth={1.4} />
                {tab.badge ? (
                  <span className="seo-tab absolute right-[22%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-neutral-900 px-1 text-[10px] font-medium text-white">
                    {tab.badge}
                  </span>
                ) : null}
                <span className="text-[10px] font-light">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
