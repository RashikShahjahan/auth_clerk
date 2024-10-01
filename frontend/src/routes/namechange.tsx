import React, { useState} from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const NameChangePage: React.FC = () => {
    const { getToken } = useAuth();
    const [username,setUsername] = useState(" ");

    const changeName=async(e:Event)=>{
        e.preventDefault();
        const token = await getToken();
        console.log(token);
        await axios.post('http://localhost:3000/changeName',{"user":{"name":username,}}, {
            headers: {
                Authorization: `Bearer ${token}`
                }
            });
        };
        console.log(username);

        return (
            <div>
                <form onSubmit={changeName}>
                    <input value = {username} onChange={
                        (e)=>setUsername(e.target.value)
                        }>                           
                        </input>
                    <button type="submit" >Change Name</button>
                </form>
            </div>
        );
    };

export default NameChangePage;