import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { accountSelectors } from '../store/account/state';
import { useAppSelector } from '../store/hooks';

function withAuth<T>(
    WrappedComponent: React.ComponentType<T>,
    redirect: string
) {
    return (props: T) => {
        const navigate = useNavigate();
        const authState = useAppSelector((state) => accountSelectors.Status(state.account));        
        useEffect(() => {
            if (authState !== 'login') {
                navigate(redirect, {replace: true});
            }
        }, [authState])
        return <WrappedComponent {...props} />
    }        
}

export { withAuth };
