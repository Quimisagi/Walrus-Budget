import React from "react";
import { useState, useEffect } from "react";
import {View, Text, StyleSheet} from "react-native";
import Svg, {Circle} from "react-native-svg";

const CircularProgress = ({children, percentage, color}) => {

  const [strokeColor, setStrokeColor] = useState(color);
  const radius = 38.5;
  const strokeWidth = 5;
  const strokeDashoffset = 25;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const offset = circumference - percentage / 100 * circumference;

  const hexToRgba = (hex, alpha) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useEffect(() => {
    if(color){
      const strokeColor = hexToRgba(color, 0.2);
      setStrokeColor(strokeColor);
    }
  }
    , [color]);

  return (
    <View>
      <Svg
        height={radius * 2}
        width={radius * 2}
      >
        <Circle
          stroke={strokeColor}
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
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <View style={styles.center}>
          {children}
        </View>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 19,
  }
});

export default CircularProgress;
