import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Decimal } from "../../components/Decimal";
import "./landing.css";
import { NewsTicker } from "react-announcement-ticker";
import { useHistory } from "react-router";
import {
  VALUATION_PRIMARY_CURRENCY,
  VALUATION_SECONDARY_CURRENCY,
} from "../../constants";
import {
  selectMarkets,
  selectCurrencies,
  selectMarketTickers,
  Market,
  setCurrentMarket,
  selectBlogs,
} from "../../modules";
import Chart from "chart.js/auto";
import {
  useMarketsFetch,
  useMarketsTickersFetch,
  useBlogsFetch,
} from "../../hooks";
import { Link } from "react-router-dom";
import Header from "../../components/header";
import { IonContent, IonHeader, IonPage, IonIcon, IonMenu } from "@ionic/react";
import "@ionic/react/css/ionic-swiper.css";
import {
  megaphoneOutline,
  listOutline,
  bagAddOutline,
  bagRemoveOutline,
  headsetOutline,
  basketOutline,
  arrowForwardOutline,
  radioOutline,
} from "ionicons/icons";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";

const colors = {
  red: {
    default: "rgba(246, 85, 86, 0.1)",
    zero: "rgba(246, 85, 86, 0)",
    full: "rgba(246, 85, 86, 1)",
  },
  green: {
    default: "rgba(4, 204, 67, 0.1)",
    zero: "rgba(4, 204, 67, 0)",
    full: "rgba(4, 204, 67, 1)",
  },
};

const defaultTicker = {
  amount: "0.0",
  last: "0.0",
  high: "0.0",
  open: "0.0",
  low: "0.0",
  price_change_percent: "+0.00%",
  volume: "0.0",
};

const defaultNews = [
  {
    id: 15,
    cover: "https://nagaexchange.co.id/uploads/blog/1669954864_9.png",
    title:
      "Perilisan Stablecoin WEMIX Oleh WeMade Entertainment Yang Didukung USDC",
    category: "BERITA",
    content:
      "JAKARTA, NAGA – WeMade Entertainment atau biasa yang disebut Wemade merupakan perusahaan pengembang video game yang terletak di Korea Selatan.\r\nBaru",
    created_at: "2022-11-10T08:04:07.000000Z",
    slug: "perilisan-stablecoin-wemix-oleh-wemade-entertainment-yang-didukung-usdc",
    url: "https://nagaexchange.co.id/naga-news/berita/perilisan-stablecoin-wemix-oleh-wemade-entertainment-yang-didukung-usdc",
    created_at_f: "3w ago",
  },
  {
    id: 16,
    cover: "https://nagaexchange.co.id/uploads/blog/1669954853_8.png",
    title: "Platform Perdagangan Aset Kripto Mendatang Oleh Bursa Efek Israel",
    category: "BERITA",
    content:
      "JAKARTA, NAGA – Berita mengejutkan datang dari negara Israel yang akan menciptakan platform untuk melakukan perdagangan aset digital berbasis blockc",
    created_at: "2022-11-10T08:08:30.000000Z",
    slug: "platform-perdagangan-aset-kripto-mendatang-oleh-bursa-efek-israel",
    url: "https://nagaexchange.co.id/naga-news/berita/platform-perdagangan-aset-kripto-mendatang-oleh-bursa-efek-israel",
    created_at_f: "3w ago",
  },
  {
    id: 18,
    cover: "https://nagaexchange.co.id/uploads/blog/1669954827_6.png",
    title:
      "Untuk Melindungi Investor Kripto di Indonesia, Bappebti Menerbitkan Regulasi Baru",
    category: "BERITA",
    content:
      "Badan Pengawas Perdagangan Berjangka Komoditi (Bappebti) resmi menerbitkan regulasi baru yaitu Peraturan Bappebti (PerBa) Nomor 13 Tahun 2022 Tentang ",
    created_at: "2022-11-21T03:07:49.000000Z",
    slug: "untuk-melindungi-investor-kripto-di-indonesia-bappebti-menerbitkan-regulasi-baru",
    url: "https://nagaexchange.co.id/naga-news/berita/untuk-melindungi-investor-kripto-di-indonesia-bappebti-menerbitkan-regulasi-baru",
    created_at_f: "2w ago",
  },
];

