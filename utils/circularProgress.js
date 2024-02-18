import React from "react";

//Create a circular progress bar with SVG
import {View, Text, StyleSheet} from "react-native";
import Svg, {Circle} from "react-native-svg";
import Color from 'react-native-color';

const CircularProgress = ({percentage, color}) => {
  const radius = 35;
  const strokeWidth = 4;
  const strokeDashoffset = 25;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const offset = circumference - percentage / 100 * circumference;
  return (
    <View>
      <Svg
        height={radius * 2}
        width={radius * 2}
      >
        <Circle
          stroke={'gray'}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <Circle
          stroke={color}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  )
}

export default CircularProgress;
