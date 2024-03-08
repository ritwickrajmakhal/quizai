import React from "react";
import { useState, useEffect } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function Slider({
  header,
  footer,
  readOnly,
  editable,
  questionsType,
  questions,
  setQuestions,
  setAlert,
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const goToNext = () => {
    if (questionIndex < questions.length - 1) {
      // increment questionsIndex
      setQuestionIndex(questionIndex + 1);
    }
  };
  const goToPrevious = () => {
    if (questionIndex > 0) {
      // decrement questionsIndex
      setQuestionIndex(questionIndex - 1);
    }
  };

  const deleteQuestion = () => {
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
    <div className="container my-4">
      <div className="card slider" style={{ minWidth: "70%" }}>
        {header}
        <div className="card-body">
          {/* Question statement area */}
          {editable ? (
            <div className="input-group input-group-lg mb-3">
              <span className="input-group-text" id="inputGroup-sizing-lg">
                {questionIndex + 1}.
              </span>
              <textarea
                value={questions[questionIndex]?.question}
                onChange={(event) => {
                  setQuestions((previousQuestions) => {
                    const updatedQuestions = [...previousQuestions];
                    updatedQuestions[questionIndex].question =
                      event.target.value;
                    return updatedQuestions;
                  });
                }}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
              ></textarea>
            </div>
          ) : (
            <div className="d-flex justify-content-between">
              <h5 className="card-title mb-3">{`${questionIndex + 1}. ${
                questions[questionIndex]?.question
              }`}</h5>
              {questions[questionIndex].score !== undefined ? (
                <p className="fw-bold text-danger">
                  {questions[questionIndex].score}/1 Point
                </p>
              ) : (
                <p className="fw-bold text-success">1 Point</p>
              )}
            </div>
          )}

          {questionsType === "MCQ" &&
            questions[questionIndex]?.options.map((option, index) =>
              editable ? (
                <div className="input-group mb-3" key={index}>
                  <span className="input-group-text" id="basic-addon1">
                    <input
                      className="form-check-input"
                      type="radio"
                      readOnly={readOnly || editable}
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
                    readOnly={readOnly}
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    onChange={() => {
                      if (!readOnly) {
                        setQuestions((previousQuestions) => {
                          const updatedQuestions = [...previousQuestions];
                          updatedQuestions[questionIndex].ans = [option];
                          return updatedQuestions;
                        });
                      }
                    }}
                    id={`flexRadioDefault${index}`}
                    checked={questions[questionIndex].ans?.includes(option)}
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
              editable ? (
                <div className="input-group mb-3" key={index}>
                  <span className="input-group-text" id="basic-addon1">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={option}
                      readOnly={readOnly || editable}
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
                    readOnly={readOnly}
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
                    onChange={() => {
                      setQuestions((previousQuestions) => {
                        const updatedQuestions = [...previousQuestions];
                        if (!updatedQuestions[questionIndex].ans) {
                          updatedQuestions[questionIndex].ans = [option];
                        } else {
                          const ansIndex = updatedQuestions[
                            questionIndex
                          ].ans.findIndex((ans) => ans === option);
                          if (ansIndex === -1) {
                            updatedQuestions[questionIndex].ans.push(option);
                          } else {
                            updatedQuestions[questionIndex].ans.splice(
                              ansIndex,
                              1
                            );
                          }
                        }
                        return updatedQuestions;
                      });
                    }}
                    readOnly={readOnly}
                    checked={questions[questionIndex].ans?.includes(option)}
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
          {(questionsType === "SAQ" ||
            questionsType === "LAQ" ||
            questionsType === "NAT") &&
            !editable && (
              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  placeholder="Write your answer"
                  id="floatingTextarea2"
                  value={
                    questions[questionIndex].ans
                      ? questions[questionIndex].ans
                      : ""
                  }
                  onChange={(event) => {
                    setQuestions((previousQuestions) => {
                      const updatedQuestions = [...previousQuestions];
                      updatedQuestions[questionIndex].ans = event.target.value;
                      return updatedQuestions;
                    });
                  }}
                  readOnly={readOnly}
                  style={{ height: "100px" }}
                ></textarea>
                <label htmlFor="floatingTextarea2">Write your answer</label>
              </div>
            )}

          {(editable || readOnly) && (
            <div className="input-group mb-3">
              <span className="input-group-text">Correct answer</span>
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
                readOnly={readOnly}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-lg"
              ></textarea>
            </div>
          )}
        </div>
        <div className="card-footer d-flex justify-content-between">
          {questionIndex > 0 ? (
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
                className="btn btn-outline-primary rounded-circle fs-3 fa-solid fa-angle-left"
              ></i>
            </OverlayTrigger>
          ) : (
            <div></div>
          )}
          {questionIndex === questions.length - 1 && footer}
          {editable && (
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
          {questionIndex < questions.length - 1 ? (
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
                className="btn btn-outline-primary rounded-circle fs-3 fa-solid fa-angle-right"
              ></i>
            </OverlayTrigger>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
