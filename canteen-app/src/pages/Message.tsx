import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Message: React.FC = () => {
    const [searchParams] = useSearchParams();
    const accessTokenValue = searchParams.get('access_token');
    const refreshTokenValue = searchParams.get('refresh_token');

    useEffect(() => {
        console.log(accessTokenValue);
        
    }, [accessTokenValue])

    return (
        <div>
            <h1>Message Page</h1>
            <p>This is the message page.</p>
            {
                accessTokenValue && refreshTokenValue ?
                    <div className="text-green-500">
                        You are logined at session
                    </div>
                    :
                    <div className="text-green-500">
                        You are not logined at session
                    </div>
            }
        </div>
    );
};

export default Message;