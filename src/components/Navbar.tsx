import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { NavbarContainer, NavbarRight, LogoutButton } from '../styles/NavbarStyles';
import axios from 'axios';


const Navbar: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useState<Boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isUserLoggedIn = async () => {
            const res = await axios.get('http://localhost:3001/logged_in', { withCredentials: true });

            if (res.data) {
                const { loggedIn, email } = res.data;
                setLoggedIn(loggedIn);
                setUserEmail(email);
            }
        }

        isUserLoggedIn()
    }, [location])

    const onLogout = async () => {
        console.log('Logging user out');
        const res = await axios.delete('http://localhost:3001/logout', { withCredentials: true })
        if (res.status === 200) {
            navigate('/');
        }
        return;
    }

    return (
        <>
            <NavbarContainer>
                <div className="navbar-left">Arkestro</div>
                {isLoggedIn === true && <NavbarRight>
                    {userEmail && <span>{userEmail}</span>}
                    <LogoutButton onClick={onLogout}>Logout</LogoutButton>
                </NavbarRight>}
            </NavbarContainer>
        </>
    )
}

export default Navbar;
