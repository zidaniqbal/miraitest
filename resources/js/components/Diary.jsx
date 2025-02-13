import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

function Diary() {
    const [diaries, setDiaries] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDiary, setSelectedDiary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDiaries();
    }, []);

    const fetchDiaries = async () => {
        try {
            const response = await axios.get("/api/diaries");
            setDiaries(response.data);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch diaries");
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/diaries/${selectedDiary.id}`);
            setDiaries(
                diaries.filter((diary) => diary.id !== selectedDiary.id)
            );
            closeModal();
        } catch (error) {
            setError("Failed to delete diary");
        }
    };

    const closeModal = () => {
        document.body.classList.remove("modal-open");
        setShowDeleteModal(false);
        setSelectedDiary(null);
    };

    const openModal = (diary) => {
        document.body.classList.add("modal-open");
        setSelectedDiary(diary);
        setShowDeleteModal(true);
    };

    if (loading) {
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
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Diaries</h2>
                <Link to="/diary/create" className="btn btn-primary">
                    <i className="bi bi-plus"></i> New Entry
                </Link>
            </div>

            {diaries.length === 0 ? (
                <div className="alert alert-info">
                    No diary entries yet. Create your first entry!
                </div>
            ) : (
                <div className="row">
                    {diaries.map((diary) => (
                        <div key={diary.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                {diary.image && (
                                    <img
                                        src={`/storage/${diary.image}`}
                                        className="card-img-top"
                                        alt="Diary"
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {diary.title}
                                    </h5>
                                    <p className="card-text text-muted">
                                        {format(
                                            new Date(diary.date),
                                            "MMMM dd, yyyy"
                                        )}
                                    </p>
                                    <p className="card-text">
                                        {diary.detail.length > 100
                                            ? `${diary.detail.substring(
                                                  0,
                                                  100
                                              )}...`
                                            : diary.detail}
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="d-flex justify-content-between">
                                        <Link
                                            to={`/diary/edit/${diary.id}`}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            <i className="bi bi-pencil"></i>{" "}
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => openModal(diary)}
                                        >
                                            <i className="bi bi-trash"></i>{" "}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showDeleteModal && (
                <>
                    <div
                        className="modal fade show"
                        style={{ display: "block" }}
                        tabIndex="-1"
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        Confirm Delete
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeModal}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    Are you sure you want to delete "
                                    {selectedDiary?.title}"? This action cannot
                                    be undone.
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="modal-backdrop fade show"
                        onClick={closeModal}
                    ></div>
                </>
            )}
        </div>
    );
}

export default Diary;
