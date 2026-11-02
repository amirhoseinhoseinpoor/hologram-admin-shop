import localFont from "next/font/local";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/reset.css";
import "./Styles/globals.scss";
import "./Styles/design.scss";
import StoreProvider from "./Store/storeProvider";
import ToasterProvider from "./ToasterProvider";

const myFont = localFont({ src: "./Fonts/IRANSansXVF.ttf" });

export const metadata = {
  title: "آذر هولوگرام",
  description: "پنل مدیریت آذر هولوگرام",
  icons: {
    icon: "/LOGO/cropped-com.chakavak.adv_512x512.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${myFont.className}`}>
        <StoreProvider>
          {children}
          <ToasterProvider />
        </StoreProvider>
      </body>
    </html>
  );
}
