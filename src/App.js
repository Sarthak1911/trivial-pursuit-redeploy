import React, { useState } from "react";
import "./App.css";

const subjects = ["Physics", "Chemistry", "Biology", "Geography", "History", "General Knowledge", "Computer Science", "OOPS", "DBMS", "ReactJs", "Operating Systems:CSE Subject"];
const difficultyLevels = ["Easy", "Medium", "Hard"];

const App = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const fetchQuestion = async () => {
    if (!selectedSubject || !selectedDifficulty) {
      alert("Please select a subject and difficulty level.");
      return;
    }

    setLoading(true);
    setShowAnswer(false);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are an AI that generates only theoretical quiz questions with very short answers (1-3 words max). Do not generate numerical or calculation-based questions. Keep answers concise and avoid explanations." },
            { role: "user", content: `Generate a new ${selectedDifficulty} difficulty question for ${selectedSubject}. Provide the question and the correct answer in the format: 'Question: ... Answer: ...'` }
          ],
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const fullResponse = data.choices?.[0]?.message?.content || "No question generated.";

      const match = fullResponse.match(/Question:(.*)Answer:(.*)/s);
      if (match) {
        setQuestion(match[1].trim());
        setAnswer(match[2].trim());
      } else {
        setQuestion("Failed to parse question. Try again.");
        setAnswer("");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setQuestion("Failed to fetch question. Try again.");
      setAnswer("");
    }
    setLoading(false);
  };

  return (
    <div className="container text-center mt-4 mb-4">
      <h1>Trivial Pursuit</h1>
      <h5>A Meme Team Exclusive Game!</h5>
      <p>Select a subject and difficulty level to generate a question:</p>
      <div className="container mb-3" >
        <select className="form-select mb-2 text-bg-dark" onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject} >{subject}</option>
          ))}
        </select>
        <select className="form-select mb-3 text-bg-dark" onChange={(e) => setSelectedDifficulty(e.target.value)}>
          <option value="">Select Difficulty</option>
          {difficultyLevels.map((level, index) => (
            <option key={index} value={level}>{level}</option>
          ))}
        </select>
        <button className="btn btn-dark w-100 p-3 border" onClick={fetchQuestion} disabled={loading}>
          Generate Question
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {question && (
        <div className="m-2">
          <div className="mt-4 p-3 border rounded">
            <h5>Quiz Question:</h5>
            <p>{question}</p>
            <button className="btn btn-danger mt-2" onClick={() => setShowAnswer(true)}>I Lose</button>
            {showAnswer && <p className="mt-2"><strong>Answer:</strong> {answer}</p>}
          </div>
        </div>

      )}
    </div>
  );
};

export default App;
