import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { decrypt } from "../func/encryptDecrypt";
import request from "../func/request.js";
import Slider from "./Slider.js";
import CountdownTimer from "./CountdownTImer/CountdownTimer.js";

export default function Attempt({ userId, setAlert, setPreLoader }) {
  // Get quiz id from the url
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qid = queryParams.get("qid");
  const [quiz, setQuiz] = useState(null);
  useEffect(() => {
    if (qid) {
      const decryptedQuizId = decrypt(qid);
      request(
        `/api/quizzes?populate=*&filters[id][$eq]=${decryptedQuizId}`,
        "GET"
      ).then((res) => setQuiz(res.data[0]));
    }
  }, [qid]);

  const [submitted, setSubmitted] = useState(false);
  // fetch attempt if the user already attempted
  const [attempt, setAttempt] = useState(null);
  const [attemptFetched, setAttemptFetched] = useState(false);
  useEffect(() => {
    if ((quiz && userId) || submitted) {
      request(
        `/api/attempts?populate=*&filters[public][id][$eq]=${userId}&filters[quiz][id][$eq]=${quiz.id}`,
        "GET"
      ).then((res) => {
        setAttempt(res.data[0]?.attributes.answers);
        setAttemptFetched(true);
        setQuestions(null);
      });
    }
  }, [quiz, userId, submitted]);

  // if attempt is null then fetch questions
  const [questions, setQuestions] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (quiz && !attempt && attemptFetched) {
      request(`/api/questions?filters[quiz][id][$eq]=${quiz.id}`, "GET").then(
        (res) => {
          const questions = res.data[0].attributes.questions;

          // calculating time required to solve all questions
          if (
            quiz.attributes.questionsType === "MCQ" ||
            quiz.attributes.questionsType === "MSQ"
          ) {
            setTimeLeft(questions.length);
          } else {
            let time = 0;
            questions.forEach((question) => {
              time += question.time;
            });
            setTimeLeft(time);
          }
          // insert ans attribute to each questions
          questions.forEach((question) => {
            question["ans"] = "";
          });
          setQuestions(questions);
        }
      );
    }
  }, [quiz, attempt, attemptFetched]);

  const [confirmation, setConfirmation] = useState(false);

  // countdown timer state
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const handleCountdownComplete = () => {
    setCountdownCompleted(true);
  };

  const [attemptEvaluated, setAttemptEvaluated] = useState(false);
  useEffect(() => {
    if (countdownCompleted) {
      // evaluate answers
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions.forEach((question, index) => {
          newQuestions[index].score = 0;
          if (
            quiz.attributes.questionsType === "MCQ" ||
            quiz.attributes.questionsType === "MSQ"
          ) {
            if (
              JSON.stringify(question.ans) ===
              JSON.stringify(question.correct_ans)
            ) {
              newQuestions[index].score = 1;
            }
          }
        });
        return newQuestions;
      });
      setAttemptEvaluated(true);
    }
  }, [countdownCompleted]);

  useEffect(() => {
    if (attemptEvaluated) {
      setPreLoader("Submitting...");
      request("/api/attempts", "POST", {
        data: {
          public: userId,
          quiz: quiz.id,
          answers: questions,
        },
      })
        .then((res) => {
          setSubmitted(true);
          setPreLoader(null);
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
  }, [attemptEvaluated]);

  return (
    <div className="container d-flex justify-content-center">
      {!confirmation && !attempt && (
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
                  I hereby acknowledge that I have read and understood the rules
                  for participating in this quiz.
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
      {quiz && (attempt || (questions && confirmation)) && (
        <Slider
          readOnly={attempt && true}
          header={
            questions ? (
              <div className="card-header pb-0 d-flex justify-content-center">
                <CountdownTimer
                  time={timeLeft}
                  countdownCompleted={countdownCompleted}
                  onCountdownComplete={handleCountdownComplete}
                />
              </div>
            ) : (
              <div className="card-header pb-0 d-flex justify-content-between">
                <div>
                  <p>
                    <strong>Topic: </strong>
                    {quiz.attributes.inputValue.slice(0, 10)}
                    {quiz.attributes.inputValue.length > 10 ? "..." : ""}
                  </p>
                  <p>
                    <strong>Number of questions: </strong>
                    {attempt.length}
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
                    {attempt.reduce((acc, item) => acc + item.score, 0)}/
                    {attempt.length}
                  </p>
                </div>
              </div>
            )
          }
          setAlert={setAlert}
          questionsType={quiz.attributes.questionsType}
          questions={questions ? questions : attempt}
          setQuestions={setQuestions}
          footer={
            !attempt && (
              <>
                <button
                  onClick={() => setCountdownCompleted(true)}
                  className="btn btn-success"
                >
                  Submit Quiz
                </button>
              </>
            )
          }
        />
      )}
    </div>
  );
}
