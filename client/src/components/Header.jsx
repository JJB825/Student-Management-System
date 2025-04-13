import "../App.css";

const Header = () => {
  return (
    <header id="header">
      <nav>
        <div className="container">
          <div className="text-center">
            <a href="/" className="nav-brand text-dark">
              Student Management System
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
