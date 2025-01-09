import { useState } from 'react';
import ConfirmationDialog from '../../../widgets/confirmation_dialog';

function UnblockComp({ user, onReleaseBlock }) {
    const [showDialog, setShowDialog] = useState(false);

    const changeDialog = (value) => {
        setShowDialog(value);
    };

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <div>
                    <h1>{user.username} is blocked</h1>
                    <button onClick={() => changeDialog(true)}>Release Block</button>
                </div>

                {showDialog && <ConfirmationDialog message={`Are you sure you want to release the block?`} onYes={() => onReleaseBlock(user)} onNo={() => changeDialog(false)} />}


            </div>
        </>
    );
}

export default UnblockComp;