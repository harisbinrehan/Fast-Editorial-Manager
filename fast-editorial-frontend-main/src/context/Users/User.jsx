import axios from "axios";
import { useEffect, useState } from "react";
import { createContext } from 'react';

export const UserContext = createContext();


export const UserProvider = (props) => {
    const [accessToken, setAccessToken] = useState(null);
    const [manuscriptId, setManuscriptId] = useState(null);
    const [user, setUser] = useState(null);
    const [authorId, setAuthorId] = useState(null);
    const [reviewerId, setReviewerId] = useState(null);
    const [editorId, setEditorId] = useState(null);
    const [loading, setLoading] = useState(false);


    const value = {
        manuscriptId,
        setManuscriptId,
        user,
        setUser,
        authorId,
        setAuthorId,
        reviewerId,
        setReviewerId,
        editorId,
        setEditorId,
        accessToken,
        setAccessToken,
        loading,
    };

    // useEffect(() => {
    //     const getData = async () => {
    //         const user = await localStorage.getItem("user");
    //         const accessToken = await localStorage.getItem("token");
    //         console.log("user", user);
    //         console.log("accessToken", accessToken);
    //         if (accessToken || user) {
    //             setAccessToken(accessToken);
    //             setUser(user);
    //         }
    //         setLoading(false);
    //     };
    //     getData();
    // }, []);


    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
};
