import { useCallback, useEffect, useState } from "react";

export const useAccount = (username: string) => {
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState({ name: "", role: "" })

    const handleLogin = useCallback((name: string, role: string) => {
        setAccount({ name: name, role });
    }, [])

    useEffect(() => {
        setLoading(true);
        const to = setTimeout(() => {
            setLoading(false);
            const role: string = username.toLowerCase().startsWith("admin") ? "admin" : "visitor";
            handleLogin(username, role);
        }, 3000);

        return () => {
            clearTimeout(to);
        }
    }, [handleLogin, username])

    return {loading, account};
}
