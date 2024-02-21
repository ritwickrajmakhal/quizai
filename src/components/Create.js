import React from "react";
import { useState } from "react";
import Slider from "./Slider";
import PreLoader from "./PreLoader/PreLoader";
import CryptoJS from "crypto-js";
import request from "./request";

export default function Create({ setModal }) {
  // States to store quiz parameters
  const [inputType, setInputType] = useState("topic");
  const [inputValue, setInputValue] = useState("");
  const [questionsType, setQuestionsType] = useState("MCQ");
  const [difficultyLevel, setDifficultyLevel] = useState("easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);

  const [questions, setQuestions] = useState(null); // State to store questions (JSON format
  const [loading, setLoading] = useState(false);
  const [quizId, setQuizId] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const prompt = require("./prompt");
    let questionsTypeFullForm = "";
    switch (questionsType) {
      case "MCQ":
        questionsTypeFullForm = "Multiple Choice Question";
        break;
      case "MSQ":
        questionsTypeFullForm = "Multiple Select Question";
        break;
      case "NAT":
        questionsTypeFullForm = "Numerical Answer Type";
        break;
      case "SAQ":
        questionsTypeFullForm = "Short Answer type Question";
        break;
      case "LAQ":
        questionsTypeFullForm = "Long Answer type Question";
        break;
      default:
        questionsTypeFullForm = "Multiple Choice Question";
    }
    let promptText = "";
    if (questionsType === "MCQ" || questionsType === "MSQ") {
      promptText = `Strictly create a JSON format containing ${numberOfQuestions} ${questionsTypeFullForm} using the following JSON format:[{"question" : "question statement","options" : ["option1", "option2", "option3", "option4"],"correct_ans" : ["option"]}] from the ${inputType} "${inputValue}" of difficulty level ${difficultyLevel}.`;
    } else {
      promptText = `Strictly create a JSON format containing ${numberOfQuestions} ${questionsTypeFullForm} using the following JSON format:[{"question" : "question statement","answer" : "answer", "time" : expected time to solve the question in minutes}] from the ${inputType} "${inputValue}" of difficulty level ${difficultyLevel}.`;
    }
    const response = await prompt(promptText);
    setQuestions(response);
    setLoading(false);
  };

  // Function to publish and share quiz
  const shareQuiz = async () => {
    if (!quizId) {
      // publish quiz first
      setLoading(true);
      const data = {
        data: {
          questions: questions,
          questionsType: questionsType,
          difficultyLevel: difficultyLevel,
        },
      };
      try {
        const res = await request("/api/quizzes", "POST", data);
        const encryptedQuizId = CryptoJS.AES.encrypt(
          JSON.stringify(res.data.id),
          process.env.REACT_APP_SECRET_KEY
        ).toString();
        setQuizId(encryptedQuizId);
        setLoading(false);
        setModal({
          title: "Share Quiz",
          body: (
            <a href={`/quizzes?qid=${encodeURIComponent(encryptedQuizId)}`}>
              Click here
            </a>
          ),
          footer: null,
        });
      } catch (error) {
        setLoading(false);
        console.error("Error publishing quiz:", error);
      }
    }
  };

  return (
    <>
      {loading && <PreLoader />}
      {questions && (
        <div className="d-flex justify-content-around align-items-center">
          <button onClick={() => setQuestions(null)} className="btn btn-danger">
            Regenerate <i className="fa-solid fa-arrow-rotate-right"></i>
          </button>
          <button
            onClick={() => shareQuiz()}
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <i className="fa-solid fa-arrow-up-from-bracket"></i>
          </button>
        </div>
      )}
      <div className="d-flex justify-content-center align-items-center">
        {questions ? (
          <Slider questionsType={questionsType} questions={questions} />
        ) : (
          <div className="create card border">
            <div className="card-body">
              <h5 className="card-title">Create a new quiz</h5>
              <form onSubmit={(event) => handleSubmit(event)} target="/quiz">
                <div className="mb-3">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    defaultValue={inputType}
                    defaultChecked={inputType}
                    onChange={(event) => setInputType(event.target.value)}
                  >
                    <option value="topic">Topic</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea2"
                    style={{ height: "100px" }}
                  ></textarea>
                  <label htmlFor="floatingTextarea2">
                    Enter your {inputType}
                  </label>
                </div>
                <div className="mb-3">
                  <label htmlFor="questionsType">Question type:</label>
                  <select
                    id="questionsType"
                    className="form-select"
                    aria-label="Default select example"
                    defaultValue={questionsType}
                    defaultChecked={questionsType}
                    onChange={(event) => setQuestionsType(event.target.value)}
                  >
                    <option value="MCQ">Multiple Choice Question</option>
                    <option value="MSQ">Multiple Select Question</option>
                    <option value="NAT">Numerical Answer Type</option>
                    <option value="SAQ">Short Answer type Question</option>
                    <option value="LAQ">Long Answer type Question</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="difficultyLevel">Difficulty level:</label>
                  <select
                    id="difficultyLevel"
                    className="form-select"
                    aria-label="Default select example"
                    defaultValue={difficultyLevel}
                    defaultChecked={difficultyLevel}
                    onChange={(event) => setDifficultyLevel(event.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="form-floating mb-3">
                  <input
                    value={numberOfQuestions}
                    onChange={(event) =>
                      setNumberOfQuestions(event.target.value)
                    }
                    type="number"
                    className="form-control"
                    id="numberOfQuestions"
                    placeholder="Number of questions"
                  />
                  <label htmlFor="numberOfQuestions">Number of questions</label>
                </div>
                <button type="submit" className="btn btn-primary">
                  Generate questions
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
