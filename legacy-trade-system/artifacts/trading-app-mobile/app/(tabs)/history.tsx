import React, { useCallback, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useAuthContext } from "@/context/AuthContext";
import { useDerivContext, ClosedPosition, OpenPosition } from "@/context/DerivContext";

const CONTRACT_LABELS: Record<string, string> = {
  DIGITMATCH: "Match", DIGITDIFF: "Differ",
  DIGITOVER: "Over", DIGITUNDER: "Under",
  DIGITEVEN: "Even", DIGITODD: "Odd",
  CALL: "Rise", PUT: "Fall",
};

function PositionCard({ item, type }: { item: OpenPosition | ClosedPosition; type: "open" | "closed" }) {
  const colors = useColors();
  const pl = type === "closed" ? ((item as ClosedPosition).sell_price - item.buy_price) : null;
  const isProfit = pl !== null && pl >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.typeBadge, { backgroundColor: colors.blueDim }]}>
          <Text style={[styles.typeBadgeText, { color: colors.blue }]}>
            {CONTRACT_LABELS[item.contract_type] ?? item.contract_type}
          </Text>
        </View>
        <Text style={[styles.symbol, { color: colors.mutedForeground }]} numberOfLines={1}>
          {item.underlying_symbol}
        </Text>
        {pl !== null && (
          <Text style={[styles.pl, { color: isProfit ? colors.green : colors.red }]}>
            {isProfit ? "+" : ""}{pl.toFixed(2)} USD
          </Text>
        )}
        {type === "open" && (
          <View style={[styles.openBadge, { backgroundColor: colors.goldDim }]}>
            <Text style={[styles.openText, { color: colors.gold }]}>OPEN</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBottom}>
        <Text style={[styles.detail, { color: colors.mutedForeground }]}>
          Stake: <Text style={{ color: colors.foreground }}>{item.buy_price.toFixed(2)} USD</Text>
        </Text>
        {type === "closed" && (
          <Text style={[styles.detail, { color: colors.mutedForeground }]}>
            Payout: <Text style={{ color: colors.foreground }}>
              {((item as ClosedPosition).sell_price ?? 0).toFixed(2)} USD
            </Text>
          </Text>
        )}
        <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
          {new Date((type === "closed"
            ? (item as ClosedPosition).sell_time
            : (item as OpenPosition).purchase_time) * 1000
          ).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;
  const [tab, setTab] = useState<"open" | "closed">("closed");

  const { authState, login } = useAuthContext();
  const { openPositions, closedPositions, isConnected } = useDerivContext();

  const handleLogin = useCallback(() => {
    Haptics.selectionAsync();
    login();
  }, [login]);

  if (authState === "unauthenticated" || authState === "error") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.loginPrompt}>
          <View style={[styles.iconWrap, { backgroundColor: colors.goldDim }]}>
            <Feather name="activity" size={32} color={colors.gold} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Positions & History</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Log in with your Deriv account to see your open positions and closed trade history.
          </Text>
          <Pressable
            onPress={handleLogin}
            style={[styles.loginBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="log-in" size={16} color={colors.primaryForeground} />
            <Text style={[styles.loginBtnText, { color: colors.primaryForeground }]}>Login with Deriv</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (authState === "authenticating") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator color={colors.gold} size="large" />
        <Text style={[styles.body, { color: colors.mutedForeground, marginTop: 16 }]}>Authenticating…</Text>
      </View>
    );
  }

  const data = tab === "open" ? openPositions : closedPositions;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tab switcher */}
      <View style={[styles.tabBar, { backgroundColor: colors.panel, borderBottomColor: colors.border, paddingTop: topPad }]}>
        {(["open", "closed"] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => { Haptics.selectionAsync(); setTab(t); }}
            style={[styles.tabBtn, t === tab && { borderBottomColor: colors.gold, borderBottomWidth: 2 }]}
          >
            <Text style={[styles.tabText, { color: t === tab ? colors.gold : colors.mutedForeground }]}>
              {t === "open" ? `Open (${openPositions.length})` : `History (${closedPositions.length})`}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={data as (OpenPosition | ClosedPosition)[]}
        keyExtractor={(item) => item.contract_id.toString()}
        contentContainerStyle={styles.list}
        scrollEnabled={!!data.length}
        renderItem={({ item }) => (
          <PositionCard item={item} type={tab} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={28} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {!isConnected ? "Connecting…" : `No ${tab === "open" ? "open positions" : "recent trades"}`}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loginPrompt: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", textAlign: "center" },
  body: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22, maxWidth: 280 },
  loginBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10, marginTop: 8,
  },
  loginBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  tabBar: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  list: { padding: 16, gap: 8 },
  empty: { paddingTop: 60, alignItems: "center", gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  card: { borderRadius: 10, borderWidth: 1, padding: 12, gap: 8 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  typeBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  symbol: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  pl: { fontSize: 14, fontFamily: "Inter_700Bold" },
  openBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  openText: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  cardBottom: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  detail: { fontSize: 11, fontFamily: "Inter_400Regular" },
  timeText: { fontSize: 11, fontFamily: "Inter_400Regular", marginLeft: "auto" },
});
