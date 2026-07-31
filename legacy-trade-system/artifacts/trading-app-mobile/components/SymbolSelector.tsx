import React, { useState } from "react";
import {
  View, Text, Pressable, Modal, FlatList, StyleSheet, SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import type { ActiveSymbol } from "@/context/DerivContext";

interface SymbolSelectorProps {
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  onSelect: (symbol: string) => void;
}

function shortName(displayName: string): string {
  return displayName
    .replace("Volatility ", "V")
    .replace(" Index", "")
    .replace("(", "")
    .replace(")", "")
    .replace("1s", "1s");
}

export function SymbolSelector({ symbols, activeSymbol, onSelect }: SymbolSelectorProps) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          setOpen(true);
        }}
        style={[styles.trigger, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={[styles.badge, { backgroundColor: colors.goldDim }]}>
          <Text style={[styles.badgeText, { color: colors.gold }]}>VOL</Text>
        </View>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {activeSymbol ? shortName(activeSymbol.display_name) : "Loading…"}
        </Text>
        <Feather name="chevron-down" size={14} color={colors.mutedForeground} />
      </Pressable>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select Market</Text>
            <Pressable onPress={() => setOpen(false)}>
              <Feather name="x" size={22} color={colors.mutedForeground} />
            </Pressable>
          </View>
          <FlatList
            data={symbols}
            keyExtractor={(s) => s.symbol}
            contentContainerStyle={{ padding: 16, gap: 8 }}
            renderItem={({ item }) => {
              const isActive = item.symbol === activeSymbol?.symbol;
              return (
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    onSelect(item.symbol);
                    setOpen(false);
                  }}
                  style={[
                    styles.symRow,
                    {
                      backgroundColor: isActive ? colors.goldDim : colors.card,
                      borderColor: isActive ? colors.gold : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.symName, { color: isActive ? colors.gold : colors.foreground }]}>
                    {item.display_name}
                  </Text>
                  {isActive && <Feather name="check" size={16} color={colors.gold} />}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  name: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  symRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  symName: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
