import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [savedEmails, setSavedEmails] = useState([]);
    const [showSavedEmails, setShowSavedEmails] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const emails = JSON.parse(localStorage.getItem("savedEmails") || "[]");
        setSavedEmails(emails);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "email" && value.length > 0) {
            setShowSavedEmails(true);
        } else {
            setShowSavedEmails(false);
        }
    };

    const selectEmail = (email) => {
        setFormData((prev) => ({
            ...prev,
            email,
        }));
        setShowSavedEmails(false);
    };

    const saveEmail = (email) => {
        const emails = JSON.parse(localStorage.getItem("savedEmails") || "[]");
        if (!emails.includes(email)) {
            const updatedEmails = [email, ...emails].slice(0, 5);
            localStorage.setItem("savedEmails", JSON.stringify(updatedEmails));
            setSavedEmails(updatedEmails);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/login", formData);
            const token = response.data.token;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            saveEmail(formData.email);

            navigate("/diary");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 position-relative">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        required
                                    />
                                    {showSavedEmails &&
                                        savedEmails.length > 0 && (
                                            <div
                                                className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
                                                style={{ zIndex: 1000 }}
                                            >
                                                {savedEmails
                                                    .filter((email) =>
                                                        email
                                                            .toLowerCase()
                                                            .includes(
                                                                formData.email.toLowerCase()
                                                            )
                                                    )
                                                    .map((email, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-2 cursor-pointer hover-bg-light"
                                                            onClick={() =>
                                                                selectEmail(
                                                                    email
                                                                )
                                                            }
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                            onMouseEnter={(e) =>
                                                                (e.target.style.backgroundColor =
                                                                    "#f8f9fa")
                                                            }
                                                            onMouseLeave={(e) =>
                                                                (e.target.style.backgroundColor =
                                                                    "white")
                                                            }
                                                        >
                                                            {email}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Login
                                    </button>
                                </div>
                                <div className="text-center">
                                    Don't have an account?{" "}
                                    <Link to="/register">Register here</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
