import Seo from "@/components/Seo";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const DynamicHome = dynamic(() => import("../components/pages/home"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Seo templateTitle="Home" />
      <Suspense fallback={<p>Loading...</p>}>
        <DynamicHome />;
      </Suspense>
    </>
  );
}
