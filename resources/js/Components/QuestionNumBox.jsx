const QuestionNumBox = ({ answers, flags, questions, setQuestionIndex, onQuestionChange }) => {
    const styles = {
      container: {
        overflowX: 'auto',
      },
    };

    return (
    <div>
      <style>
        {`
            .numbox{
                width: auto;
            }
            @media screen and (max-width: 600px) {
                .numbox {
                    max-height: 15vh;
                    overflow-x: auto;i
                }
            }
        `}
      </style>
      <div className="row p-3 rounded-md" style={{backgroundColor:'#C8D9FD'}}>
        <div className="grid grid-cols-5 gap-4 text-center" >
          <button className="bg-purple-700 rounded-md py-4 px-2 shadow-md text-white">1</button>
          <button className="bg-white rounded-md py-4 px-2 shadow-md text-purple">2</button>
          <button className="bg-white rounded-md py-4 px-2 shadow-md text-purple">3</button>
          {/* {questions
            ? Object.values(questions).map((question, index) => {
                let $bgcolor = 'bg-neutral-400';
                if (answers.has(question.questions.id) !== false) {
                  switch (answers.get(question.id)) {
                    case '':
                      $bgcolor = 'bg-neutral-500';
                      break;
                    default:
                      $bgcolor = 'bg-green-700';
                      break;
                  }
                }
                if (flags.get(index + 1)) $bgcolor = 'bg-yellow-500';
                return (
                  <button
                    onClick={(event) => {
                      onQuestionChange();
                      setQuestionIndex(index + 1);
                    }}
                    className={`rounded-md p-4 shadow-md ${$bgcolor}`}
                    key={index}
                  >
                    {index + 1}
                  </button>
                );
              })
            : ''} */}
        </div>
      </div>
    </div>
    );
  };

  export default QuestionNumBox;
