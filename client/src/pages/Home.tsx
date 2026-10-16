
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Topbar />
      <Navbar />

      <main>
        <Hero />
        <Features />
        <FeaturedProducts />
      </main>

      <Footer />
    </>
  );
}

export default Home;
