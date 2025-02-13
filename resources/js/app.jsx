import "./bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Diary from "./components/Diary";
import CreateDiary from "./components/diary/CreateDiary";
import EditDiary from "./components/diary/EditDiary";
import Login from "./components/auth/Login";
import Zipcode from "./components/Zipcode";
import axios from "axios";
import PrivateRoute from "./components/auth/PrivateRoute";
import Register from "./components/auth/Register";
import "../css/app.css";

// Setup axios
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

// Buat komponen ProtectedRoute
const ProtectedRoute = ({ children }) => {
    // Cek apakah user sudah login (sesuaikan dengan cara Anda menyimpan status auth)
    const isAuthenticated = localStorage.getItem("token"); // atau cara lain sesuai implementasi Anda

    if (!isAuthenticated) {
        // Redirect ke halaman login jika belum auth
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;
                try {
                    // Verify token validity
                    await axios.get("/api/user");
                } catch (error) {
                    // If token is invalid, remove it
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="min-vh-100 bg-light">
                <NavigationBar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={<Navigate to="/diary" replace />}
                    />
                    <Route
                        path="/diary"
                        element={
                            <PrivateRoute>
                                <Diary />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/diary/create"
                        element={
                            <PrivateRoute>
                                <CreateDiary />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/diary/edit/:id"
                        element={
                            <PrivateRoute>
                                <EditDiary />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/zipcode"
                        element={
                            <ProtectedRoute>
                                <Zipcode />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

if (document.getElementById("app")) {
    const root = ReactDOM.createRoot(document.getElementById("app"));
    root.render(<App />);
}
