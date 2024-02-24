import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Share from "./Share";
import request from "./func/request";
import { encrypt } from './func/encryptDecrypt';

export default function QuizCard({ setAlert, type, userDataChanged, setUserDataChanged, setModal, quiz }) {

  return (
    <div
      className="card text-bg-primary me-3 mb-3 shadow-lg"
      style={{ maxWidth: "18rem" }}
    >
      <h5 className="card-header">
        <strong>Topic: </strong>
        {quiz.attributes.inputValue}
      </h5>
      <div className="card-body">
        <div className="card-title">
          <strong>Difficulty level: </strong>
          {quiz.attributes.difficultyLevel}
        </div>
        <p className="card-text">
          <strong>Type: </strong>
          {quiz.attributes.type}
        </p>
        <p className="card-text">
          <strong>Number of questions: </strong>
          {quiz.attributes.questions?.length}
        </p>
      </div>
      <div className="card-footer">
        {type === "created" &&
          (<OverlayTrigger
            placement={"bottom"}
            overlay={
              <Tooltip id={`tooltip-bottom`}>
                <strong>Delete Quiz</strong>
              </Tooltip>
            }
          >
            <i className="fa-regular fa-trash-can btn"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => {
                setModal({
                  title: "Delete Quiz",
                  body: (
                    <p>
                      Are you sure you want to delete this quiz? This action cannot be undone.
                    </p>
                  ),
                  footer: (
                    <div>
                      <button
                        type="button"
                        className="btn btn-danger mx-2"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          request(`/api/quizzes/${quiz.id}`, "DELETE").then(() => {
                            setUserDataChanged(!userDataChanged);
                            setAlert({
                              message: <><strong>Success!</strong> Quiz deleted successfully</>, type: "success"
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
              }}></i>
          </OverlayTrigger>)}

        <OverlayTrigger
          placement={"bottom"}
          overlay={
            <Tooltip id={`tooltip-bottom`}>
              <strong>Share Quiz</strong>
            </Tooltip>
          }
        >
          <i className="fa-regular fa-share-from-square btn"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => {
              setModal({
                title: "Share Quiz",
                body: (
                  <Share url={`${window.location.origin}/attempt?qid=${encodeURIComponent(encrypt(quiz.id))}`} />
                ),
                footer: null,
              });
            }}
          ></i>
        </OverlayTrigger>
      </div>
    </div>
  );
}
