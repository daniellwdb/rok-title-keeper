import * as React from "react";
import Footer from "./Footer";
import Header from "./Header";
import clsxm from "@/lib/clsxm";

interface LayoutProps {
  children: React.ReactNode;
  withBackgroundImage?: boolean;
  containerCentered?: boolean;
  marginTop?: number;
}

export default function Layout({
  children,
  withBackgroundImage = false,
  containerCentered = true,
  marginTop,
}: LayoutProps) {
  return (
    <div
      className={clsxm(
        "flex min-h-screen flex-col",
        withBackgroundImage && "bg-cover bg-no-repeat"
      )}
      style={{
        ...(withBackgroundImage && {
          backgroundImage:
            " linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url('/images/rok_wallpaper.webp')",
        }),
      }}
    >
      <Header />
      <div className="overflow-hidden">
        <div
          className={clsxm(
            `mt-${marginTop ?? 28} w-full flex-grow`,
            containerCentered && "mx-auto lg:max-w-7xl"
          )}
        >
          {children}
        </div>
      </div>
      <Footer marginTop={0} />
    </div>
  );
}
