import { Link } from "react-router-dom";

export default function Messages() {
  return (
    <section>
      <h2>Messages</h2>
      <p>List your messages here. Click to view:</p>
      <Link to="/message">Open a message</Link>
    </section>
  );
}


