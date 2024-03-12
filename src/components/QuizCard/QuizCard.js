import Slider from "../Slider";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import request from "../../func/request";
import Share from "../Share";
import { encrypt } from "../../func/encryptDecrypt";
import { Link } from "react-router-dom";
import "./style.css";

export default function QuizCard({ quiz, setModal, handleModified, setAlert }) {
  return (
    <li
      className="list-group-item list-group-item-action text-light border border-0 border-bottom rounded-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
      }}
      onClick={() => {
        if (setModal) {
          setModal({
            title: quiz.name,
            body: (
              <Slider
                readOnly={true}
                questions={quiz.questions}
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
                                setModal({
                                  title: null,
                                  body: null,
                                  footer: null,
                                });
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
                              onClick={() =>
                                setModal({
                                  title: null,
                                  body: null,
                                  footer: null,
                                })
                              }
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
      <div className="row">
        <div
          className="col-6 col-sm-6"
          role="button"
          data-bs-toggle={setModal ? "modal" : ""}
          data-bs-target={setModal ? "#exampleModal" : ""}
        >
          <h5 class="d-inline-block text-truncate w-100">{quiz.name}</h5>
          <div className="mb-2">
            {quiz.difficultyLevel.toUpperCase() + " "}
            <i className="fa-solid fa-circle"></i>
            {" " + quiz.questionsType}
          </div>
        </div>
        <span className="col-4 col-sm-4 my-auto">{quiz.createdAt}</span>
        <div className="col-2 col-sm-2 my-auto">
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`tooltip-top`}>
                <strong>Leaderboard</strong>
              </Tooltip>
            }
          >
            <Link
              to={`/leaderboard?qid=${encodeURIComponent(encrypt(quiz.id))}`}
              className="text-decoration-none text-light"
            >
              <i className="fa-solid fa-chart-simple"></i>
            </Link>
          </OverlayTrigger>
        </div>
      </div>
    </li>
  );
}
