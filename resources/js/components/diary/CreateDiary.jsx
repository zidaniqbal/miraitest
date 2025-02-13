import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

function CreateDiary() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        detail: "",
        image: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState("");

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

    const TITLE_MAX_LENGTH = 255;
    const DETAIL_MAX_LENGTH = 5000; // Sesuaikan dengan batas di backend

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageError("");

        if (file) {
            // Check file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                setImageError(
                    "File type not allowed. Please use JPG, JPEG or PNG."
                );
                e.target.value = "";
                return;
            }

            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                setImageError("File is too large. Maximum size is 2MB.");
                e.target.value = "";
                return;
            }

            setFormData((prevState) => ({
                ...prevState,
                image: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setImageError("");

        try {
            await axios.get("/sanctum/csrf-cookie");

            const data = new FormData();
            data.append("title", formData.title);
            data.append("date", formData.date);
            data.append("detail", formData.detail);
            if (formData.image) {
                data.append("image", formData.image);
            }

            await axios.post("/api/diaries", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/diary");
        } catch (err) {
            console.error("Error details:", err.response?.data);

            if (err.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                if (validationErrors.image) {
                    setImageError(validationErrors.image[0]);
                }
                setError("Please check the form for errors.");
            } else if (err.response?.status === 413) {
                setImageError("File is too large for the server to process.");
            } else {
                setError("Failed to create diary entry. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Create New Diary Entry</h4>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Title
                                        <span className="text-muted ms-1">
                                            ({formData.title.length}/
                                            {TITLE_MAX_LENGTH})
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        maxLength={TITLE_MAX_LENGTH}
                                        required
                                    />
                                    <small className="text-muted">
                                        Maximum {TITLE_MAX_LENGTH} characters
                                    </small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                    <small className="text-muted">
                                        Today's date is set by default
                                    </small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Detail
                                        <span className="text-muted ms-1">
                                            ({formData.detail.length}/
                                            {DETAIL_MAX_LENGTH})
                                        </span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        name="detail"
                                        value={formData.detail}
                                        onChange={handleChange}
                                        rows="5"
                                        maxLength={DETAIL_MAX_LENGTH}
                                        required
                                    ></textarea>
                                    <small className="text-muted">
                                        Maximum {DETAIL_MAX_LENGTH} characters
                                    </small>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Image
                                        <span className="text-muted ms-1">
                                            (Optional)
                                        </span>
                                    </label>
                                    <input
                                        type="file"
                                        className={`form-control ${
                                            imageError ? "is-invalid" : ""
                                        }`}
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/png,image/jpg"
                                    />
                                    {imageError && (
                                        <div className="invalid-feedback d-block">
                                            {imageError}
                                        </div>
                                    )}
                                    <div className="mt-1">
                                        <small className="text-muted d-block">
                                            • Maximum file size: 2MB
                                        </small>
                                        <small className="text-muted d-block">
                                            • Allowed formats: JPG, JPEG, PNG
                                        </small>
                                        <small className="text-muted d-block">
                                            • Recommended size: 800x600 pixels
                                        </small>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate("/diary")}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading || imageError}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Entry"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateDiary;
