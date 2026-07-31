import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import type { DigitStats } from "@/context/DerivContext";

interface DigitGridProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onSelect: (digit: number) => void;
  showForType: "match-differ" | "over-under" | "none";
}

export function DigitGrid({ digitStats, selectedDigit, onSelect, showForType }: DigitGridProps) {
  const colors = useColors();

  const digits = Array.from({ length: 10 }, (_, i) => i);
  const maxPct = Math.max(...digitStats.percentages, 1);

  if (showForType === "none") return null;

  return (
    <View style={styles.grid}>
      {digits.map((d) => {
        const pct = digitStats.percentages[d] ?? 0;
        const isSelected = d === selectedDigit;
        const isHot = pct > 11.5;
        const isCold = pct < 8.5;
        const barColor = isHot ? colors.green : isCold ? colors.red : colors.mutedForeground;

        return (
          <Pressable
            key={d}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(d);
            }}
            style={[
              styles.cell,
              {
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.digit, { color: isSelected ? colors.primaryForeground : colors.foreground }]}>
              {d}
            </Text>
            <View style={[styles.barBg, { backgroundColor: colors.input }]}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(pct / maxPct) * 100}%` as any,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>
            <Text style={[styles.pct, { color: isSelected ? colors.primaryForeground : barColor }]}>
              {pct.toFixed(1)}%
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  cell: {
    width: "18%",
    borderRadius: 8,
    borderWidth: 1,
    padding: 6,
    alignItems: "center",
    gap: 3,
  },
  digit: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  barBg: {
    width: "100%",
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 2,
  },
  pct: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
  },
});
