
const QuestionNumBox = ({ answers, questions, currentIndex, setQuestionIndex, onQuestionChange, flags, isOpen, openModal }) => {
  return (
    <div className={`fixed right-0 top-0 h-full z-10 w-1/3 border-2 border-gray-200 shadow-md bg-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="row px-12 py-6 w-auto max-h-screen overflow-auto">
        <p className="text-center font-semibold text-xl text-blue-800 pb-6">Studi Kasus</p>
        <div className="grid xl:grid-cols-5 lg:grid-cols-3 grid-cols-2 gap-4 text-center text-white overflow-auto">
          {questions
            // ? Object.values(questions).map((question, index) => {
            ? questions.map((question, index) => {
              let $bgcolor = 'bg-neutral-300';
              let $textcolor = 'text-black';
              if (answers.has(question.id) !== false) {
                switch (answers.get(question.id)) {
                  case '':
                    $bgcolor = 'bg-neutral-300';
                    $textcolor = 'text-black';
                    break;
                  default:
                    $bgcolor = 'bg-blue-800';
                    $textcolor = 'text-white';
                    break;
                }
              }
              if ((index) === currentIndex) {
                $bgcolor = 'bg-blue-200';
                $textcolor = 'text-black';
              }
              return (
                <button
                  onClick={(event) => {
                    onQuestionChange();
                    setQuestionIndex(index);
                  }}
                  className={`relative rounded-md px-4 py-2 shadow-md ${$bgcolor} ${$textcolor}`}
                  key={question.id}
                >
                  {flags.get(question.id) && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-yellow-400 rounded-full border-2 border-white"></span>
                  )}
                  {index + 1}
                </button>
              );
            })
            : ''}
        </div>
        <button
          className="bg-blue-800 hover:bg-blue-200 text-white hover:text-blue-800 font-medium mt-5 w-full rounded-lg px-5 py-2 text-lg"
          onClick={() => {
            onQuestionChange();
            openModal();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionNumBox;
