import Banner from "./components/Banner";
import Features from "./components/Features";
import HomeCta from "./components/HomeCta";
import HomeSections from "./components/HomeSections";

export default function Home() {
  return (
    <main>
      <Banner />
      <Features />
      <HomeSections />
      <HomeCta />
    </main>
  );
}
