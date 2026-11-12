import { useEffect } from "react"

export default function Message() {

    useEffect(() => {
        window.addEventListener('message', function (ev) {
            if (ev.source !== window.parent) {
                return;
            }

            if (!ev.data) {
                return;
            }

            if (ev.data?.name === 'sync-tokens') {
                if (ev.data.accessToken) {
                    sessionStorage.setItem('user_access_token', ev.data.accessToken);
                    sessionStorage.setItem('user_refresh_token', ev.data.refreshToken);
                    setTimeout(() => {
                        window.parent.postMessage({
                            name: 'tokens_saved'
                        }, '*')
                    }, 3000);
                }
            }
        })
    }, [])

    return (
        <div className="message">
            message works
        </div>
    )
}