import React from 'react';
import styled from 'styled-components';
import Card from './Card';
import { colors } from '../assets/constants/colors';

const H3 = styled.h3`
  color: ${colors.primary};
`;

function getHoursPlayed(data, mode) {
  if (mode === 'solo') {
    return data[0];
  }
  if (mode === 'duo') {
    return data[1];
  }
  if (mode === 'squad') {
    return data[2];
  }
  return -1;
}

function TimePlayed({ data, mode }) {
  let hours = getHoursPlayed(data.datasets[0], mode);
  if (hours < 1) {
    hours = '< 1';
  }
  return (
    <Card>
      <H3>Time Played</H3>
      <h4>
        {hours} <span>Hours</span>
      </h4>
    </Card>
  );
}

export default TimePlayed;
