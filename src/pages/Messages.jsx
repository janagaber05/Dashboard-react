import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./messages.css";

const Row = ({ name, email, subject, date, status, body }) => {
  const navigate = useNavigate();
  const open = () => navigate("/message", { state: { name, email, subject, date, status, body } });
  return (
    <div className="tr">
      <div className="td">{name}</div>
      <div className="td">{email}</div>
      <div className="td">{subject}</div>
      <div className="td">{date}</div>
      <div className="td">{status}</div>
      <div className="td actions">
        <img onClick={open} src={process.env.PUBLIC_URL + "/icons/eye.svg"} alt="view" />
        <img src={process.env.PUBLIC_URL + "/icons/check.svg"} alt="mark" />
        <img src={process.env.PUBLIC_URL + "/icons/trash.svg"} alt="delete" />
      </div>
    </div>
  );
};

export default function Messages() {
  const data = Array.from({ length: 6 }, () => ({
    name: "Salma Ahmed",
    email: "SalmaAhmed12@mail.com",
    subject: "Chance To Work",
    date: "12/5/25",
    status: Math.random() > 0.5 ? "New" : "Read",
    body:
      "Hi, I loved your portfolio and I’d like you to design\n\na website for my bakery. Please contact me...",
  }));
  const [page, setPage] = useState(1);
  const totalPages = 3;
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  return (
    <div className="msgs-wrap">
      <div className="msg-toolbar">
        <label className="radio"><input type="radio" name="f" defaultChecked /> Un Read</label>
        <label className="radio"><input type="radio" name="f" /> Read</label>
        <div style={{ marginLeft: "auto", display: "inline-flex", gap: 10 }}>
          <span className="pill">Total 45</span>
          <span className="pill">New 12</span>
          <span className="pill">Read 15</span>
        </div>
      </div>
      <div className="table">
        <div className="thead">
          <div className="th">Name</div>
          <div className="th">Email</div>
          <div className="th">Subject</div>
          <div className="th">Date</div>
          <div className="th">Status</div>
          <div className="th">Action</div>
        </div>
        <div className="tbody">
          {data.map((r, i) => <Row key={i} {...r} />)}
        </div>
      </div>
      <div className="pg">
        <button onClick={goPrev} className={page === 1 ? "disabled" : ""}>{"«"}</button>
        {[1,2,3].map((n)=>(
          <button key={n} className={"num" + (page===n ? " active" : "")} onClick={()=>setPage(n)}>{n}</button>
        ))}
        <button onClick={goNext} className={page === totalPages ? "disabled" : ""}>{"»"}</button>
      </div>
      <div className="meta">Showing 1-6 of 20 Messages</div>
    </div>
  );
}


