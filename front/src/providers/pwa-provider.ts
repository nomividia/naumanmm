import { Subject } from 'rxjs';

export class PwaProvider {
    private static deferredPrompt: any;
    static showInstallButton = new Subject<boolean>();

    static init() {
        if (typeof window === 'undefined') {
            return;
        }

        window.addEventListener('beforeinstallprompt', (e: any) => {
            // console.log(e);
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            PwaProvider.deferredPrompt = e;

            // tslint:disable-next-line: no-string-literal
            const isInPWAiOS =
                (window.navigator as any)['standalone'] &&
                (window.navigator as any)['standalone'] === true;
            const isInWebPWAChrome = window.matchMedia(
                '(display-mode: standalone)',
            ).matches;

            PwaProvider.showInstallButton.next(
                !isInWebPWAChrome && !isInPWAiOS,
            );
        });
    }

    static addToHomeScreen() {
        if (!PwaProvider.deferredPrompt) {
            return;
        }
        // hide our user interface that shows our A2HS button
        PwaProvider.showInstallButton.next(false);
        // Show the prompt
        PwaProvider.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        PwaProvider.deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            PwaProvider.deferredPrompt = null;
        });
    }
}
