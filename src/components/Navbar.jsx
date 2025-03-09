import { Link } from "react-router-dom";
import "../styles.css";

const Navbar = ({ setIsFullscreen }) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">♟ Chess Online</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <button className="fullscreen-btn" onClick={toggleFullscreen}>
          Fullscreen
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
