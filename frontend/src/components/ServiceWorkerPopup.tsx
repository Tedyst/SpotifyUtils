import React, { useEffect } from 'react';
import { Snackbar, Button } from '@material-ui/core';
import * as serviceWorker from '../serviceWorker';

export default function ServiceWorkerWrapper() {
    const [showReload, setShowReload] = React.useState(false);
    const [waitingWorker, setWaitingWorker] = React.useState<ServiceWorker | null>(null);

    const onSWUpdate = (registration: ServiceWorkerRegistration) => {
        console.log("onSWUpdate");
        setShowReload(true);
        setWaitingWorker(registration.waiting);
    };

    console.log("ServiceWorkerWrapper");
    console.log(waitingWorker);
    useEffect(() => {
        console.log("register")
        serviceWorker.register({ onUpdate: onSWUpdate });
    }, []);

    const reloadPage = () => {
        waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
        setShowReload(false);
        window.location.reload(true);
    };

    return (
        <Snackbar
            open={showReload}
            message="A new version is available!"
            onClick={reloadPage}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            action={
                <Button
                    color="inherit"
                    size="small"
                    onClick={reloadPage}
                >
                    Reload
        </Button>
            }
        />
    );
}