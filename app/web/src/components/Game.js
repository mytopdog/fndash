import React from 'react';
import moment from 'moment-timezone';
import styled from 'styled-components';

const GameDiv = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 0.5rem;
  margin-bottom: 1rem;
  position: relative;

  h5,
  h4 {
    color: ${({ theme }) => theme.primary};
    text-transform: capitalize;
  }

  p {
    margin: 0;
  }

  > div {
    display: flex;
    justify-content: space-between;
  }

  i {
    margin-left: 0.5rem;
    color: ${({ theme }) => theme.primary};
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`;

function Game({
  data: {
    mode, time_played: timePlayed, kills, placement,
  },
}) {
  return (
    <GameDiv>
      <div>
        <h5>{mode} Match</h5>
        <p>{moment(timePlayed).format('MMM Do - h:mm a')}</p>
      </div>
      <div>
        <p>
          {kills} {kills === 1 ? 'Kill' : 'Kills'}
        </p>
        <p>
          {placement}
          {placement === 'Victory' ? (
            <i className="fas fa-trophy" />
          ) : (
            placement !== 'Loss' && <i className="fas fa-medal" />
          )}
        </p>
      </div>
    </GameDiv>
  );
}

export default Game;
