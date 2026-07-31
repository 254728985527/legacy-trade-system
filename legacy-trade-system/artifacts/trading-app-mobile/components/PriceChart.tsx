import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path, Polyline, Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";

interface PriceChartProps {
  prices: number[];
  pipSize: number;
}

export function PriceChart({ prices, pipSize }: PriceChartProps) {
  const colors = useColors();
  const width = Dimensions.get("window").width - 32;
  const height = 160;
  const padH = 8;
  const padV = 12;

  const { points, isRising, currentPrice } = useMemo(() => {
    if (prices.length < 2) return { points: "", isRising: true, currentPrice: null };
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const pts = prices.map((p, i) => {
      const x = padH + (i / (prices.length - 1)) * (width - padH * 2);
      const y = padV + ((max - p) / range) * (height - padV * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const rising = prices[prices.length - 1] >= prices[prices.length - 2];
    return { points: pts.join(" "), isRising: rising, currentPrice: prices[prices.length - 1] };
  }, [prices, width, height]);

  const lineColor = isRising ? colors.green : colors.red;
  const gradId = isRising ? "greenGrad" : "redGrad";
  const gradColor = isRising ? "#3fb950" : "#f85149";

  const closedPath = useMemo(() => {
    if (!points) return "";
    const pts = points.split(" ").map((p) => p.split(",").map(Number));
    if (pts.length < 2) return "";
    const first = pts[0];
    const last = pts[pts.length - 1];
    return `M ${points.replace(/,/g, " L ").split(" L ").join(" L ")} L ${last[0]} ${height - padV} L ${first[0]} ${height - padV} Z`;
  }, [points, height]);

  const formattedPrice = currentPrice !== null ? currentPrice.toFixed(pipSize) : "—";

  if (prices.length < 2) {
    return (
      <View style={[styles.container, { width, height, backgroundColor: colors.panel }]}>
        <Text style={[styles.waiting, { color: colors.mutedForeground }]}>Waiting for data…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.panel }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={gradColor} stopOpacity="0.3" />
            <Stop offset="1" stopColor={gradColor} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>
        <Path d={closedPath} fill={`url(#${gradId})`} />
        <Polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {(() => {
          const lastPt = points.split(" ").pop()?.split(",");
          if (!lastPt) return null;
          return (
            <Circle
              cx={parseFloat(lastPt[0])}
              cy={parseFloat(lastPt[1])}
              r={4}
              fill={lineColor}
            />
          );
        })()}
      </Svg>
      <Text style={[styles.price, { color: lineColor }]}>{formattedPrice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  waiting: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
    fontSize: 13,
  },
  price: {
    position: "absolute",
    right: 10,
    bottom: 8,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
