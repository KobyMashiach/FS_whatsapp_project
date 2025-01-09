
function SenderMessageComp({ message }) {
    return (
        <div style={{
            position: 'absolute',
            right: 0,
            maxWidth: '150vh',
            padding: '10px',
            backgroundColor: 'green',
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
        }}>
            {message}
        </div>
    );
}

function ReceivedMessageComp({ message }) {
    return (
        <div style={{
            position: 'absolute',
            maxWidth: '150vh',
            padding: '10px',
            backgroundColor: 'grey',
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
        }}>
            {message}
        </div>
    );
}

export { SenderMessageComp, ReceivedMessageComp };