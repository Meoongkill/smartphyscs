const BottomNav = (
    {
        flags,
        questionIndex,
        length,
        onNext,
        onPrev,
        onSubmit,
        onFlag,
        onUnflag,
    }
) => {
    const isSmallScreen = window.innerWidth <= 600;
    return (
        <div className="w-full py-1">
            <div className="flex flex-row justify-center items-center gap-10 my-3 px-4">
                {
                    questionIndex != 1 ? <button onClick={onPrev}
                        className='py-2 rounded-md'
                        style={
                            {
                                width: "150px",
                                backgroundColor: "#3F51B5",
                                color: "white"
                            }
                    }>
                        {isSmallScreen ? '<' : 'Kembali'}
                    </button> : ""
                }
                {
                    questionIndex != length ? (
                        <button onClick={onNext}
                            className='py-2 rounded-md'
                            style={
                                {
                                    float: "right",
                                    width: "150px",
                                    backgroundColor: "#3F51B5",
                                    color: "white"
                                }
                        }>
                            {isSmallScreen ? '>' : 'Selanjutnya'}
                        </button>
                        ) : (
                            <button onClick={onSubmit}
                            className='py-2 rounded-md'
                            style={
                                {
                                    float: "right",
                                    width: "150px",
                                    backgroundColor: "#3F51B5",
                                    color: "white"
                                }
                            }> Submit </button>
                        )
                }
            </div>
        </div>
    )
}

export default BottomNav
