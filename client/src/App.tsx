import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero"
import Features from "./components/Features"

function App() {
  return (
    <>
      <Topbar />
      <Navbar />
      <Hero />
      <Features />

      <main>
        <h1>HenEthio Homepage</h1>
      </main>
    </>
  );
}

export default App;