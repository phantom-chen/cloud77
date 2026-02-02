import { useEffect, useState } from "react";

export const useAdminRole = (account: { name: string, role: string }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsAdmin(account.role === 'admin');
        }, 1000);
    })

    return { isAdmin };
}
