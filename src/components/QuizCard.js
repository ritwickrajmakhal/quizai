import React, { useState } from "react";
import Slider from "./Slider";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import request from "../func/request";
import Share from "./Share";
import { encrypt } from "../func/encryptDecrypt";

export default function QuizCard({ quiz, setModal, handleModified, setAlert }) {
  const [questionId, setQuestionId] = useState();
  const [questions, setQuestions] = useState(() => {
    request(`/api/questions?filters[quiz][id][$eq]=${quiz.id}`, "GET").then(
      (res) => {
        setQuestions(res.data[0]?.attributes.questions);
        setQuestionId(res.data[0]?.id);
      }
    );
  });

  return (
    <li
      className="list-group-item list-group-item-action d-flex align-items-center justify-content-between text-light border border-0 border-bottom"
      style={{
        cursor: "pointer",
        backgroundColor: "transparent",
      }}
      data-bs-toggle={setModal ? "modal" : ""}
      data-bs-target={setModal ? "#exampleModal" : ""}
      onClick={() => {
        if (setModal) {
          setModal({
            title: "View quiz",
            body: (
              <Slider
                readOnly={true}
                questions={questions}
                questionsType={quiz.questionsType}
              />
            ),
            footer: (
              <div className="modal-footer d-flex justify-content-center text-bg-light">
                <OverlayTrigger
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      <strong>Delete quiz</strong>
                    </Tooltip>
                  }
                >
                  <button
                    onClick={() => {
                      setModal({
                        title: "Delete Quiz",
                        body: (
                          <p>
                            Are you sure you want to delete this quiz? This
                            action cannot be undone.
                          </p>
                        ),
                        footer: (
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-danger mx-2"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                // list all the attempt ids of this quiz
                                request(
                                  `/api/attempts?filters[quiz][id][$eq]=${quiz.id}&fields[0]=id`,
                                  "GET"
                                ).then((res) => {
                                  // delete all attempts
                                  res.data.forEach((item) => {
                                    request(
                                      `/api/attempts/${item.id}`,
                                      "DELETE"
                                    );
                                  });
                                  request(
                                    `/api/questions/${questionId}`,
                                    "DELETE"
                                  );
                                });
                                // delete this quiz
                                request(
                                  `/api/quizzes/${quiz.id}`,
                                  "DELETE"
                                ).then(() => {
                                  handleModified();
                                  setAlert({
                                    message: (
                                      <>
                                        <strong>Success!</strong> Quiz deleted
                                        successfully
                                      </>
                                    ),
                                    type: "success",
                                  });
                                });
                              }}
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </button>
                          </div>
                        ),
                      });
                    }}
                    className="btn btn-outline-dark rounded-circle me-2"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      <strong>Leaderboard</strong>
                    </Tooltip>
                  }
                >
                  <button className="btn btn-outline-dark rounded-circle me-2">
                    <i className="fa-solid fa-users-viewfinder"></i>
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      <strong>Share quiz</strong>
                    </Tooltip>
                  }
                >
                  <button
                    className="btn btn-outline-dark rounded-circle me-2"
                    onClick={() => {
                      setModal({
                        title: "Share Quiz",
                        body: (
                          <Share
                            url={`${
                              window.location.origin
                            }/attempt?qid=${encodeURIComponent(
                              encrypt(quiz.id)
                            )}`}
                          />
                        ),
                      });
                    }}
                  >
                    <i className="fa-solid fa-share"></i>
                  </button>
                </OverlayTrigger>
              </div>
            ),
            style: "xl",
          });
        }
      }}
    >
      <div>
        <h5>{quiz.topic}</h5>
        {quiz.difficultyLevel.toUpperCase() + " "}
        <i className="fa-solid fa-circle"></i>
        {" " + quiz.questionsType}
      </div>
      {quiz.createdAt}
    </li>
  );
}
