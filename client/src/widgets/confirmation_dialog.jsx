function ConfirmationDialog({ message, onYes, onNo }) {
    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    zIndex: 1000,
                }}
            >
                <p>{message}</p>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '10px',
                    }}
                >
                    <button
                        onClick={onYes}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#d9534f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Yes
                    </button>
                    <button
                        onClick={onNo}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#5bc0de',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        No
                    </button>
                </div>
            </div>

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999,
                }}
                onClick={onNo}
            />
        </>
    );
}

export default ConfirmationDialog;
