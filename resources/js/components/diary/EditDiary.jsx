import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditDiary() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        detail: "",
        image: null,
    });
    const [currentImage, setCurrentImage] = useState("");
    const [error, setError] = useState("");
    const [imageError, setImageError] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const TITLE_MAX_LENGTH = 255;
    const DETAIL_MAX_LENGTH = 5000;
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

    useEffect(() => {
        fetchDiary();
    }, []);

    const fetchDiary = async () => {
        try {
            const response = await axios.get(`/api/diaries/${id}`);
            const diary = response.data;
            setFormData({
                title: diary.title,
                date: diary.date,
                detail: diary.detail,
                image: null,
            });
            setCurrentImage(diary.image);
            setInitialLoading(false);
        } catch (err) {
            setError("Failed to fetch diary entry");
            setInitialLoading(false);
        }
    };

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
            const data = new FormData();
            data.append("_method", "PUT");
            data.append("title", formData.title);
            data.append("date", formData.date);
            data.append("detail", formData.detail);
            if (formData.image) {
                data.append("image", formData.image);
            }

            await axios.post(`/api/diaries/${id}`, data, {
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
                setError("Failed to update diary entry. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Edit Diary Entry</h4>
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
                                    {currentImage && (
                                        <div className="mb-2">
                                            <img
                                                src={`/storage/${currentImage}`}
                                                alt="Current"
                                                style={{ maxWidth: "200px" }}
                                                className="img-thumbnail"
                                            />
                                            <p className="text-muted mt-1">
                                                Current image
                                            </p>
                                        </div>
                                    )}
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
                                        <small className="text-muted d-block">
                                            • Leave empty to keep current image
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
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Entry"
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

export default EditDiary;
