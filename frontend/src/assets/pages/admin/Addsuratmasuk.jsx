import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Spinner } from "react-bootstrap";

const AddSuratmasuk = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const token = localStorage.getItem("token");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fData = new FormData();
        const frmel = event.target;

        for (let el of frmel.elements) {
            if (el.name && el.type !== "file") {
                fData.append(el.name, el.value);
            }
        }

        if (file) {
            fData.append("file", file);
        }

        if (!fData.get("nomor_surat") || !fData.get("pengirim") || !fData.get("perihal")) {
            Swal.fire({
                icon: "error",
                text: "Semua Harus Diisi!",
            });
            return;
        }

        Swal.fire({
            title: "Konfirmasi",
            text: "Apakah Anda yakin ingin menyimpan data ini?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const response = await fetch("http://localhost:3000/api/suratmasuk", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: fData,
                    });

                    if (!response.ok) {
                        Swal.fire({
                            icon: "error",
                            text: "Terjadi kesalahan saat menyimpan data",
                        });
                    } else {
                        event.target.reset();
                        setFile(null);
                        Swal.fire({
                            icon: "success",
                            text: "Simpan berhasil",
                            timer: 1000,
                        }).then(() => {
                            window.location.href = "/admin/suratmasuk";
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        text: "Coba lagi nanti",
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <Container className="p-4">
            <h2 className="mb-4">Tambah Surat Masuk</h2>
            <Card>
                <Card.Header className="bg-white">
                    <Link to="/admin/suratmasuk" className="btn btn-primary">
                        Lihat Data
                    </Link>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nomor Surat</Form.Label>
                                    <Form.Control type="text" name="nomor_surat" placeholder="Masukkan Nomor Surat" required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Tanggal Surat</Form.Label>
                                    <Form.Control type="date" name="tanggal_surat" required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Tanggal Terima</Form.Label>
                                    <Form.Control type="date" name="tanggal_terima" required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Pengirim</Form.Label>
                                    <Form.Control type="text" name="pengirim" placeholder="Masukkan Nama Pengirim" required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Perihal</Form.Label>
                            <Form.Control type="text" name="perihal" placeholder="Masukkan Perihal Surat" required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control type="file" name="file" onChange={handleFileChange} />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Submit"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddSuratmasuk;
