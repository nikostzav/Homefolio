import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div
      className="bg-warning d-flex align-items-center rounded shadow-sm"
      style={{ minHeight: "56px" }}
    >
      <Link
        to="/"
        className="d-flex align-items-center text-decoration-none mx-3 mx-md-5"
      >
        <span
          className="d-flex align-items-center justify-content-center rounded-circle bg-dark text-warning me-2"
          style={{ width: "34px", height: "34px", fontSize: "1.1rem" }}
        >
          <i className="bi bi-house-heart-fill"></i>
        </span>
        <span className="fs-5 fw-semibold text-dark text-nowrap">
          Homefolio
        </span>
      </Link>
    </div>
  );
};

export default Navbar;
