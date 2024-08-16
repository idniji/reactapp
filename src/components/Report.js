import React from 'react';
import './Report.css';

function Report({ ratings }) {
  return (
    <div className="report-container">
      <h2>채팅 리포트</h2>
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>대화 주제</th>
            <th>평점</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating, index) => (
            <tr key={index}>
              <td>{new Date(rating.date).toLocaleString()}</td>
              <td>{rating.topic}</td>
              <td>{rating.rating}/5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Report;