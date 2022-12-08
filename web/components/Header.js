import { Container, Nav, Navbar } from "react-bootstrap";

const Header = () => {

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand>Marketplace</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/store">Store</Nav.Link>
                        <Nav.Link href="/transaction-history">Transaction History</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;