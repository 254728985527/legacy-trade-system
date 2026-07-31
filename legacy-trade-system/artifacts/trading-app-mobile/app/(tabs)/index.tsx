import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  Platform, ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useDerivContext } from "@/context/DerivContext";
import { useAuthContext } from "@/context/AuthContext";
import { PriceChart } from "@/components/PriceChart";
import { DigitGrid } from "@/components/DigitGrid";
import { SymbolSelector } from "@/components/SymbolSelector";

type TradeType = "M/D" | "O/U" | "E/O" | "R/F";
type ContractMode = "DIGITMATCH" | "DIGITDIFF" | "DIGITOVER" | "DIGITUNDER" | "DIGITEVEN" | "DIGITODD" | "CALL" | "PUT";

const TRADE_TABS: TradeType[] = ["M/D", "O/U", "E/O", "R/F"];

const MODES: Record<TradeType, ContractMode[]> = {
  "M/D": ["DIGITMATCH", "DIGITDIFF"],
  "O/U": ["DIGITOVER", "DIGITUNDER"],
  "E/O": ["DIGITEVEN", "DIGITODD"],
  "R/F": ["CALL", "PUT"],
};

const MODE_LABELS: Record<ContractMode, string> = {
  DIGITMATCH: "Match", DIGITDIFF: "Differ",
  DIGITOVER: "Over", DIGITUNDER: "Under",
  DIGITEVEN: "Even", DIGITODD: "Odd",
  CALL: "Rise", PUT: "Fall",
};

const DIGIT_TYPES: TradeType[] = ["M/D", "O/U"];

