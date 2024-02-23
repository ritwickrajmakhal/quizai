import QuizCard from "./QuizCard";

export default function User({ setModal, userData }) {
  return (
    <div>
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
            <div className="accordion-body d-flex flex-wrap">
              {userData?.attributes.quizzes.data?.map((quiz) => (
                <QuizCard
                  topic={quiz.attributes.topic}
                  difficultyLevel={quiz.attributes.difficultyLevel}
                  type={quiz.attributes.type}
                  questions={quiz.attributes.questions}
                  key={quiz.id}
                />
              ))}
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
              {userData?.attributes.attempts.data?.map((attemptedQuiz) => {
                const quiz = attemptedQuiz.attributes.quiz.data.attributes;
                return (
                  <QuizCard
                    topic={quiz.topic}
                    difficultyLevel={quiz.difficultyLevel}
                    type={quiz.type}
                    questions={quiz.questions}
                    key={attemptedQuiz.id}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
