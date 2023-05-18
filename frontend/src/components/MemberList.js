import React from 'react';

const MemberList = ({ members }) => {
  return (
    <div className="member-list">
      <h3>Membros da Comunidade</h3>
      <ul>
        {members.map((member, index) => (
          <li key={index}>
            <img 
              src={member.profilePicture} 
              alt={member.name} 
              style={{width: '50px', height: '50px', borderRadius: '50%'}}
            />
            <p>{member.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
