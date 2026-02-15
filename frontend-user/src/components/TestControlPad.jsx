function TestControlPad({ disabled, onRespond }) {
    return (
        <div className="control-pad">
            <button
                type="button"
                className="action-btn left"
                disabled={disabled}
                onClick={() => onRespond('left')}
            >
                Left
            </button>
            <button
                type="button"
                className="action-btn right"
                disabled={disabled}
                onClick={() => onRespond('right')}
            >
                Right
            </button>
        </div>
    )
}

export default TestControlPad