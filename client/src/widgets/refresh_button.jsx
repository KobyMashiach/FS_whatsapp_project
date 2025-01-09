import { useState, useEffect } from 'react';

function RefreshButton({ marginRight = '0px' }) {
    return (
        <>
            <button
                onClick={() => window.location.reload()}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    marginRight,
                }}
            >
                Refresh Page
            </button>
        </>
    );
}

export default RefreshButton;