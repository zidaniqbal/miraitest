import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavigationBar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                    const response = await axios.get("/api/user");
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/api/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);

            // Redirect ke login
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
                    MiraiTest
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/zipcode">
                            Zipcode
                        </Nav.Link>
                    </Nav>
                    {user && (
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-dark">
                                <i className="bi bi-person-circle me-2"></i>
                                {user.name}
                            </span>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleLogout}
                                className="d-flex align-items-center gap-2"
                            >
                                <i className="bi bi-box-arrow-right"></i>
                                Logout
                            </Button>
                        </div>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
