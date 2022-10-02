import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
    return (
        <div className="client" style={{padding:5}}>
            <Avatar name={username} size={50} round="14px" />
            <p className="userName">{username}</p>
        </div>
    );
};

export default Client;