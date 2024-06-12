import React from "react";
import logo from "../assets/iol.png";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            width="90"
            height="55"
            className="d-inline-block align-top"
            alt="Bootstrap"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span><i className="fa-solid fa-bars"></i></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-5">
            {user ? (
              <>
                <div className="ml-auto">
                  {user.isAdmin && (
                    <li className="nav-item active">
                      <a className="nav-link" href="/admin">
                        <button className="btn btn-dark px-3 py-2">Admin Dashboard</button>
                      </a>
                    </li>
                  )}
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-user"></i> {user.name}
                    </button>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <a className="dropdown-item" href="/profile">
                        Profile
                      </a>
                      <a className="dropdown-item" href="/" onClick={logout}>
                        Logout
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <li className="nav-item active">
                  <a className="nav-link" href="/adminlogin">
                    Admin Login{" "}
                  </a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/register">
                    User Registration{" "}
                  </a>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="/login">
                    User Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
