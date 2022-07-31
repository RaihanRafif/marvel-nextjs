import React from "react";
import md5 from 'md5';
import { useState } from 'react';
import { Button, Card, Container, Navbar, Nav, NavDropdown, Form, Modal } from "react-bootstrap";

import getdata from './getdata.module.css'
import _notFound from "./components/404";

const PUBLIC_KEY = process.env.PUBLIC_KEY; // your public key
const PRIVATE_KEY = process.env.PRIVATE_KEY; // youur private key

function Page({ data }) {
    const movieData = data.data.results
    const moviesSorted = movieData.sort((a, b) => a.title.localeCompare(b.title))
    const [movie, setMovie] = useState(moviesSorted)
    const [query, setQuery] = useState("")

    // Modal config
    const [show, setShow] = useState(false);
    const [moviePreview, setMoviePreview] = useState(movie[10])
    const [tagDetail, setTagDetail] = useState(moviePreview.description)

    const changePreview = (movie) => {
        setMoviePreview(movie)
        setTagDetail(movie.description)
    }
    const changeTagDetail = (key) => {
        if (key == "description") {
            setTagDetail(moviePreview.description)
        }
        if (key === "character") {
        }

    }

    async function getDataBonus(key) {
        // Fetch data from external API
        const ts = 1;
        const hash = md5(`${ts + PRIVATE_KEY + PUBLIC_KEY}`)

        const characterQuery = `${key}`

        const res = await fetch(`${characterQuery}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`);
        const data = await res.json()
        if (!data) {
            return {
                notFound: true,
            }
        }

        // Pass data to the page via props
        return data
    }


    return (
        <div className={`container-fluid `} style={{ backgroundImage: `url('../bg-grey.jpg')` }}>
            <div>
                <Modal
                    size={'xl'}
                    show={show}
                    onHide={() => setShow(false)}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            {moviePreview.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={getdata.modalWrapper}>
                            <div className={getdata.modalCover}>
                                <Card.Body >
                                    <Card.Img
                                        variant="top"
                                        src={moviePreview.thumbnail.path + '/portrait_incredible.' + moviePreview.thumbnail.extension}
                                        style={{ width: "20rem", height: "30rem" }}
                                    />
                                </Card.Body>
                            </div>
                            <div className={getdata.modalDetail}>
                                <div className={getdata.modalTags}>
                                    <Nav variant="pills" defaultActiveKey="description">
                                        <Nav.Item>
                                            <Nav.Link eventKey="description" onClick={() => changeTagDetail("description")}>Descriptions</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="Characters" onClick={() => changeTagDetail("character")}>Characters</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="Creators" onClick={() => changeTagDetail("creator")}>Creators</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="Series" onClick={() => changeTagDetail("series")}>Series</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="Stories" onClick={() => changeTagDetail("stories")}>Stories</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="Variants">Variants</Nav.Link>
                                        </Nav.Item>

                                    </Nav>


                                </div>
                                <div className={getdata.modalTagsDetail}>
                                    {tagDetail ? tagDetail : (<_notFound />)}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Navbar className={`fixed-top ${getdata.headerSection}`} style={{ height: "8%" }} bg="light" >
                    <Container fluid>
                        <Navbar.Brand href="#">
                            <img
                                src="/marvel-icon.png"
                                className={`d-inline-block align-top ${getdata.marvelIcon}`}
                                alt="React Bootstrap logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                            </Nav>
                            <Form className="d-flex">
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                    onChange={event => setQuery(event.target.value)}
                                />
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
            <div className={`${getdata.wrapper}`}>
                <div className={getdata.movieSection}>
                    {movie.filter(movie => {
                        if (query === '') {
                            return movie;
                        } else if (movie.title.toLowerCase().includes(query.toLowerCase())) {
                            return movie;
                        }
                    }).map((movie, index) => {
                        return (
                            <Card className={getdata.movieCard} style={{ width: "15rem" }} onClick={() => changePreview(movie)}>
                                <Card.Body style={{ display: "flex", flexDirection: "column" }}>
                                    <Card.Img
                                        variant="top"
                                        src={movie.thumbnail.path + '/portrait_xlarge.' + movie.thumbnail.extension}
                                    // style={{ width: "15rem", height: "15rem" }}
                                    />
                                    <Card.Title style={{ fontSize: "1em", marginTop: "5px" }}>{movie.title}</Card.Title>
                                    {/* <div className={getdata.cardFooter}> */}
                                    <Button variant="primary" className={getdata.buttonPreview} style={{ marginTop: "auto" }} onClick={() => setShow(true)}>
                                        Preview
                                    </Button>
                                    {/* </div> */}
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div >
    )
}

// This gets called on every request
export async function getServerSideProps() {
    // Fetch data from external API
    const ts = 1;
    const hash = md5(`${ts + PRIVATE_KEY + PUBLIC_KEY}`)

    const res = await fetch(`http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`);
    const data = await res.json()
    if (!data) {
        return {
            notFound: true,
        }
    }

    // Pass data to the page via props
    return { props: { data } }
}

export default Page