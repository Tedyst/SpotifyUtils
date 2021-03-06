import React, { useEffect } from 'react';
import { Snackbar, Button } from '@material-ui/core';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

export default function ServiceWorkerWrapper() {
    const [showReload, setShowReload] = React.useState(localStorage.getItem('waitingForServiceWorker') === 'true');
    const [waitingWorker, setWaitingWorker] = React.useState<ServiceWorker | null>(null);

    const onSWUpdate = (registration: ServiceWorkerRegistration) => {
        setShowReload(true);
        setWaitingWorker(registration.waiting);
        localStorage.setItem('waitingForServiceWorker', 'true');
    };

    useEffect(() => {
        serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
    }, []);

    const reloadPage = () => {
        localStorage.removeItem('waitingForServiceWorker');
        waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
        setShowReload(false);
        window.location.reload(true);
    };

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={showReload}
            message="A new version is available!"
            autoHideDuration={6000}
            onClick={reloadPage}
            action={(
                <Button
                    color="inherit"
                    size="small"
                    onClick={reloadPage}
                >
                    Reload
                </Button>
            )}
        />
    );
}
