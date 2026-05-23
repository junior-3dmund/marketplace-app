import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="empty-state">
    <h4>Page not found</h4>
    <p>The page you are looking for does not exist.</p>
    <Link className="btn" to="/">Return home</Link>
  </main>
);

export default NotFound;
