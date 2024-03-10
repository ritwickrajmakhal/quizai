import React, { useEffect } from "react";
import { useState } from "react";
import Slider from "./Slider";
import request from "../func/request";
import Share from "./Share";
import { encrypt } from "../func/encryptDecrypt";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const convertBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};

export default function Create({ setPreLoader, userId, setModal, setAlert }) {
  // set title of the web page
  document.title = "Quiz AI - Create";

  // States to store quiz parameters
  const [quizParams, setQuizParams] = useState({
    inputType: "topic",
    name: "untitled quiz",
    inputValue: [],
    questionsType: "MCQ",
    difficultyLevel: "easy",
    numberOfQuestions: 1,
    public: userId,
  });

  const handleInputChange = (event) => {
    const { name, files, value } = event.target;
    if (quizParams.inputType === "images" && files) {
      const maxSize = 4 * 1024 * 1024; // 4 MB limit
      const selectedFiles = Array.from(files);

      // Check each selected file's size
      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > maxSize
      );

      if (oversizedFiles.length > 0) {
        // Display an error message or handle oversized files appropriately
        setAlert({
          message:
            "Error: One or more files exceed the size limit. Maximum file size is 4MB",
          type: "danger",
        });
        return;
      }

      // Create URLs for files that passed the size check
      const paths = selectedFiles.map((file) => URL.createObjectURL(file));
      setQuizParams((prev) => ({ ...prev, [name]: paths }));
    } else {
      setQuizParams((prev) => ({ ...prev, [name]: value }));
    }
  };

  // convert all images to Base 64
  const [images, setImages] = useState();
  useEffect(() => {
    if (
      quizParams.inputType === "images" &&
      Array.isArray(quizParams.inputValue)
    ) {
      const fetchImages = async () => {
        const images = await Promise.all(
          quizParams.inputValue.map(async (imageUrl) => {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return convertBlobToBase64(blob);
          })
        );
        setImages(images);
      };
      fetchImages();
    }
  }, [quizParams.inputType, quizParams.inputValue]);

  const [questions, setQuestions] = useState(null);
  const [quizId, setQuizId] = useState(null);

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setPreLoader("Generating...");
    const prompt = require("../func/prompt");
    let questionsTypeFullForm = "";
    switch (quizParams.questionsType) {
      case "MCQ":
        questionsTypeFullForm = "Multiple Choice Question(s)";
        break;
      case "MSQ":
        questionsTypeFullForm = "Multiple Select Question(s)";
        break;
      case "NAT":
        questionsTypeFullForm = "Numerical Answer Type Question(s)";
        break;
      case "SAQ":
        questionsTypeFullForm = "Short Answer type Question(s)";
        break;
      case "LAQ":
        questionsTypeFullForm = "Long Answer type Question(s)";
        break;
      default:
        questionsTypeFullForm = "Multiple Choice Question(s)";
    }
    let parts = [];
    const generationConfig =
      quizParams.inputType === "images"
        ? {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          }
        : {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 4096,
          };
    const MODEL_NAME =
      quizParams.inputType === "images"
        ? "gemini-1.0-pro-vision-latest"
        : "gemini-1.0-pro";
    if (
      quizParams.questionsType === "MCQ" ||
      quizParams.questionsType === "MSQ"
    ) {
      if (quizParams.inputType === "images") {
        parts = [
          {
            text: `Strictly create only a JSON format containing ${quizParams.numberOfQuestions} ${questionsTypeFullForm} strictly using the following JSON format:\n[{question" : "question statement","options" : ["option1", "option2", "option3", "option4"],"correct_ans" : ["option"]\n}] from the image `,
          },
          images.map((image) => {
            const base64Data = image.split(",")[1]; // Extract Base64 data
            return {
              inlineData: {
                mimeType: "image/png",
                data: base64Data,
              },
            };
          }),
          { text: ` of difficulty level ${quizParams.difficultyLevel}.` },
        ];
      } else {
        parts = [
          {
            text: `Strictly create a JSON format containing ${quizParams.numberOfQuestions} ${questionsTypeFullForm} using the following JSON format:[{"question" : "question statement","options" : ["option1", "option2", "option3", "option4"],"correct_ans" : ["option"]}] from the ${quizParams.inputType} "${quizParams.inputValue}" of difficulty level ${quizParams.difficultyLevel}.`,
          },
        ];
      }
    } else {
      if (quizParams.inputType === "images") {
        parts = [
          {
            text: `Strictly create only a JSON format containing ${quizParams.numberOfQuestions} ${questionsTypeFullForm} using the following JSON format:\n[{"question" : "question statement","correct_ans" : "complete answer for this question", "time" : expected time to solve the question in minutes}] from the image `,
          },
          images.map((image) => {
            const base64Data = image.split(",")[1]; // Extract Base64 data
            return {
              inlineData: {
                mimeType: "image/png",
                data: base64Data,
              },
            };
          }),
          { text: ` of difficulty level ${quizParams.difficultyLevel}.` },
        ];
      } else {
        parts = [
          {
            text: `Strictly create a JSON format containing ${quizParams.numberOfQuestions} ${questionsTypeFullForm} using the following JSON format:[{"question" : "question statement","correct_ans" : "complete answer for this question", "time" : expected time to solve the question in minutes}] from the ${quizParams.inputType} "${quizParams.inputValue}" of difficulty level ${quizParams.difficultyLevel}.`,
          },
        ];
      }
    }
    prompt(MODEL_NAME, generationConfig, parts)
      .then((res) => setQuestions(res))
      .finally(() => setPreLoader(null));
  };

  // Function to publish and share quiz
  const shareQuiz = () => {
    if (!quizId) {
      setPreLoader("Saving...");
      request("/api/quizzes", "POST", {
        data: {
          ...quizParams,
          questions: questions,
        },
      })
        .then((res) => {
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
    <div className="container" data-bs-theme="dark">
      {questions && (
        <div className="input-group mt-3">
          <input
            value={quizParams.name}
            onChange={(event) => handleInputChange(event)}
            name="name"
            type="text"
            className="form-control"
            placeholder="Quiz name"
            maxLength={50}
          />
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`tooltip-top`}>
                <strong>Regenerate</strong>
              </Tooltip>
            }
          >
            <button
              onClick={() => {
                setQuestions(null);
                setQuizId(null);
              }}
              className="btn btn-danger"
            >
              <i className="fa-solid fa-arrow-rotate-right"></i>
            </button>
          </OverlayTrigger>
          <OverlayTrigger
            placement={"top"}
            overlay={
              <Tooltip id={`tooltip-top`}>
                <strong>Share</strong>
              </Tooltip>
            }
          >
            <button
              onClick={() => shareQuiz()}
              className="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
            </button>
          </OverlayTrigger>
        </div>
      )}
      <div className="d-flex justify-content-center">
        {questions ? (
          <Slider
            editable={true}
            questionsType={quizParams.questionsType}
            questions={questions}
            setQuestions={setQuestions}
            setAlert={setAlert}
          />
        ) : (
          <div className="create card border mt-5" style={{ minWidth: "50%" }}>
            <div className="card-body">
              <h4 className="card-title fw-bold mb-3">Create a new quiz:</h4>
              <form onSubmit={(event) => handleSubmit(event)}>
                {/* Input type: Topic or Text or images */}
                <div className="mb-3">
                  <select
                    className="form-select"
                    name="inputType"
                    aria-label="Default select example"
                    defaultValue={quizParams.inputType}
                    defaultChecked={quizParams.inputType}
                    onChange={(event) => {
                      handleInputChange(event);
                      setQuizParams((prev) => ({ ...prev, inputValue: "" }));
                    }}
                    required
                  >
                    <option value="topic">Topic</option>
                    <option value="text">Text</option>
                    <option value="images">Image</option>
                  </select>
                </div>

                {/* Input value for the selected input type */}
                {quizParams.inputType !== "images" ? (
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
                ) : (
                  <div>
                    <div className="input-group mb-3">
                      <input
                        capture="environment"
                        name="inputValue"
                        accept=".jpg,.png"
                        type="file"
                        onChange={(event) => handleInputChange(event)}
                        className="form-control"
                        id="inputGroupFile02"
                        multiple
                        required
                      />
                    </div>
                    <div className="mb-3 d-flex flex-wrap">
                      {quizParams.inputType === "images" &&
                        Array.isArray(quizParams.inputValue) &&
                        quizParams.inputValue.map((imageUrl, index) => (
                          <img
                            className="img-fluid me-1 mb-1"
                            style={{ height: "10rem" }}
                            src={imageUrl}
                            key={index}
                            alt={`input ${index + 1}`}
                          />
                        ))}
                    </div>
                  </div>
                )}

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
                <button
                  type="submit"
                  className="btn btn-md btn-outline-secondary w-100"
                >
                  Generate questions
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
