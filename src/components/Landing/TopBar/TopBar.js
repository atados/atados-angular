import React from 'react';
import { Link } from 'react-router-component';
import look, { StyleSheet } from 'react-look';
import css from './topBar.css';

const styles = StyleSheet.create(css());
const pwd = '/components/Landing/TopBar/';

const links = [
  {
    label: 'Vagas de voluntariado',
    url: '/'
  },
  {
    label: 'Cadastre sua ONG',
    url: '/'
  }
];

const TopBar = () => (
  <div className={styles.navbar}>
    <Link className={styles.brand} href="/">
      <img src={`${pwd}/atados-logo-white.png`} alt="Atados" />
    </Link>
    {links.map((link, i) => (
      <Link href="link.url" className={styles.link} key={i}>{link.label}</Link>
    ))}
  </div>
);

export default look(TopBar);
