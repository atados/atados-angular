import React from 'react';
import { Link } from 'react-router-component';

const PageNotFound = () => (
  <div id="error404" className="center">
    <h1>Ops! :( </h1>
    <p>Essa página não existe. Entre em contato conosco se você acha que isso é um erro.</p>
    <h3>Aqui está uma foto para <strong>alegrar seu dia!</strong></h3>
    <img alt="Cachorro andando de bicleta." src="/components/PageNotFound/dog-404.jpg" />
    <br />
    <Link href="/" className="btn btn-large btn-info">
      <i className="fa fa-home"></i> Volte para página inicial
    </Link>
  </div>
);

export default PageNotFound;
