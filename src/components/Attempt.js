import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { decrypt } from './func/encryptDecrypt.js';
import request from "./func/request.js";
import Slider from "./Slider.js";

export default function Attempt({ setAlert, setModal }) {
  // Get the location object
  const location = useLocation();
  // Parse the query string to get parameters
  const queryParams = new URLSearchParams(location.search);
  const qid = queryParams.get("qid");
  const [quizId, setQuizId] = useState(null);
  useEffect(() => {
    // decrypt qid and set it to state
    if (qid) {
      const decryptedQuizId = decrypt(qid);
      setQuizId(decryptedQuizId);
    }
  }, [qid]);

  const [quiz, setQuiz] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      if (quizId) {
        await request(`/api/quizzes/${quizId}`, "GET").then((res) => {
          setQuiz(res.data.attributes);
        });
      }
    };
    fetchData();
  }, [quizId]);

  return (
    <div className="container">
      {quiz && <Slider setAlert={setAlert} questionsType={quiz.questionsType} questions={quiz.questions} setQuestions={(questions) => {
        setQuiz((prev) => ({
          ...prev,
          questions: questions
        }));
      }} />}
    </div>
  );
}
