import React from "react";
import { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function Slider({
  setAlert,
  editEnabled,
  questionsType,
  questions,
  setQuestions,
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const goToNext = (event) => {
    if (questionIndex < questions.length - 1) {
      // increment questionsIndex
      setQuestionIndex(questionIndex + 1);
    }
  };
  const goToPrevious = (event) => {
    if (questionIndex > 0) {
      // decrement questionsIndex
      setQuestionIndex(questionIndex - 1);
    }
  };
  const deleteQuestion = (event) => {
    // delete question
    if (questions.length === 1) {
      setAlert({
        message: (
          <>
            <strong>Error! </strong>Atleast one question is required
          </>
        ),
        type: "danger",
      });
      return;
    }
    setQuestions(
      questions.filter((question, index) => index !== questionIndex)
    );
    setQuestionIndex(0);

    setAlert({
      message: (
        <>
          <strong>Success! </strong>Question deleted
        </>
      ),
      type: "success",
    });
  };

  return (
    <div className="card" style={{ minWidth: "70%" }}>
      <div className="card-body">
        {editEnabled ? (
          <div className="input-group input-group-lg mb-3">
            <span className="input-group-text" id="inputGroup-sizing-lg">
              {questionIndex + 1}.
            </span>
            <textarea
              value={questions[questionIndex]?.question}
              onChange={(event) => {
                setQuestions((previousQuestions) => {
                  const updatedQuestions = [...previousQuestions];
                  updatedQuestions[questionIndex].question = event.target.value;
                  return updatedQuestions;
                });
              }}
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-lg"
            ></textarea>
          </div>
        ) : (
          <h5 className="card-title mb-3">{`${questionIndex + 1}. ${questions[questionIndex].question
            }`}</h5>
        )}

        <form onSubmit={(event) => handleSubmit(event)}>
          {questionsType === "MCQ" &&
            questions[questionIndex].options.map((option, index) =>
              editEnabled ? (
                <div className="input-group mb-3" key={index}>
                  <span className="input-group-text" id="basic-addon1">
                    <input
                      className="form-check-input"
                      type="radio"
                      readOnly={editEnabled}
                      checked={questions[questionIndex].correct_ans == option}
                      name="flexRadioDefault"
                      id={`flexRadioDefault${index}`}
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(event) => {
                      setQuestions((previousQuestions) => {
                        const updatedQuestions = [...previousQuestions];
                        updatedQuestions[questionIndex].options[index] =
                          event.target.value;
                        return updatedQuestions;
                      });
                    }}
                    value={option}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
              ) : (
                <div className="form-check mb-3" key={index}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id={`flexRadioDefault${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`flexRadioDefault${index}`}
                  >
                    {option}
                  </label>
                </div>
              )
            )}
          {questionsType === "MSQ" &&
            questions[questionIndex].options.map((option, index) =>
              editEnabled ? (
                <div className="input-group mb-3" key={index}>
                  <span className="input-group-text" id="basic-addon1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={option}
                      readOnly={editEnabled}
                      checked={questions[questionIndex].correct_ans.includes(
                        option
                      )}
                      name="flexRadioDefault"
                      id={`flexRadioDefault${index}`}
                    />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={option}
                    onChange={(event) => {
                      setQuestions((previousQuestions) => {
                        const updatedQuestions = [...previousQuestions];
                        updatedQuestions[questionIndex].options[index] =
                          event.target.value;
                        return updatedQuestions;
                      });
                    }}
                    aria-describedby="basic-addon1"
                  />
                </div>
              ) : (
                <div className="form-check mb-3" key={index}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="flexRadioDefault"
                    id={`flexRadioDefault${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`flexRadioDefault${index}`}
                  >
                    {option}
                  </label>
                </div>
              )
            )}
          {questionsType === "SAQ" ||
            questionsType === "LAQ" ||
            (questionsType === "NAT" && (
              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  style={{ height: "100px" }}
                ></textarea>
                <label htmlFor="floatingTextarea2">Write your answer</label>
              </div>
            ))}
          {editEnabled && (
            <div className="input-group mb-3">
              <span className="input-group-text">Answer</span>
              <textarea
                value={questions[questionIndex].correct_ans}
                onChange={(event) => {
                  setQuestions((previousQuestions) => {
                    const updatedQuestions = [...previousQuestions];
                    updatedQuestions[questionIndex].correct_ans =
                      event.target.value.split(",");
                    return updatedQuestions;
                  });
                }}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
              ></textarea>
            </div>
          )}
        </form>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <OverlayTrigger
          placement={"top"}
          overlay={
            <Tooltip id={`tooltip-top`}>
              <strong>Previous question</strong>
            </Tooltip>
          }
        >
          <i
            onClick={(event) => goToPrevious(event)}
            className="btn btn-outline-primary fs-3 fa-solid fa-angle-left"
          ></i>
        </OverlayTrigger>
        {editEnabled && (
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`tooltip-top`}>
                <strong>Delete Question</strong>
              </Tooltip>
            }
          >
            <i
              onClick={(event) => deleteQuestion(event)}
              className="btn btn-outline-primary fs-3 fa-solid fa-trash"
            ></i>
          </OverlayTrigger>
        )}
        <OverlayTrigger
          placement={"top"}
          overlay={
            <Tooltip id={`tooltip-top`}>
              <strong>Next question</strong>
            </Tooltip>
          }
        >
          <i
            onClick={(event) => goToNext(event)}
            className="btn btn-outline-primary fs-3 fa-solid fa-angle-right"
          ></i>
        </OverlayTrigger>
      </div>
    </div>
  );
}
