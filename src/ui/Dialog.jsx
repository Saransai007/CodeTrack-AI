import React, { useState } from "react";

const platformIcons = {
  leetcode: (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      fill="#FFA116"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.9 3.1L10 9l1.4 1.4 5.9-5.9-1.4-1.4zM9.6 9.4L5 14l1.4 1.4 4.6-4.6-1.4-1.4zM12 2c-1.1 0-2 .9-2 2v8h2V4h4v4h2V4c0-1.1-.9-2-2-2h-4zm6 15c0-3.3-2.7-6-6-6v2c2.2 0 4 1.8 4 4h2z" />
    </svg>
  ),
  codechef: (
    <svg
      height="24"
      width="24"
      viewBox="0 0 512 512"
      fill="#5B4638"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="256" cy="256" r="256" fill="#5B4638" />
      <path
        d="M123 161h31v190h-31zM217 161h31v190h-31zM311 161h31v190h-31z"
        fill="#F0E68C"
      />
    </svg>
  ),
  codeforces: (
    <svg
      height="24"
      width="24"
      viewBox="0 0 512 512"
      fill="#1F8ACB"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="256" cy="256" r="256" fill="#1F8ACB" />
      <path d="M181 181h150v150H181z" fill="#fff" />
    </svg>
  ),
};

export default function Dialog() {
  const [form, setForm] = useState({
    leetcode: "",
    codechef: "",
    codeforces: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `LeetCode: ${form.leetcode}\nCodeChef: ${form.codechef}\nCodeforces: ${form.codeforces}`
    );
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "320px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Link Your Profiles</h2>
          <form onSubmit={handleSubmit}>
            {["leetcode", "codechef", "codeforces"].map((platform) => (
              <div
                key={platform}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div style={{ marginRight: "10px" }}>
                  {platformIcons[platform]}
                </div>
                <input
                  type="text"
                  name={platform}
                  placeholder={`${
                    platform.charAt(0).toUpperCase() + platform.slice(1)
                  } Username`}
                  value={form[platform]}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    padding: "8px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            ))}

            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                style={{
                  marginRight: "10px",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "none",
                  background: "#ccc",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
