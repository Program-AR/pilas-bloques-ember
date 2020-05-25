import React, {PureComponent} from 'react';
import {Nav, Navbar} from "react-bootstrap";
import fetchAsset from "../../helpers/fetchAsset";

class MyNavbar extends PureComponent {
  render() {
    return <Navbar bg="light">
      <img
          src={fetchAsset('logo.png')}
          className="d-inline-block align-top"
          alt="Pilas bloques logo"
      />
      <Nav className="mr-auto">
        <Nav.Link href="/create">Crear Nivel</Nav.Link>
      </Nav>
    </Navbar>
  }
}

export default MyNavbar;