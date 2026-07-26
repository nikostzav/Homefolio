import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div
      className="bg-warning d-flex justify-content-arround align-items-center gap-5 rounded"
      style={{ minHeight: "50px" }}
    >
      <Link to="/">
        <div className="navbar-brand mx-2 mx-md-5 fs-5 text-nowrap">
          <i className="bi bi-bootstrap mx-2"></i>RealEstate
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
