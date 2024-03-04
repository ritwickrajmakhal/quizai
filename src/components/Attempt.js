import { useEffect, useId, useState } from "react";
import { useLocation } from "react-router-dom";
import { decrypt } from "../func/encryptDecrypt";
import request from "../func/request.js";
import Slider from "./Slider";
import CountdownTimer from "./CountdownTImer/CountdownTimer";

export default function Attempt({ userId, setPreLoader, setAlert }) {
  // Get quiz id from the url
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qid = queryParams.get("qid");

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [confirmation, setConfirmation] = useState(false);
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const [attemptEvaluated, setAttemptEvaluated] = useState(false);

  // validate qid and fetch quiz details
  useEffect(() => {
    if (qid) {
      setPreLoader("Fetching Quiz details...");
      const decryptedQuizId = decrypt(qid);
      request(
        `/api/quizzes?populate=*&filters[id][$eq]=${decryptedQuizId}`,
        "GET"
      )
        .then((res) => setQuiz(res.data[0]))
        .finally(() => setPreLoader(null));
    }
  }, [qid, setPreLoader]);

  // Fetch attempt if quiz is found
  useEffect(() => {
    if (quiz && useId) {
      setPreLoader("Fetching attempt...");
      request(
        `/api/attempts?populate=*&filters[public][id][$eq]=${userId}&filters[quiz][id][$eq]=${quiz.id}`,
        "GET"
      )
        .then((res) => {
          const questions = res.data[0]?.attributes.answers;
          if (questions) {
            setQuestions(questions);
            setAttempted(true);
            setConfirmation(true);
          }
        })
        .finally(() => setPreLoader(null));
    }
  }, [quiz, userId, attempted, setPreLoader]);

  /* Fetch questions if attempt not found
   * Calculate duration of the quiz
   * Add ans attribute to each question
   */
  useEffect(() => {
    if (!attempted && userId && quiz) {
      // Fetch questions if attempt not found
      request(`/api/questions?filters[quiz][id][$eq]=${quiz.id}`, "GET").then(
        (res) => {
          const questions = res.data[0].attributes.questions;
          // Calculate duration of the quiz
          if (
            quiz.attributes.questionsType === "MCQ" ||
            quiz.attributes.questionsType === "MSQ"
          ) {
            setDuration(questions.length);
          } else {
            let time = 0;
            questions.forEach((question) => {
              time += question.time;
            });
            setDuration(time);
          }
          // Add ans attribute to each question
          questions.forEach((question) => {
            question["ans"] = "";
          });
          setQuestions(questions);
        }
      );
    }
  }, [attempted, userId, quiz]);

  const handleCountdownComplete = () => {
    // stop countdown timer
    setCountdownCompleted(true);
  };

  // Evaluate the quiz
  useEffect(() => {
    if (countdownCompleted && !attempted) {
      // evaluate answers
      setPreLoader("Submitting...");
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        const fetchPromises = []; // Array to store fetch promises

        newQuestions.forEach((question, index) => {
          question.score = 0;
          if (
            quiz.attributes.questionsType === "MCQ" ||
            quiz.attributes.questionsType === "MSQ"
          ) {
            if (
              JSON.stringify(question.ans) ===
              JSON.stringify(question.correct_ans)
            ) {
              question.score = 1;
            }
          } else {
            const data = {
              inputs: {
                source_sentence: question.correct_ans,
                sentences: [question.ans],
              },
            };
            const fetchPromise = fetch(
              "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
                  "Content-Type": "application/json", // Specify content type
                },
                body: JSON.stringify(data),
              }
            )
              .then((res) => {
                if (!res.ok) {
                  throw new Error("Network response was not ok");
                }
                return res.json();
              })
              .then((res) => {
                // Assuming res[0] contains the score
                question.score = res[0] > 0.5 ? 1 : 0;
              });

            fetchPromises.push(fetchPromise); // Push the fetch promise to the array
          }
        });

        // Use Promise.all() to wait for all fetch promises to resolve
        Promise.all(fetchPromises).then(() => {
          setAttemptEvaluated(true); // Set attempt evaluation flag after all scores are retrieved
        });

        return newQuestions;
      });
    }
  }, [
    countdownCompleted,
    setPreLoader,
    quiz,
    attempted,
  ]);

  useEffect(() => {
    if (attemptEvaluated && !attempted) {
      request("/api/attempts", "POST", {
        data: {
          public: userId,
          quiz: quiz.id,
          answers: questions,
        },
      })
        .then((res) => {
          setAttempted(true);
          setAlert({
            message: (
              <>
                <strong>Success! </strong>Quiz submitted
              </>
            ),
            type: "success",
          });
        })
        .catch((error) => {
          setPreLoader(null);
          setAlert({
            message: (
              <>
                <strong>Error! </strong>Failed to submit quiz
              </>
            ),
            type: "danger",
          });
        });
    }
  }, [
    attemptEvaluated,
    userId,
    quiz,
    questions,
    setAlert,
    setPreLoader,
    attempted,
  ]);

  return (
    <div className="container d-flex justify-content-center">
      {quiz ? (
        <div>
          {/* Ask for confirmation to attempt quiz */}
          {!confirmation && questions && (
            <div className="card my-5 fs-5">
              <div className="card-body row">
                <div className="col-sm-5">
                  <div className="card-text mb-3">
                    <strong>Topic: </strong>
                    {quiz?.attributes.inputValue}
                  </div>
                  <div className="card-text mb-3">
                    <strong>Number of Questions: </strong>
                    {questions?.length}
                  </div>
                  <div className="card-text mb-3">
                    <strong>Questions Type: </strong>
                    {quiz?.attributes.questionsType}
                  </div>
                  <div className="card-text mb-3">
                    <strong>Difficulty Level: </strong>
                    {quiz?.attributes.difficultyLevel}
                  </div>
                  <div className="card-text mb-3">
                    <strong>Generated By: </strong>
                    {quiz?.attributes.public.data.attributes.name}
                  </div>
                </div>
                <div className="col-sm-7">
                  <p className="fw-bold">Rules:</p>
                  <ul>
                    <li>All questions are mandatory.</li>
                    <li>1 point will be awarded for every correct answer.</li>
                    <li>
                      You will get certificate of appreciation, if you score is
                      greater than 60%.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-footer">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setConfirmation(true);
                  }}
                >
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      required
                    />
                    <label
                      className="form-check-label fs-5"
                      htmlFor="flexCheckDefault"
                    >
                      I hereby acknowledge that I have read and understood the
                      rules for participating in this quiz.
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-outline-success rounded-5 fs-4 fw-bold border w-100"
                  >
                    START QUIZ
                  </button>
                </form>
              </div>
            </div>
          )}
          {confirmation && questions && (
            <Slider
              header={
                attempted ? (
                  <div className="card-header pb-0 d-flex justify-content-between">
                    <div>
                      <p>
                        <strong>Topic: </strong>
                        {quiz.attributes.inputValue.slice(0, 10)}
                        {quiz.attributes.inputValue.length > 10 ? "..." : ""}
                      </p>
                      <p>
                        <strong>Number of questions: </strong>
                        {questions.length}
                      </p>
                      <p>
                        <strong>Questions Type: </strong>
                        {quiz.attributes.questionsType}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Difficulty Level: </strong>
                        {quiz.attributes.difficultyLevel.toUpperCase()}
                      </p>
                      <p>
                        <strong>Generated by: </strong>
                        {quiz.attributes.public.data.attributes.name}
                      </p>
                      <p>
                        <strong>Total points: </strong>
                        {questions.reduce((acc, item) => acc + item.score, 0)}/
                        {questions.length}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="card-header pb-0 d-flex justify-content-center">
                    <CountdownTimer
                      time={duration}
                      countdownCompleted={countdownCompleted}
                      onCountdownComplete={handleCountdownComplete}
                    />
                  </div>
                )
              }
              footer={
                !attempted && (
                  <button
                    onClick={() => setCountdownCompleted(true)}
                    className="btn btn-success"
                  >
                    Submit Quiz
                  </button>
                )
              }
              readOnly={attempted}
              questionsType={quiz.attributes.questionsType}
              questions={questions}
              setQuestions={setQuestions}
            />
          )}
        </div>
      ) : (
        <div>No quiz found</div>
      )}
    </div>
  );
}
