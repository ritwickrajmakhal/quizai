import { useState, useEffect } from "react";
import QuizCard from "./QuizCard";
import { Link } from "react-router-dom";
import { encrypt } from "../func/encryptDecrypt";
import request from "../func/request";
import Pagination from "./Pagination";

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

const PAGE_SIZE = 8; // Number of QuizCards to show per page

export default function User({ userId, setModal, setAlert }) {
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [modified, setModified] = useState(false);
  const [activeTab, setActiveTab] = useState("created");
  const [currentPageCreated, setCurrentPageCreated] = useState(1);
  const [currentPageAttempted, setCurrentPageAttempted] = useState(1);

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

  const paginateCreated = (pageNumber) => setCurrentPageCreated(pageNumber);
  const paginateAttempted = (pageNumber) => setCurrentPageAttempted(pageNumber);

  return (
    <div className="container">
      <h2
        className="text-light my-4"
        style={{
          textShadow: `0 0 5px #0bf4f3,
        0 0 10px #0bf4f3,
        0 0 20px #0bf4f3,
        0 0 40px #0bf4f3,
        0 0 80px #0bf4f3`,
        }}
      >
        Welcome to Quiz AI...
      </h2>
      <ul className="nav nav-underline mb-3" data-bs-theme="dark">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "created" && "active"}`}
            onClick={() => setActiveTab("created")}
          >
            Created
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "attempted" && "active"}`}
            onClick={() => setActiveTab("attempted")}
          >
            Attempted
          </button>
        </li>
      </ul>
      {activeTab === "created" && (
        <div>
          <ul className="list-group list-group-flush mb-3">
            {createdQuizzes
              .slice(
                (currentPageCreated - 1) * PAGE_SIZE,
                currentPageCreated * PAGE_SIZE
              )
              .map((quiz) => {
                const quizAttributes = quiz.attributes;
                return (
                  <QuizCard
                    key={quiz.id}
                    quiz={{
                      id: quiz.id,
                      topic: `${quizAttributes.inputValue.slice(0, 20)}${
                        quizAttributes.inputValue.length > 20 ? "..." : ""
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
          </ul>
          <Pagination
            totalPages={Math.ceil(createdQuizzes.length / PAGE_SIZE)}
            paginate={paginateCreated}
            currentPage={currentPageCreated}
          />
        </div>
      )}
      {activeTab === "attempted" && (
        <div>
          <ul className="list-group list-group-flush mb-3">
            {attemptedQuizzes.length === 0 ? (
              <p className="text-light">No data found</p>
            ) : (
              attemptedQuizzes
                .slice(
                  (currentPageAttempted - 1) * PAGE_SIZE,
                  currentPageAttempted * PAGE_SIZE
                )
                .map((quiz) => {
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
                            20
                          )}${
                            quizAttributes.attributes.inputValue.length > 20
                              ? "..."
                              : ""
                          }`,
                          difficultyLevel:
                            quizAttributes.attributes.difficultyLevel.toUpperCase(),
                          createdAt: formatDate(quiz.attributes.publishedAt),
                          questionsType:
                            quizAttributes.attributes.questionsType,
                        }}
                      />
                    </Link>
                  );
                })
            )}
          </ul>
          <Pagination
            totalPages={Math.ceil(attemptedQuizzes.length / PAGE_SIZE)}
            paginate={paginateAttempted}
            currentPage={currentPageAttempted}
          />
        </div>
      )}
    </div>
  );
}
