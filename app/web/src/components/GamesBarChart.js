import React from 'react';
import { Bar as BarChart } from 'react-chartjs-2';
import Card from './Card';
import { theme, pSBC } from '../assets/constants/colors';

const chartOptions = {
  responsive: true,
  aspectRatio: 2.5,
  legend: {
    display: false,
    position: 'bottom',
    labels: {
      fontColor: theme.fontColor,
    },
  },
  scales: {
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: theme.offWhite,
          beginAtZero: true,
        },
      },
    ],
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: theme.offWhite,
        },
      },
    ],
  },
};

const datasetNames = ['Games'];

const colors = [
  pSBC(-0.6, theme.lightGreen, false, true),
  pSBC(-0.5, theme.lightGreen, false, true),
  pSBC(-0.4, theme.lightGreen, false, true),
  pSBC(-0.3, theme.lightGreen, false, true),
  pSBC(-0.2, theme.lightGreen, false, true),
  pSBC(-0.1, theme.lightGreen, false, true),
  theme.lightGreen,
];

function GamesBarChart({ labels, datasets }) {
  const chartData = {
    labels,
    datasets: datasets.map((d, i) => ({
      data: d,
      label: datasetNames[i],
      backgroundColor: colors,
    })),
  };

  return (
    <Card>
      <h3>Games per Day</h3>
      <BarChart data={chartData} options={chartOptions} />
    </Card>
  );
}

export default GamesBarChart;
