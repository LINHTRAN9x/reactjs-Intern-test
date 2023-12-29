import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoApp from "../assets/images/logo192.png";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const Header = (props) => {
  const { logout, user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [hideHeader, setHideHeader] = useState(false);

  // useEffect(() => {
  //   if (window.location.pathname === "/login") {
  //     setHideHeader(true);
  //   }
  // }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Log out successfully");
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logoApp}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="logo"
            />
            <span>React-Bootstrap-intern</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {((user && user.auth) || window.location.pathname === "/") && (
              <>
                <Nav className="me-auto justify-content-between">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>

                  <NavLink to="/users" className="nav-link">
                    Manage Users
                  </NavLink>
                </Nav>

                <Nav>
                  {user && user.email && (
                    <span className="nav-link">Welcome {user.email}</span>
                  )}
                  <NavDropdown title="Setting" id="basic-nav-dropdown">
                    {user && user.auth === true ? (
                      <NavDropdown.Item onClick={() => handleLogout()}>
                        Log out
                      </NavDropdown.Item>
                    ) : (
                      <NavLink to="/login" className="dropdown-item">
                        Login
                      </NavLink>
                    )}
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default Header;
