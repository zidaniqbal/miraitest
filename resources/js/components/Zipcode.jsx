import React, { useState, useEffect } from "react";
import {
    Card,
    Button,
    Form,
    Container,
    Row,
    Col,
    Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Zipcode = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [zipData, setZipData] = useState({
        zipcode: "",
        address: "",
    });
    const [formData, setFormData] = useState({
        zipcode: "",
        address: "",
    });
    useEffect(() => {
        fetchZipData();
    }, []);

    const fetchZipData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/zipcode");
            if (response.data) {
                setZipData(response.data);
            }
        } catch (error) {
            console.error("Error fetching zipcode:", error);
            if (error.response && error.response.status === 401) {
                navigate("/login");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setFormData(zipData);
        setIsEditing(true);
    };

    const handleAutoFill = async () => {
        try {
            const response = await fetch(
                `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${formData.zipcode}`
            );
            const data = await response.json();

            if (data.results) {
                const address = data.results
                    .map(
                        (result) =>
                            `${result.address1}${result.address2}${result.address3}`
                    )
                    .join(", ");

                setFormData((prev) => ({
                    ...prev,
                    address: address,
                }));
            } else {
                alert("Kode pos tidak ditemukan");
            }
        } catch (error) {
            console.error("Error fetching zipcode:", error);
            alert("Terjadi kesalahan saat mengambil data");
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.post("/api/zipcode", formData);
            setZipData(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving zipcode:", error);
            alert("Terjadi kesalahan saat menyimpan data");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Container className="py-5">
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    {isLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            {!isEditing ? (
                                <div>
                                    <h4 className="mb-4 fw-bold text-primary">
                                        Informasi Kode Pos
                                    </h4>
                                    <div className="bg-light p-4 rounded mb-4">
                                        <Row className="mb-3">
                                            <Col md={3} className="text-muted">
                                                Kode Pos:
                                            </Col>
                                            <Col className="fw-semibold">
                                                {zipData.zipcode || "-"}
                                            </Col>
                                        </Row>
                                        <Row className="mb-3">
                                            <Col md={3} className="text-muted">
                                                Alamat:
                                            </Col>
                                            <Col className="fw-semibold">
                                                {zipData.address || "-"}
                                            </Col>
                                        </Row>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={handleEdit}
                                        className="px-4"
                                    >
                                        <i className="bi bi-pencil me-2"></i>
                                        Edit
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="mb-4 fw-bold text-primary">
                                        Edit Informasi Kode Pos
                                    </h4>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                Kode Pos
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="zipcode"
                                                value={formData.zipcode}
                                                onChange={handleInputChange}
                                                className="shadow-none"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-semibold">
                                                Alamat
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="shadow-none"
                                            />
                                        </Form.Group>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={handleAutoFill}
                                                className="px-4"
                                            >
                                                <i className="bi bi-search me-2"></i>
                                                Auto Fill
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={handleSave}
                                                className="px-4"
                                            >
                                                <i className="bi bi-check2 me-2"></i>
                                                Save
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Zipcode;
