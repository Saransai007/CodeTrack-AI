import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useToggle } from "../ToggleContext";

// Language metadata
const languages = {
  python3: { label: "Python", versionIndex: "3", editorLanguage: "python" },
  java: { label: "Java", versionIndex: "4", editorLanguage: "java" },
  cpp17: { label: "C++", versionIndex: "0", editorLanguage: "cpp" },
  c: { label: "C", versionIndex: "5", editorLanguage: "c" },
  javascript: {
    label: "JavaScript",
    versionIndex: "4",
    editorLanguage: "javascript",
  },
};

// Styled components with improved dark mode support
const AppContainer = styled.div`
  height: 91.1vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter",
    sans-serif;
  display: flex;
  flex-direction: column;
  background: ${({ $dark }) => ($dark ? "#111827" : "#f8fafc")};
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  background: ${({ $dark }) =>
    $dark
      ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)"};
  border-bottom: 1px solid ${({ $dark }) => ($dark ? "#374151" : "#e2e8f0")};
  box-shadow: ${({ $dark }) =>
    $dark
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
      : "0 10px 25px -5px rgba(0, 0, 0, 0.1)"};
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: ${({ $dark }) =>
    $dark
      ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeaderSubtitle = styled.p`
  margin: 0.25rem 0 0 0;
  color: ${({ $dark }) => ($dark ? "#9ca3af" : "#64748b")};
  font-size: 0.95rem;
  font-weight: 500;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 1.5rem;
  padding: 2rem;
  min-height: 0;
`;

const Panel = styled.div`
  flex: 1;
  background: ${({ $dark }) =>
    $dark
      ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"};
  border-radius: 20px;
  box-shadow: ${({ $dark }) =>
    $dark
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)"};
  border: 1px solid ${({ $dark }) => ($dark ? "#374151" : "#e2e8f0")};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ $dark }) => ($dark ? "#f9fafb" : "#1e293b")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 0.875rem 1.25rem;
  font-size: 0.95rem;
  border: 2px solid ${({ $dark }) => ($dark ? "#374151" : "#e2e8f0")};
  border-radius: 12px;
  background: ${({ $dark }) => ($dark ? "#374151" : "#ffffff")};
  color: ${({ $dark }) => ($dark ? "#f9fafb" : "#1e293b")};
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: ${({ $dark }) => ($dark ? "#4b5563" : "#cbd5e1")};
  }
`;

const InputArea = styled.textarea`
  width: 100%;
  height: 120px;
  margin-top: 1rem;
  font-size: 0.9rem;
  padding: 1.25rem;
  border: 2px solid ${({ $dark }) => ($dark ? "#374151" : "#e2e8f0")};
  border-radius: 12px;
  resize: vertical;
  background: ${({ $dark }) => ($dark ? "#374151" : "#f8fafc")};
  color: ${({ $dark }) => ($dark ? "#f9fafb" : "#1e293b")};
  font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
    "Courier New", monospace;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${({ $dark }) => ($dark ? "#9ca3af" : "#64748b")};
  }
`;

const RunButton = styled.button`
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EditorContainer = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid ${({ $dark }) => ($dark ? "#374151" : "#e2e8f0")};
  background: ${({ $dark }) => ($dark ? "#1f2937" : "#ffffff")};
  margin-top: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const OutputCard = styled.div`
  background: ${({ $dark }) => ($dark ? "#1f2937" : "#f8fafc")};
  border: 2px solid ${({ $dark }) => ($dark ? "#374151" : "#e2e8f0")};
  border-radius: 16px;
  padding: 1.5rem;
  flex: 1;
  color: ${({ $dark }) => ($dark ? "#f9fafb" : "#1e293b")};
  margin-top: 1rem;
  box-shadow: ${({ $dark }) =>
    $dark
      ? "inset 0 2px 4px rgba(0, 0, 0, 0.2)"
      : "inset 0 2px 4px rgba(0, 0, 0, 0.05)"};
  overflow-x: hidden;
  overflow-y: auto;
`;

const OutputContent = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 1rem;

  pre {
    background: ${({ $dark }) => ($dark ? "#111827" : "#f1f5f9")};
    color: ${({ $dark }) => ($dark ? "#f9fafb" : "#1e293b")};
    padding: 1.25rem;
    border-radius: 8px;
    font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
      "Courier New", monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    border: 1px solid ${({ $dark }) => ($dark ? "#374151" : "#e2e8f0")};
    margin: 0;
  }
`;

const StatusIcon = styled.span`
  font-size: 1.1rem;
`;

const CodeEditor = () => {
  const { toggle } = useToggle();
  const [language, setLanguage] = useState("python3");
  const [code, setCode] = useState(`print("Hello Codetrack!")`);
  const [input, setInput] = useState("");
  const [rawOutput, setRawOutput] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState(
    "Run your code to see AI analysis here!"
  );

  const runCode = async () => {
    setRawOutput("Executing code...");
    setAiAnalysis("Getting AI analysis...");
    const payload = {
      script: code,
      stdin: input,
      language,
      versionIndex: languages[language].versionIndex,
    };

    try {
      const res = await fetch("http://localhost:8000/api/execute-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const outputText =
        data.jdoodle.output?.trim() ||
        data.stdout?.trim() ||
        (data.compilationError &&
          `Compilation Error:\n${data.compilationError}`) ||
        (data.error && `Runtime Error:\n${data.error}`) ||
        "No direct output or error received.";

      setRawOutput(outputText);
      setAiAnalysis(data.analysis || "AI analysis failed or not received.");
    } catch (err) {
      setRawOutput(`Error communicating with backend: ${err.message}`);
      setAiAnalysis("AI analysis could not be performed.");
    }
  };

  return (
    <AppContainer $dark={toggle}>
      <MainContainer $dark={toggle}>
        <Panel $dark={toggle}>
          <SectionTitle $dark={toggle}>💻 Code Editor</SectionTitle>
          <Select
            $dark={toggle}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {Object.entries(languages).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
          <EditorContainer $dark={toggle}>
            <Editor
              height="100%"
              theme={toggle ? "vs-dark" : "light"}
              language={languages[language].editorLanguage}
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
                fontFamily:
                  "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                cursorBlinking: "smooth",
                smoothScrolling: true,
              }}
            />
          </EditorContainer>
        </Panel>

        <Panel $dark={toggle}>
          <SectionTitle $dark={toggle}>⚡ Execution</SectionTitle>
          <InputArea
            $dark={toggle}
            placeholder="Enter input if your program needs it..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <RunButton onClick={runCode}>▶️ Run Code</RunButton>

          <OutputCard $dark={toggle}>
            <SectionTitle $dark={toggle}>
              <StatusIcon>📤</StatusIcon>Code Output
            </SectionTitle>
            <OutputContent $dark={toggle}>
              <pre>{rawOutput}</pre>
            </OutputContent>
          </OutputCard>

          <OutputCard $dark={toggle}>
            <SectionTitle $dark={toggle}>
              <StatusIcon>🤖</StatusIcon>AI Code Analysis
            </SectionTitle>
            <OutputContent $dark={toggle}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                children={aiAnalysis}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dracula}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </OutputContent>
          </OutputCard>
        </Panel>
      </MainContainer>
    </AppContainer>
  );
};

export default CodeEditor;