export const Landing = (props) => {
  const markets = useSelector(selectMarkets);
  const news = useSelector(selectBlogs);
  const currencies = useSelector(selectCurrencies);
  const tickers = useSelector(selectMarketTickers);
  const history = useHistory();
  const dispatch = useDispatch();

  useMarketsTickersFetch();
  useMarketsFetch();
  useBlogsFetch("berita");

  const newsBanner = (news && news.slice(0, 5)) || defaultNews;
  const newsTicker = newsBanner.map(({ title, url }) => ({
    text: title,
    link: url,
  }));

  const refsById = useMemo(() => {
    const refs = {};
    markets.forEach((item) => {
      refs[item.id] = React.createRef();
    });
    return refs;
  }, [markets]);

  const formattedMarkets = markets
    .map((market) => ({
      ...market,
      last: Decimal.format(
        Number((tickers[market.id] || defaultTicker).last),
        market.amount_precision
      ),
      open: Decimal.format(
        Number((tickers[market.id] || defaultTicker).open),
        market.price_precision
      ),
      price_change_percent: String(
        (tickers[market.id] || defaultTicker).price_change_percent
      ),
      high: Decimal.format(
        Number((tickers[market.id] || defaultTicker).high),
        market.amount_precision
      ),
      low: Decimal.format(
        Number((tickers[market.id] || defaultTicker).low),
        market.amount_precision
      ),
      volume: Decimal.format(
        Number((tickers[market.id] || defaultTicker).volume),
        market.amount_precision
      ),
    }))
    .map((market) => ({
      ...market,
      change: Decimal.format(
        (+market.last - +market.open).toFixed(market.price_precision),
        market.price_precision
      ),
    }));

  formattedMarkets.sort(function (a, b) {
    var keyA = parseFloat(a.volume),
      keyB = parseFloat(b.volume);
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });

  const formattedMarketsFilters = formattedMarkets.filter(
    (i) =>
      i.quote_unit.toLowerCase() === VALUATION_PRIMARY_CURRENCY.toLowerCase()
  );
  const slicedMarkets = formattedMarketsFilters.slice(0, 3);

  setTimeout(() => {
    slicedMarkets.map((market) => {
      if (!refsById[market.id].current) return;
      const kline = market.kline || null;
      if (kline) {
        const times = kline.map((obj) => obj[0]);
        const prices = kline.map((obj) => obj[2]);
        const ctx = refsById[market.id].current.getContext("2d");
        const color_full =
          prices[0] < prices[prices.length - 1]
            ? colors.green.full
            : colors.red.full;
        const color_zero =
          prices[0] < prices[prices.length - 1]
            ? colors.green.zero
            : colors.red.zero;
        const color_default =
          prices[0] < prices[prices.length - 1]
            ? colors.green.default
            : colors.red.default;

        let gradient = ctx.createLinearGradient(0, 5, 0, 37);
        gradient.addColorStop(0, color_default);
        gradient.addColorStop(1, color_zero);
        let chart = Chart.getChart(`bannerChart-${market.id}`);
        if (chart == undefined) {
          new Chart(ctx, {
            type: "line",
            data: {
              labels: times,
              datasets: [
                {
                  data: prices,
                  label: "Total",
                  borderColor: color_full,
                  backgroundColor: gradient,
                  borderWidth: 1,
                  pointRadius: 0,
                  pointHitRadius: 0,
                  fill: true,
                },
              ],
            },
            options: {
              plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
              },
              scales: { x: { display: false }, y: { display: false } },
              maintainAspectRatio: false,
              responsive: true,
            },
          });
        }
      }
    });
  }, 100);

  const coin = currencies.filter((i) => i.type === "coin").slice(0, 5);
  const marketChangeColor = (change) => {
    if (change === "0.0" || change === "+0.00") {
      return "";
    }
    return change.includes("+") ? "positive" : "negative";
  };

  const nFormatter = (num, digits) => {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0";
  };

  const EstPrice = (assets) => {
    const pair =
      assets.toLowerCase() + VALUATION_PRIMARY_CURRENCY.toLowerCase();
    const tick = formattedMarkets.find((i) => i.id === pair) || {
      last: 0,
      amount_precision: 0,
    };
    const currencySelect = currencies.find(
      (i) =>
        i.id.toLocaleLowerCase() ===
        VALUATION_SECONDARY_CURRENCY.toLocaleLowerCase()
    ) || { precision: 0 };
    return { price: tick.last, price_precision: currencySelect.precision };
  };

  const handleRedirectToTrading = (id: string) => {
    const currentMarket: Market | undefined = markets.find(
      (item) => item.id === id
    );

    if (currentMarket) {
      props.handleChangeCurrentMarket &&
        props.handleChangeCurrentMarket(currentMarket);
      dispatch(setCurrentMarket(currentMarket));
      history.push(`/user/trading/${currentMarket.id}`);
    }
  };

  const renderLanding = () => {
    return (
      <>
        <IonPage>
          <IonHeader>
            <Header />
          </IonHeader>
          <IonContent className="dark-bg-main landing-content">
            <div className="dark-bg-main">
              <Swiper
                className="banner"
                spaceBetween={30}
                centeredSlides={true}
                modules={[Autoplay]}
                autoplay={{ delay: 2500 }}
              >
                {newsBanner.map((news, index) => (
                  <SwiperSlide key={index}>
                    <div className="mt-0 pt-0">
                      <img
                        src={news.cover}
                        className="images_banner"
                        alt={news.title}
                      />
                      <div className="banner_footer">
                        <div className="mb-0 mobile__title">
                          {news.title.substring(0, 50) + "..."}
                        </div>
                        <div className="mb-0 mobile__text">
                          {news.content.substring(0, 80) + "..."}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="dark-bg-main ion-padding">
              <h5 className="font-bold">For Beginners</h5>
              <h6 className="text-xs grey-text font-normal">
                Most popular and widely known coin for early investment
              </h6>
            </div>
            <div></div>
          </IonContent>
        </IonPage>
      </>
    );
  };

  return renderLanding();
};

export default Landing;
