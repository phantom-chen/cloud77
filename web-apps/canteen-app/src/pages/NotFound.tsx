import { useEffect } from "react";
import { useLocation, useRouteError } from "react-router-dom"

export default function NotFound() {
    // const error: unknown = useRouteError();
    const location = useLocation();
    
    useEffect(() => {
        console.log("NotFound page location:", location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        document.title = "404 Not Found";
        console.log(location);
    }, [location]);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <h3>Not found page for {location.pathname}.</h3>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                {/* <i>
                    {(error as { statusText?: string; message?: string })?.statusText ||
                        (error as { statusText?: string; message?: string })?.message}
                </i> */}
            </p>
        </div>
    )
}