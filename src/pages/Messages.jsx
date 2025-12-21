import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import "./messages.css";

const Row = ({ name, email, subject, date, status, body }) => {
  const navigate = useNavigate();
  const open = () => navigate("/message", { state: { name, email, subject, date, status, body } });
  return (
    <div className="tr">
      <div className="td" data-label="Name">{name}</div>
      <div className="td" data-label="Email">{email}</div>
      <div className="td" data-label="Subject">{subject}</div>
      <div className="td" data-label="Date">{date}</div>
      <div className="td" data-label="Status">{status}</div>
      <div className="td actions" data-label="Action">
        <img onClick={open} src={process.env.PUBLIC_URL + "/icons/eye.svg"} alt="view" />
        <img src={process.env.PUBLIC_URL + "/icons/check.svg"} alt="mark" />
        <img src={process.env.PUBLIC_URL + "/icons/trash.svg"} alt="delete" />
      </div>
    </div>
  );
};

export default function Messages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setData(messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(data.length / perPage));
  const paginatedData = data.slice((page - 1) * perPage, page * perPage);
  const newCount = data.filter(m => m.status === "New" || m.status === "Unread").length;
  const readCount = data.filter(m => m.status === "Read").length;

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };
  return (
    <div className="msgs-wrap">
      <div className="msg-toolbar">
        <label className="radio"><input type="radio" name="f" defaultChecked /> Un Read</label>
        <label className="radio"><input type="radio" name="f" /> Read</label>
        <div style={{ marginLeft: "auto", display: "inline-flex", gap: 10 }}>
          <span className="pill">Total {data.length}</span>
          <span className="pill">New {newCount}</span>
          <span className="pill">Read {readCount}</span>
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
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", gridColumn: "1 / -1" }}>Loading messages...</div>
          ) : paginatedData.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", gridColumn: "1 / -1" }}>No messages found</div>
          ) : (
            paginatedData.map((r) => <Row key={r.id} {...r} date={formatDate(r.date || r.created_at)} />)
          )}
        </div>
      </div>
      <div className="pg">
        <button onClick={goPrev} className={page === 1 ? "disabled" : ""}>{"«"}</button>
        {Array.from({ length: totalPages }, (_, n) => n + 1).map((n)=>(
          <button key={n} className={"num" + (page===n ? " active" : "")} onClick={()=>setPage(n)}>{n}</button>
        ))}
        <button onClick={goNext} className={page === totalPages ? "disabled" : ""}>{"»"}</button>
      </div>
      <div className="meta">Showing {paginatedData.length > 0 ? (page - 1) * perPage + 1 : 0}-{Math.min(data.length, page * perPage)} of {data.length} Messages</div>
    </div>
  );
}


