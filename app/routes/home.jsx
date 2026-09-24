import { useLoaderData } from "react-router";
import { getPublicHomeData } from "../lib/content";
import Hero from "../components/Hero";
import SignalBand from "../components/SignalBand";
import About from "../components/About";
import Divisions from "../components/Divisions";
import Members from "../components/Members";
import Gallery from "../components/Gallery";
import Achievements from "../components/Achievements";
import Events from "../components/Events";
import RecentBlogs from "../components/RecentBlogs";

export async function loader() {
  const homeData = await getPublicHomeData();
  return { homeData };
}

export async function clientLoader() {
  const homeData = await getPublicHomeData();
  return { homeData };
}
clientLoader.hydrate = true;

export default function Home() {
  const { homeData } = useLoaderData();

  return (
    <>
      <Hero counts={homeData.counts} />
      <SignalBand />
      <About counts={homeData.counts} />
      <Divisions divisionCounts={homeData.division_counts} />
      <Members />
      <Gallery />
      <Achievements
        projects={homeData.featured_projects}
        research={homeData.featured_research}
        awards={homeData.recent_awards}
      />
      <Events event={homeData.upcoming_event} />
      <RecentBlogs blogs={homeData.recent_blogs} />
    </>
  );
}
