import React, { HtmlHTMLAttributes } from "react";
import { loginUser } from "../store/account/accountSlice";
import { useAppSelector, useAppDispatch } from "./../store/hooks"

function TempForm() {
    const textName = useAppSelector(state => state.account.name);
    const dispatch = useAppDispatch();

    function sendValue (e: React.MouseEvent<HTMLElement>) {
        dispatch(loginUser(textName));
    }

    function clearValue (e: React.MouseEvent<HTMLElement>) {
        dispatch(loginUser(""));
    }

    function textChange (e: React.ChangeEvent<HTMLTextAreaElement>) {
        dispatch(loginUser(e.target.value));
    }

    return (
        <div>
            <textarea value={textName} onChange={textChange}></textarea>
            <button onClick={clearValue}>Clear</button>
            <button onClick={sendValue} >Send</button>
        </div>
    )
}

export default TempForm;
