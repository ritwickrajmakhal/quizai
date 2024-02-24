import QuizCard from "./QuizCard";

export default function User({ setAlert, userDataChanged, setUserDataChanged, setModal, userData }) {
  return (
    <div>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse"
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
            <div className="accordion-body d-flex flex-wrap ">
              {userData?.attributes.quizzes.data?.map((quiz, index) => (
                <QuizCard
                  key={index}
                  setAlert={setAlert}
                  type="created"
                  userDataChanged={userDataChanged}
                  setUserDataChanged={setUserDataChanged}
                  setModal={setModal}
                  quiz={quiz}
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
              {userData?.attributes.attempts.data?.map((attemptedQuiz, index) => {
                return (
                  <QuizCard
                    key={index}
                    type="attempted"
                    setModal={setModal}
                    quiz={attemptedQuiz}
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
