import { useState, useEffect } from "react";
import QuizCard from "./QuizCard";
import request from "../func/request";
import { Link } from "react-router-dom";
import { encrypt } from "../func/encryptDecrypt";

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

export default function User({ userId, setModal, setAlert }) {
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [modified, setModified] = useState(false);
  useEffect(() => {
    request(`/api/quizzes?filters[public][id][$eq]=${userId}`, "GET").then(
      (res) => {
        setCreatedQuizzes(res.data.reverse());
      }
    );
    request(`/api/attempts?populate=*&filters[public][id][$eq]=${userId}`).then(
      (res) => {
        setAttemptedQuizzes(res.data.reverse());
      }
    );
  }, [userId, modified]);

  return (
    <div className="accordion" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Your Quizzes
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body d-flex flex-wrap ">
            {createdQuizzes.length === 0 && <p>No data found</p>}
            {createdQuizzes?.map((quiz) => {
              const quizAttributes = quiz.attributes;
              return (
                <QuizCard
                  key={quiz.id}
                  quiz={{
                    id: quiz.id,
                    topic: `${quizAttributes.inputValue.slice(0, 10)}${
                      quizAttributes.inputValue.length > 10 ? "..." : ""
                    }`,
                    difficultyLevel: quizAttributes.difficultyLevel,
                    createdAt: formatDate(quizAttributes.publishedAt),
                    questionsType: quizAttributes.questionsType,
                  }}
                  setModal={setModal}
                  handleModified={() => setModified(!modified)}
                  setAlert={setAlert}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            Attempted Quizzes
          </button>
        </h2>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse show"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body d-flex flex-wrap">
            {attemptedQuizzes.length === 0 && <p>No data found</p>}
            {attemptedQuizzes?.map((quiz) => {
              const quizAttributes = quiz.attributes.quiz.data;
              return (
                <Link
                  key={quizAttributes.id}
                  className="text-decoration-none"
                  to={`/attempt?qid=${encodeURIComponent(
                    encrypt(quizAttributes.id)
                  )}`}
                >
                  <QuizCard
                    key={quiz.id}
                    quiz={{
                      id: quiz.id,
                      topic: `${quizAttributes.attributes.inputValue.slice(
                        0,
                        10
                      )}${
                        quizAttributes.attributes.inputValue.length > 10
                          ? "..."
                          : ""
                      }`,
                      difficultyLevel:
                        quizAttributes.attributes.difficultyLevel.toUpperCase(),
                      createdAt: formatDate(quiz.attributes.publishedAt),
                      questionsType: quizAttributes.attributes.questionsType,
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
