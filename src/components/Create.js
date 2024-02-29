import React from "react";
import { useState } from "react";
import Slider from "./Slider";
import request from "../func/request";
import Share from "./Share";
import { encrypt } from "../func/encryptDecrypt";

export default function Create({ setPreLoader, setAlert, userId, setModal }) {
  // States to store quiz parameters
  const [quizParams, setQuizParams] = useState({
    inputType: "topic",
    inputValue: "",
    questionsType: "MCQ",
    difficultyLevel: "easy",
    numberOfQuestions: 1,
    public: userId,
  });
  const handleInputChange = (event) => {
    setQuizParams((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const [questions, setQuestions] = useState(null);
  const [quizId, setQuizId] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setPreLoader("Generating...");
    const prompt = require("../func/prompt");
    let questionsTypeFullForm = "";
    switch (quizParams.questionsType) {
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
    if (
      quizParams.questionsType === "MCQ" ||
      quizParams.questionsType === "MSQ"
    ) {
      promptText = `Strictly create a JSON format containing ${quizParams.numberOfQuestions} ${questionsTypeFullForm} using the following JSON format:[{"question" : "question statement","options" : ["option1", "option2", "option3", "option4"],"correct_ans" : ["option"]}] from the ${quizParams.inputType} "${quizParams.inputValue}" of difficulty level ${quizParams.difficultyLevel}.`;
    } else {
      promptText = `Strictly create a JSON format containing ${quizParams.numberOfQuestions} ${questionsTypeFullForm} using the following JSON format:[{"question" : "question statement","correct_ans" : "complete answer for this question", "time" : expected time to solve the question in minutes}] from the ${quizParams.inputType} "${quizParams.inputValue}" of difficulty level ${quizParams.difficultyLevel}.`;
    }
    const response = await prompt(promptText);
    setQuestions(response);
    setPreLoader(null);
  };

  // Function to publish and share quiz
  const shareQuiz = () => {
    if (!quizId) {
      setPreLoader("Saving...");
      request("/api/quizzes", "POST", {
        data: quizParams,
      })
        .then((res) => {
          request("/api/questions", "POST", {
            data: { questions: questions, quiz: res.data.id },
          });
          const encryptedQuizId = encrypt(res.data.id);
          setQuizId(encryptedQuizId);
          setModal({
            title: "Share Quiz",
            body: (
              <Share
                url={`${
                  window.location.origin
                }/attempt?qid=${encodeURIComponent(encryptedQuizId)}`}
              />
            ),
            footer: null,
          });
        })
        .catch((err) => {
          console.error("Error publishing quiz:", err);
        })
        .finally(() => {
          setPreLoader(null);
        });
    } else {
      setModal({
        title: "Share Quiz",
        body: (
          <Share
            url={`${window.location.origin}/attempt?qid=${encodeURIComponent(
              quizId
            )}`}
          />
        ),
        footer: null,
      });
    }
  };

  return (
    <>
      {questions && (
        <div className="d-flex justify-content-around my-3">
          <button
            onClick={() => {
              setQuestions(null);
              setQuizId(null);
            }}
            className="btn btn-danger"
          >
            Regenerate <i className="fa-solid fa-arrow-rotate-right"></i>
          </button>
          <button
            onClick={() => shareQuiz()}
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Share <i className="fa-solid fa-arrow-up-from-bracket"></i>
          </button>
        </div>
      )}
      <div className="d-flex justify-content-center">
        {questions ? (
          <Slider
            editable={true}
            setAlert={setAlert}
            questionsType={quizParams.questionsType}
            questions={questions}
            setQuestions={setQuestions}
          />
        ) : (
          <div className="create card border mt-5" style={{ minWidth: "50%" }}>
            <div className="card-body">
              <h5 className="card-title">Create a new quiz</h5>
              <form onSubmit={(event) => handleSubmit(event)}>
                {/* Input type: Topic or Text */}
                <div className="mb-3">
                  <select
                    className="form-select"
                    name="inputType"
                    aria-label="Default select example"
                    defaultValue={quizParams.inputType}
                    defaultChecked={quizParams.inputType}
                    onChange={(event) => handleInputChange(event)}
                    required
                  >
                    <option value="topic">Topic</option>
                    <option value="text">Text</option>
                  </select>
                </div>

                {/* Input value for the selected input type */}
                <div className="form-floating mb-3">
                  <textarea
                    value={quizParams.inputValue}
                    name="inputValue"
                    onChange={(event) => handleInputChange(event)}
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea2"
                    style={{ height: "100px" }}
                    required
                  ></textarea>
                  <label htmlFor="floatingTextarea2">
                    Enter your {quizParams.inputType}
                  </label>
                </div>

                {/* Question type selection dropdown menu  */}
                <div className="mb-3">
                  <label htmlFor="questionsType">Question type:</label>
                  <select
                    name="questionsType"
                    id="questionsType"
                    className="form-select"
                    aria-label="Default select example"
                    defaultValue={quizParams.questionsType}
                    defaultChecked={quizParams.questionsType}
                    onChange={(event) => handleInputChange(event)}
                    required
                  >
                    <option value="MCQ">Multiple Choice Question</option>
                    <option value="MSQ">Multiple Select Question</option>
                    <option value="NAT">Numerical Answer Type</option>
                    <option value="SAQ">Short Answer type Question</option>
                    <option value="LAQ">Long Answer type Question</option>
                  </select>
                </div>

                {/* Difficulty level selection dropdown menu */}
                <div className="mb-3">
                  <label htmlFor="difficultyLevel">Difficulty level:</label>
                  <select
                    name="difficultyLevel"
                    id="difficultyLevel"
                    className="form-select"
                    aria-label="Default select example"
                    defaultValue={quizParams.difficultyLevel}
                    defaultChecked={quizParams.difficultyLevel}
                    onChange={(event) => handleInputChange(event)}
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Number of questions input */}
                <div className="form-floating mb-3">
                  <input
                    name="numberOfQuestions"
                    value={quizParams.numberOfQuestions}
                    onChange={(event) => handleInputChange(event)}
                    min={1}
                    type="number"
                    className="form-control"
                    id="numberOfQuestions"
                    placeholder="Number of questions"
                    required
                  />
                  <label htmlFor="numberOfQuestions">Number of questions</label>
                </div>

                {/* Submit button */}
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
