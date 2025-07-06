import Heading from "../ui/Heading";
import Row from "../ui/Row";
import RealDash from "../ui/RealDash";
import ThirdDash from "../ui/ThirdDash";
import SecondDash from "../ui/SecondDash";
import { useToggle } from "../ToggleContext";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FakeRealDash from "../ui/FakeRealDash";
import FakeSecondDash from "../ui/FakeSecondDash";
import FakeThreeDash from "../ui/FakeThreeDash";
import Spinner from "../ui/Spinner";
import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { toast, ToastContainer } from "react-toastify";

const StyledDiv = styled.div`
  min-height: 100vh;
  padding-bottom: 2rem;

  @media (max-width: 768px) {
    padding-bottom: 1rem;
  }
`;

const StyleduuDiv = styled.div`
  height: 91vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;

  @media (max-width: 768px) {
    height: 70vh;
    padding: 0 0.5rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    max-width: 320px;
    padding: 16px;
  }
`;

const FormInput = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;

  @media (max-width: 480px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 8px;
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 16px;
  }
`;

function Dashboard() {
  const { toggle } = useToggle();
  const [data, setData] = useState(null);
  const [codeData, setCodeData] = useState(null);
  const [forceData, setForceData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCodeChef, setLoadingCodeChef] = useState(true);
  const [loadingCodeforces, setLoadingCodeforces] = useState(true);
  const [error, setError] = useState(null);
  const [data1, setData1] = useState([]);
  const [codeData1, setCodeData1] = useState([]);
  const [loadingUser1, setLoadingUser1] = useState(true);
  const [loadingCodeChef1, setLoadingCodeChef1] = useState(true);

  const [RatingsForce, setRatingsForce] = useState([]);
  const [RatingsLoading, setRatingsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    leetcode: "",
    codechef: "",
    codeforces: "",
  });
  const [errruu, setErrruu] = useState(false);
  const [leetcodeusername, setLeetcodeusername] = useState("");
  const [codechefusername, setCodechefusername] = useState("");
  const [codeforcesusername, setCodeforcesusername] = useState("");

  const platformIcons = {
    leetcode: <SiLeetcode size={24} />,
    codechef: <SiCodechef size={24} />,
    codeforces: <SiCodeforces size={24} />,
  };

  // Fetch profile once on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8000/api/profiledetails",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 404) {
          setErrruu(true);
          setLoadingUser(false); // Add this line
          setLoadingCodeChef(false); // Add this line
          setLoadingCodeforces(false);
          setLoadingCodeChef1(false);
          setLoadingUser1(false);
          // Add this line

          return;
        }

        if (response.ok) {
          const data = await response.json();
          setLeetcodeusername(data.leetcode);
          setCodechefusername(data.codechef);
          setCodeforcesusername(data.codeforces);
        } else {
          console.error("Failed to fetch profile details");
          setLoadingUser(false); // Also handle other error cases
          setLoadingCodeChef(false);
          setLoadingCodeforces(false);
          setLoadingCodeChef1(false);
          setLoadingUser1(false);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setLoadingUser(false); // Handle catch block too
        setLoadingCodeChef(false);
        setLoadingCodeforces(false);
        setLoadingCodeChef1(false);
        setLoadingUser1(false);
      }
    };

    fetchProfile();
  }, []);

  // Wait for all user
  // names before fetching platform data
  useEffect(() => {
    if (errruu) {
      setLoadingUser(false);
      setLoadingCodeChef(false);
      setLoadingCodeforces(false);
      setLoadingUser1(false);
      setLoadingCodeChef1(false);

      setRatingsLoading(false);
      return;
    }

    if (!leetcodeusername || !codechefusername || !codeforcesusername) return;

    fetch("http://localhost:8000/api/contestlu", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch contest data");
        return res.json();
      })
      .then((data) => {
        // Store all data in a single state object like the second API call
        setRatingsForce(data.codeforcesRatings || null);
        setData1(data.leetcodeRatings || null);
        setCodeData1(data.codechefRatings || null);
      })
      .catch((err) => {
        setError(err.message);
        setErrruu(true);
      })
      .finally(() => {
        setRatingsLoading(false);
        setLoadingUser1(false);
        setLoadingCodeChef1(false);
      });
    fetch(`http://localhost:8000/api/leetcode`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch unified profile stats");
        return res.json();
      })
      .then((data) => {
        // You can split the data and set in respective states if needed
        setData({ leetcodeSolved: data.leetcode }); // adjust if needed
        setCodeData({ codechefSolved: data.codechef }); // internal CodeChef stats
        setForceData({ codeforcesSolved: data.codeforces }); // internal Codeforces stats
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoadingUser(false);
        setLoadingCodeChef(false);
        setLoadingCodeforces(false);
      });

    // External LeetCode Profile (for contest and rank data)

    // External CodeChef
  }, [leetcodeusername, codechefusername, codeforcesusername, errruu]);

  if (
    loadingUser ||
    loadingCodeChef ||
    loadingCodeforces ||
    loadingUser1 ||
    loadingCodeChef1 ||
    RatingsLoading
  ) {
    return (
      <StyleduuDiv>
        <Spinner />
      </StyleduuDiv>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/coding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const resData = await response.json();
      if (response.ok) {
        toast.success("Linked successfully!");
        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, 1500);
      } else {
        toast.error(resData.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
      console.error("Submit error:", err);
    }
  };

  if (error || errruu) {
    return (
      <>
        <ToastContainer />
        <Row type="horizontal">
          <Heading as="h1">Dashboard</Heading>
          <p
            onClick={() => setOpen(true)}
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
          >
            Link Profile
          </p>
          {open && (
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
              onClick={() => setOpen(false)}
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
                <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
                  Link Your Profiles
                </h2>
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
                      onClick={() => setOpen(false)}
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
          )}
        </Row>
        <FakeRealDash />
        <FakeSecondDash />
        <FakeThreeDash />
      </>
    );
  }

  return (
    <StyledDiv>
      <ToastContainer />
      <Row type="horizontal">
        <Heading $toggle={toggle} as="h1">
          Dashboard
        </Heading>
      </Row>
      <RealDash data={data} codeData={codeData} forceData={forceData} />
      <SecondDash
        codeData1={codeData}
        data1={data}
        forceData1={forceData}
        codeData={codeData1}
        data={data1}
        forceData={RatingsForce}
      />
      <ThirdDash codeData={codeData1} data={data1} forceData={RatingsForce} />
    </StyledDiv>
  );
}

export default Dashboard;
