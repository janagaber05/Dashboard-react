import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="profile">
        <img className="avatar" src="/logo192.png" alt="Profile" />
        <div className="name">Jana Gaber</div>
        <div className="email">Janagaber9201@gmail.com</div>
      </div>
      <nav className="nav">
        <NavLink end className="nav-item" to="/">
          Home
        </NavLink>
        <NavLink className="nav-item" to="/messages">
          Messages
        </NavLink>
        <NavLink className="nav-item" to="/categories">
          Categories
        </NavLink>
        <NavLink className="nav-item" to="/settings">
          Settings
        </NavLink>
        <a className="nav-item" href="#logout">
          Log-Out
        </a>
      </nav>
    </aside>
  );
}


