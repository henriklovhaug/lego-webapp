import styles from './ProfileBox.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';
import LoginForm from 'app/components/LoginForm';

const Dropdown = ({ login, logout, user }) => {
  if (user) {
    return (
      <ul className={styles.dropdownList}>
        <li>
          <Link to='/users/me'>
            Min profil
            <Icon name='user' />
          </Link>
        </li>
        <li>
          <Link to='/users/me/settings'>
            Instillinger
            <Icon name='cog' />
          </Link>
        </li>
        <li>
          <a onClick={logout}>
            Logg ut
            <Icon name='sign-out' />
          </a>
        </li>
      </ul>
    );
  }

  return (
    <div className={styles.loginForm}>
      <LoginForm login={login} />
    </div>
  );
};

export default class ProfileBox extends Component {
  state = {
    open: false
  };

  toggleOpen() {
    this.setState({
      ...this.state,
      open: !this.state.open
    });
  }

  render() {
    const { currentUser } = this.props;
    const nameOrLogin = currentUser ? currentUser.username : 'Logg inn';
    const icon = this.state.open ? 'chevron-up' : 'chevron-down';
    return (
      <div className={styles.profile}>
        <div className={styles.bar}>
          <img className={styles.avatar} src={`http://api.adorable.io/avatars/70/${nameOrLogin}.png`}></img>
          <a
            className={styles.user}
            onClick={() => this.toggleOpen()}
          >
            <h3>{nameOrLogin}</h3>
            <Icon className={styles.arrow} name={icon} />
          </a>
        </div>
        {this.state.open && (
          <div>
            <Dropdown
              login={this.props.login}
              logout={this.props.logout}
              user={this.props.currentUser}
            />
          </div>
        )}
      </div>
    );
  }
}