export default function TradeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const {
    isConnected, symbols, activeSymbol, selectSymbol,
    currentPrice, lastDigit, prices, digitStats, pipSize,
    ldpDigit, ldpConfidence, riseCount, fallCount, streak, streakDir,
    getProposal, buyContract,
  } = useDerivContext();

  const { authState, login, activeAccount, accounts, switchAccount, logout } = useAuthContext();
  const isAuthenticated = authState === "authenticated";

  const [tradeType, setTradeType] = useState<TradeType>("M/D");
  const [contractMode, setContractMode] = useState<ContractMode>("DIGITMATCH");
  const [selectedDigit, setSelectedDigit] = useState(5);
  const [stake, setStake] = useState("10");
  const [martingale, setMartingale] = useState("1");
  const [proposalPayout, setProposalPayout] = useState<number | null>(null);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [buyResult, setBuyResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const proposalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const riseTotal = riseCount + fallCount;
  const risePct = riseTotal > 0 ? (riseCount / riseTotal) * 100 : 50;
  const fallPct = 100 - risePct;

  const handleTradeTypeChange = useCallback((t: TradeType) => {
    Haptics.selectionAsync();
    setTradeType(t);
    setContractMode(MODES[t][0]);
    setProposalPayout(null);
    setProposalId(null);
  }, []);

  const handleModeChange = useCallback((m: ContractMode) => {
    Haptics.selectionAsync();
    setContractMode(m);
    setProposalPayout(null);
    setProposalId(null);
  }, []);

  const isBuyRise = contractMode === "CALL";
  const buyColor = isBuyRise ? colors.green : (contractMode === "PUT" ? colors.red : colors.green);
  const buyLabel = tradeType === "R/F"
    ? (contractMode === "CALL" ? "BUY RISE" : "BUY FALL")
    : `BUY ${MODE_LABELS[contractMode].toUpperCase()}`;

  const ldpStrength = ldpConfidence > 15 ? "STRONG" : ldpConfidence > 12 ? "MODERATE" : "WEAK";
  const ldpColor = ldpConfidence > 15 ? colors.green : ldpConfidence > 12 ? colors.gold : colors.mutedForeground;

  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  // Fetch a live proposal when authenticated and params change
  useEffect(() => {
    if (!isAuthenticated || !activeSymbol) return;
    if (proposalTimer.current) clearTimeout(proposalTimer.current);

    proposalTimer.current = setTimeout(async () => {
      const stakeNum = parseFloat(stake);
      if (!stakeNum || stakeNum <= 0) return;

      const params: Record<string, unknown> = {
        amount: stakeNum,
        basis: "stake",
        contract_type: contractMode,
        currency: activeAccount?.currency ?? "USD",
        duration: 1,
        duration_unit: "t",
        symbol: activeSymbol.symbol,
      };
      if (DIGIT_TYPES.includes(tradeType) && contractMode !== "DIGITEVEN" && contractMode !== "DIGITODD") {
        params.barrier = String(selectedDigit);
      }

      const proposal = await getProposal(params);
      if (proposal) {
        setProposalPayout(proposal.payout);
        setProposalId(proposal.id);
      }
    }, 600);

    return () => { if (proposalTimer.current) clearTimeout(proposalTimer.current); };
  }, [isAuthenticated, contractMode, selectedDigit, stake, activeSymbol, activeAccount, tradeType, getProposal]);

  const handleBuy = useCallback(async () => {
    if (!isAuthenticated) { login(); return; }
    if (!proposalId || isBuying) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsBuying(true);
    setBuyResult(null);

    const result = await buyContract(proposalId, parseFloat(stake));
    setIsBuying(false);
    setBuyResult(result.success ? { ok: true, msg: "Contract purchased!" } : { ok: false, msg: result.error ?? "Buy failed" });
    setProposalId(null);
    setProposalPayout(null);
    setTimeout(() => setBuyResult(null), 3000);
  }, [isAuthenticated, proposalId, isBuying, stake, login, buyContract]);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 12, paddingBottom: bottomPad + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <SymbolSelector symbols={symbols} activeSymbol={activeSymbol} onSelect={selectSymbol} />
        <View style={[styles.liveBadge, { backgroundColor: isConnected ? colors.greenDim : colors.redDim }]}>
          <View style={[styles.liveDot, { backgroundColor: isConnected ? colors.green : colors.red }]} />
          <Text style={[styles.liveText, { color: isConnected ? colors.green : colors.red }]}>
            {isConnected ? "LIVE" : "OFF"}
          </Text>
        </View>
        {isAuthenticated ? (
          <Pressable
            onPress={() => { Haptics.selectionAsync(); logout(); }}
            style={[styles.accountBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.accountText, { color: colors.foreground }]} numberOfLines={1}>
              {activeAccount?.account_id ?? "—"}
            </Text>
            <Feather name="log-out" size={12} color={colors.mutedForeground} />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => { Haptics.selectionAsync(); login(); }}
            style={[styles.loginChip, { backgroundColor: colors.goldDim, borderColor: colors.gold }]}
          >
            <Feather name="log-in" size={12} color={colors.gold} />
            <Text style={[styles.loginChipText, { color: colors.gold }]}>Login</Text>
          </Pressable>
        )}
      </View>

      {/* Account switcher if multiple accounts */}
      {isAuthenticated && accounts.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
          {accounts.map((a) => (
            <Pressable
              key={a.account_id}
              onPress={() => { Haptics.selectionAsync(); switchAccount(a.account_id); }}
              style={[
                styles.accountChip,
                {
                  backgroundColor: a.account_id === activeAccount?.account_id ? colors.goldDim : colors.card,
                  borderColor: a.account_id === activeAccount?.account_id ? colors.gold : colors.border,
                },
              ]}
            >
              <Text style={[styles.accountChipText, {
                color: a.account_id === activeAccount?.account_id ? colors.gold : colors.mutedForeground,
              }]}>
                {a.account_id} · {a.currency}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Price + LDP row */}
      <View style={styles.priceRow}>
        <View style={styles.priceLeft}>
          <Text style={[styles.priceLarge, { color: colors.foreground }]}>
            {currentPrice !== null ? currentPrice.toFixed(pipSize) : "—"}
          </Text>
          {lastDigit !== null && (
            <View style={[styles.digitBadge, { backgroundColor: colors.blueDim }]}>
              <Text style={[styles.digitText, { color: colors.blue }]}>{lastDigit}</Text>
            </View>
          )}
        </View>
        {ldpDigit !== null && (
          <View style={[styles.ldpBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.ldpLabel, { color: colors.mutedForeground }]}>LDP</Text>
            <Text style={[styles.ldpStrength, { color: ldpColor }]}>{ldpStrength}</Text>
            <View style={[styles.ldpPct, { backgroundColor: ldpColor + "22" }]}>
              <Text style={[styles.ldpPctText, { color: ldpColor }]}>{ldpConfidence.toFixed(0)}%</Text>
            </View>
            <View style={[styles.ldpDigitBadge, { backgroundColor: ldpColor + "22" }]}>
              <Text style={[styles.ldpDigitText, { color: ldpColor }]}>{ldpDigit}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Chart */}
      <PriceChart prices={prices} pipSize={pipSize} />

      {/* Trend row */}
      {riseTotal > 5 && (
        <View style={[styles.trendRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.trendSide}>
            <Feather name="trending-up" size={16} color={colors.green} />
            <Text style={[styles.trendPct, { color: colors.green }]}>{risePct.toFixed(0)}%</Text>
            <Text style={[styles.trendLabel, { color: colors.mutedForeground }]}>RISE</Text>
          </View>
          <View style={[styles.streakBadge, {
            backgroundColor: streakDir === "rise" ? colors.greenDim : colors.redDim,
          }]}>
            <Text style={[styles.streakText, { color: streakDir === "rise" ? colors.green : colors.red }]}>
              {streak}× {streakDir === "rise" ? "UP" : "DN"}
            </Text>
          </View>
          <View style={styles.trendSide}>
            <Feather name="trending-down" size={16} color={colors.red} />
            <Text style={[styles.trendPct, { color: colors.red }]}>{fallPct.toFixed(0)}%</Text>
            <Text style={[styles.trendLabel, { color: colors.mutedForeground }]}>FALL</Text>
          </View>
        </View>
      )}

      {/* Trade type tabs */}
      <View style={[styles.tabRow, { backgroundColor: colors.panel, borderColor: colors.border }]}>
        {TRADE_TABS.map((t) => (
          <Pressable
            key={t}
            onPress={() => handleTradeTypeChange(t)}
            style={[
              styles.tab,
              tradeType === t && { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.tabText, { color: tradeType === t ? colors.foreground : colors.mutedForeground }]}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Contract mode buttons */}
      <View style={styles.modeRow}>
        {MODES[tradeType].map((m) => (
          <Pressable
            key={m}
            onPress={() => handleModeChange(m)}
            style={[
              styles.modeBtn,
              {
                backgroundColor: contractMode === m ? colors.card : "transparent",
                borderColor: contractMode === m ? colors.border : colors.border + "44",
                flex: 1,
              },
            ]}
          >
            <Text style={[styles.modeBtnText, { color: contractMode === m ? colors.foreground : colors.mutedForeground }]}>
              {MODE_LABELS[m]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Digit grid */}
      {DIGIT_TYPES.includes(tradeType) && (
        <>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            PREDICTION BARRIER (0–9)
          </Text>
          <DigitGrid
            digitStats={digitStats}
            selectedDigit={selectedDigit}
            onSelect={setSelectedDigit}
            showForType={tradeType === "M/D" ? "match-differ" : "over-under"}
          />
        </>
      )}

      {/* Stake + Martingale */}
      <View style={styles.stakeRow}>
        <View style={[styles.stakeBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.stakeLabel, { color: colors.mutedForeground }]}>STAKE</Text>
          <TextInput
            value={stake}
            onChangeText={(v) => { setStake(v); setProposalPayout(null); setProposalId(null); }}
            keyboardType="decimal-pad"
            style={[styles.stakeInput, { color: colors.foreground }]}
            placeholderTextColor={colors.mutedForeground}
          />
        </View>
        <View style={[styles.stakeBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.stakeLabel, { color: colors.mutedForeground }]}>MARTINGALE</Text>
          <TextInput
            value={martingale}
            onChangeText={setMartingale}
            keyboardType="decimal-pad"
            style={[styles.stakeInput, { color: colors.foreground }]}
            placeholderTextColor={colors.mutedForeground}
          />
        </View>
      </View>

      {/* Prediction summary */}
      {isAuthenticated && proposalPayout !== null && (
        <View style={[styles.predictionRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.predictionLabel, { color: colors.mutedForeground }]}>PREDICTION</Text>
          <Text style={[styles.predictionText, { color: colors.foreground }]} numberOfLines={1}>
            {MODE_LABELS[contractMode]} {DIGIT_TYPES.includes(tradeType) ? `digit ${selectedDigit}` : ""}
          </Text>
          <Text style={[styles.predictionPayout, { color: colors.gold }]}>
            {proposalPayout.toFixed(2)} USD
          </Text>
        </View>
      )}

      {/* Buy result */}
      {buyResult && (
        <View style={[styles.resultBanner, {
          backgroundColor: buyResult.ok ? colors.greenDim : colors.redDim,
          borderColor: buyResult.ok ? colors.green : colors.red,
        }]}>
          <Feather name={buyResult.ok ? "check-circle" : "x-circle"} size={14} color={buyResult.ok ? colors.green : colors.red} />
          <Text style={[styles.resultText, { color: buyResult.ok ? colors.green : colors.red }]}>
            {buyResult.msg}
          </Text>
        </View>
      )}

      {/* Buy button */}
      {isAuthenticated ? (
        <Pressable
          onPress={handleBuy}
          disabled={isBuying || !proposalId}
          style={[
            styles.buyBtn,
            {
              backgroundColor: buyColor + "22",
              borderColor: buyColor,
              opacity: isBuying || !proposalId ? 0.5 : 1,
            },
          ]}
        >
          {isBuying ? (
            <ActivityIndicator size="small" color={buyColor} />
          ) : (
            <Feather name="zap" size={14} color={buyColor} />
          )}
          <Text style={[styles.buyText, { color: buyColor }]}>
            {isBuying ? "Placing…" : buyLabel}
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => { Haptics.selectionAsync(); login(); }}
          style={[styles.buyBtn, { backgroundColor: colors.goldDim, borderColor: colors.gold }]}
        >
          <Feather name="log-in" size={14} color={colors.gold} />
          <Text style={[styles.buyText, { color: colors.gold }]}>Login to Trade</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  headerRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  liveBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  loginChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
  },
  loginChipText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  accountBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, borderWidth: 1,
    maxWidth: 120,
  },
  accountText: { fontSize: 10, fontFamily: "Inter_500Medium", flex: 1 },
  accountsScroll: { marginHorizontal: -4 },
  accountChip: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 1,
    marginHorizontal: 4,
  },
  accountChipText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  priceLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  priceLarge: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  digitBadge: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
  },
  digitText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  ldpBox: {
    flexDirection: "row", alignItems: "center", gap: 6,
    padding: 8, borderRadius: 10, borderWidth: 1,
  },
  ldpLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  ldpStrength: { fontSize: 10, fontFamily: "Inter_500Medium" },
  ldpPct: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  ldpPctText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  ldpDigitBadge: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  ldpDigitText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  trendRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 12, borderRadius: 10, borderWidth: 1,
  },
  trendSide: { flexDirection: "row", alignItems: "center", gap: 6 },
  trendPct: { fontSize: 16, fontFamily: "Inter_700Bold" },
  trendLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  streakBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  streakText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  tabRow: {
    flexDirection: "row", borderRadius: 10, borderWidth: 1,
    padding: 4, gap: 4,
  },
  tab: {
    flex: 1, paddingVertical: 8, borderRadius: 7, borderWidth: 1,
    borderColor: "transparent", alignItems: "center",
  },
  tabText: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  modeRow: { flexDirection: "row", gap: 8 },
  modeBtn: {
    paddingVertical: 10, borderRadius: 8, borderWidth: 1,
    alignItems: "center",
  },
  modeBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  sectionLabel: {
    fontSize: 10, fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8, marginBottom: -4,
  },
  stakeRow: { flexDirection: "row", gap: 8 },
  stakeBox: {
    flex: 1, padding: 12, borderRadius: 10, borderWidth: 1,
  },
  stakeLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, marginBottom: 4 },
  stakeInput: { fontSize: 20, fontFamily: "Inter_600SemiBold" },
  predictionRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 12, borderRadius: 10, borderWidth: 1,
  },
  predictionLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8 },
  predictionText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  predictionPayout: { fontSize: 14, fontFamily: "Inter_700Bold" },
  resultBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 10, borderRadius: 8, borderWidth: 1,
  },
  resultText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  buyBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 16, borderRadius: 10, borderWidth: 1.5,
    marginTop: 4,
  },
  buyText: { fontSize: 15, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
});
