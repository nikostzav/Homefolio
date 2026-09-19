import { Link } from "react-router-dom";
import ProfileNavbar from "../Components/ProfileNavbar";
import SearchBar from "../Components/SearchBar";
import img from "../bg2.png";
import "./landing.css";

const features = [
  {
    icon: "bi-search-heart",
    title: "Find the right place",
    text: "Filter listings by city, price and type, then compare them on the map.",
  },
  {
    icon: "bi-chat-dots",
    title: "Talk to owners directly",
    text: "Message agents and owners in real time, with no middlemen.",
  },
  {
    icon: "bi-stars",
    title: "Smart recommendations",
    text: "Get suggestions ranked to your priorities, not just the newest ads.",
  },
];

const Index = () => {
  return (
    <div className="landing">
      <section
        className="landing-hero"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="landing-overlay" />

        <header className="landing-nav container">
          <Link to="/" className="landing-brand">
            <span className="landing-logo">
              <i className="bi bi-house-heart-fill"></i>
            </span>
            Homefolio
          </Link>
          <div className="landing-auth">
            <ProfileNavbar />
          </div>
        </header>

        <div className="landing-hero-content container">
          <span className="landing-badge">Real estate, simplified</span>
          <h1>
            Find the place that
            <br />
            feels like <span>home</span>
          </h1>
          <p>
            Browse homes for sale and rent, message owners directly and get
            recommendations tailored to you.
          </p>
          <SearchBar />
        </div>
      </section>

      <section className="landing-features container">
        <h2>Why Homefolio</h2>
        <div className="row g-4">
          {features.map((f) => (
            <div className="col-12 col-md-4" key={f.title}>
              <div className="landing-feature">
                <div className="landing-feature-icon">
                  <i className={`bi ${f.icon}`}></i>
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <span>&copy; {new Date().getFullYear()} Homefolio</span>
          <span>Portfolio project by Nikolaos Tzavellas</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
