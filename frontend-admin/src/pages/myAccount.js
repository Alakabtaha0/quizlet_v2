import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/myaccount.css';


const MyAccount = () => {
    const [readOnlyFields, setReadOnlyFields] = useState({
        name: true,
        email: true,
        password: true
    });
    const [userData, setUserData] = useState({});
    const userID = localStorage.getItem('userID');
    const navigate = useNavigate();
    // Get user information
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`https://quizlet-01.nw.r.appspot.com/api/v1/users/${userID}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`
                    }
                });
                setUserData(res.data.user);
            } catch (err) {
                if (err.response.status === 401) {
                    localStorage.removeItem('userID');
                    Cookies.remove('jwt');
                    navigate('/login');
                    //window.location.href = '/login';
                }
            }
        }
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const editField = (e, field) => {
        e.preventDefault();
        setReadOnlyFields({
            ...readOnlyFields,
            [field]: false
        });
    }

    const updateField = (e, field) => {
        e.preventDefault();
        setReadOnlyFields({
            ...readOnlyFields,
            [field]: true
        });
        const value = document.querySelector(`#${field}-field`).value;
        axios.patch(`https://quizlet-01.nw.r.appspot.com/api/v1/users/${userID}`, {
            [field]: value,
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`
            }
        }).then(() => {
            window.location.reload();
        }).catch((err) => {
            if (err.response.status === 401) {
                localStorage.removeItem('userID');
                Cookies.remove('jwt');
                navigate('/login');
                //window.location.href = '/login';
            }
        });
    }

    return (
        <div className='set-scroll page-view'>
            <form className='form-format'>
                <div className='detail-block'>
                    <label>Name</label>
                    <input id='name-field' placeholder={userData.name} readOnly={readOnlyFields.name} />
                    {readOnlyFields.name ? <button onClick={(e) => editField(e, 'name')}>Edit</button> :
                        <button onClick={(e) => updateField(e, 'name')}>Update</button>}
                </div>
                <div className='detail-block'>
                    <label>Email</label>
                    <input id='email-field' placeholder={userData.email} readOnly={readOnlyFields.email} />
                    {readOnlyFields.email === true ? <button onClick={(e) => editField(e, 'email')}>Edit</button> :
                        <button onClick={(e) => updateField(e, 'email')}>Update</button>}
                </div>
                <div className='detail-block'>
                    <label>Password</label>
                    <input id='password-field' placeholder='********' readOnly={readOnlyFields.password} />
                    {readOnlyFields.password === true ? <button onClick={(e) => editField(e, 'password')}>Edit</button> :
                        <button onClick={(e) => updateField(e, 'password')}>Update</button>}
                </div>
            </form>
        </div>
    )


}

export default MyAccount