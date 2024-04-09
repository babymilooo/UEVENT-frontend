import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Создаем контекст аутентификации
export const AuthContext = createContext({
    isAuthenticated: false,
    isLoading: true
});

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Доступ к хранилищу MobX
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;

    console.log("AuthProvider");
    useEffect(() => {
        console.log("useEffect");
        const checkAuthentication = async () => {
            try {
                const response = await userStore.checkAuth();
                setIsLoading(false);
                if (response?.status === 200) {
                    setIsAuthenticated(true);
                    console.log("User is authenticated");
                } else {
                    // Перенаправляем на страницу входа
                    router.push('/login');
                }
            } catch (error) {
                setIsLoading(false);
                console.error("Authentication check failed", error);
                // Перенаправляем на страницу входа
                router.push('/login');
            }
        };

        checkAuthentication();
    }, [router, userStore]);

    // Здесь мы предоставляем состояние аутентификации и загрузки всему дереву компонентов
    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
