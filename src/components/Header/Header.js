import React, { Component } from 'react';
import { Link } from 'react-router-component';
import look, { StyleSheet } from 'react-look';
import css from './header.css';

const styles = StyleSheet.create(css());
const c = StyleSheet.combineStyles;

const loggedUser = {
  slug: 'slug',
  name: 'name'
};
const links = [
  {label: 'Sobre Nós', url: '/'},
  {label: 'Serviços para Empresas', url: 'http://servicos.atados.com.br'}
];
const show = false;

class Header extends Component {
  render () {
    return (
      <div className={styles.navbar}>
        <ul className={styles.menu}>
          {links.map((link, i) => (
          <li key={i} className={styles.item}>
            <Link className={styles.link} href={link.url}>{link.label}</Link>
          </li>
          ))}
          {show ||
          <li className={c(styles.item, styles.highlight)}>
            <Link className={styles.link} href="/">Login</Link>
          </li>
          }
          {show &&
          <li>
            <Link href="/">
              { loggedUser.slug }
            </Link>
              <ul>
                <li>
                  <Link href="/">Meu perfil</Link>
                </li>
                <li>
                  <Link href="/">Editar perfil</Link>
                </li>
                <li>
                  <Link href="/">Sair</Link>
                </li>
              </ul>
          </li>
          }

          {show &&
          <li>
            <Link href="/">
              { loggedUser.name }
            </Link>
              <ul>
                <li>
                  <Link href="/">Perfil da ONG</Link>
                </li>
                <li>
                  <Link href="/">Editar ONG</Link>
                </li>
                <li>
                  <Link href="/">Painel de controle</Link>
                </li>
                <li>
                  <Link href="/">Criar Vaga</Link>
                </li>
                <li>
                  <Link href="/">Sair</Link>
                </li>
              </ul>
          </li>
          }
        </ul>
      </div>
    );
  }
}

export default Header;
