import { React, useState } from "react";
import CryptoJS from "crypto-js";
import { useLocation } from "react-router-dom";
import Slider from "./Slider";

export default function Quiz({ modal }) {
  // Get the location object
  const location = useLocation();
  const [questions, setQuestions] = useState(null);
  // Parse the query string to get parameters
  const queryParams = new URLSearchParams(location.search);
  const encryptedId = queryParams.get("qid");

  // Decrypt the quiz ID if id exists
  let qid = null;
  if (encryptedId) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedId,
        process.env.REACT_APP_SECRET_KEY
      );
      // Convert decrypted bytes to plaintext (original integer value)
      qid = bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return (
        <div>
          <h1>Quiz not found</h1>
          <p>Invalid quiz ID</p>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h1>Quiz not found</h1>
        <p>Quiz ID not found in URL</p>
      </div>
    );
  }

  // If quiz id is valid, fetch quiz questions from backend
  fetch(process.env.REACT_APP_STRAPI_API_URL + "/api/quizzes/" + qid)
    .then((response) => response.json())
    .then((data) => {
      setQuestions(data.data);
    });
  return (
    <div>
      {questions && (
        <Slider
          questionsType={questions.attributes.questionsType}
          questions={questions.attributes.questions}
        />
      )}
    </div>
  );
}
