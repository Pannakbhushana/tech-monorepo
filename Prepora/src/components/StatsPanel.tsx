import React from "react";
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { CheckCircle, ListTodo, HelpCircle, Trophy } from "lucide-react-native";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";

interface StatsPanelProps {
  total: number;
  revised: number;
  pending: number;
  activeSetName: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  total,
  revised,
  pending,
  activeSetName,
}) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 640;

  const percent = total > 0 ? Math.round((revised / total) * 100) : 0;

  // Svg circle properties
  const radius = 26;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent / 100);

  return (
    <View style={[styles.grid, isLargeScreen ? styles.gridLarge : styles.gridSmall]}>
      {/* 1. Overall Progress */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, flex: isLargeScreen ? 1 : undefined }]}>
        <View style={styles.radialContainer}>
          <Svg width={64} height={64} style={styles.svg}>
            {/* Background Circle */}
            <Circle
              cx={32}
              cy={32}
              r={radius}
              stroke={theme.border}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Foreground Progress Circle */}
            <Circle
              cx={32}
              cy={32}
              r={radius}
              stroke={theme.accent}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </Svg>
          <Text style={[styles.radialText, { color: theme.text }]}>{percent}%</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>{activeSetName} Progress</Text>
          <Text style={[styles.cardValue, { color: theme.text }]}>
            {percent === 100 ? "All Done! 🎉" : `${revised} of ${total}`}
          </Text>
          <View style={styles.subtextRow}>
            {percent === 100 && (
              <>
                <Trophy size={12} color="#fbbf24" style={styles.iconSpaced} />
                <Text style={[styles.cardSubtext, { color: theme.textSecondary }]}>Fully Mastered!</Text>
              </>
            )}
            {percent < 100 && percent > 0 && (
              <Text style={[styles.cardSubtext, { color: theme.textSecondary }]}>Keep going!</Text>
            )}
            {percent === 0 && total > 0 && (
              <Text style={[styles.cardSubtext, { color: theme.textSecondary }]}>Ready to start!</Text>
            )}
            {total === 0 && (
              <Text style={[styles.cardSubtext, { color: theme.textSecondary }]}>No questions</Text>
            )}
          </View>
        </View>
      </View>

      {/* 2. Total Questions */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, flex: isLargeScreen ? 1 : undefined }]}>
        <View style={[styles.iconBox, { backgroundColor: theme.brandBg }]}>
          <HelpCircle size={22} color={theme.brand} />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Total Questions</Text>
          <Text style={[styles.cardValueNumeric, { color: theme.text }]}>{total}</Text>
          <Text style={[styles.cardSubtext, { color: theme.textSecondary }]}>In current filter</Text>
        </View>
      </View>

      {/* 3. Remaining */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, flex: isLargeScreen ? 1 : undefined }]}>
        <View style={[styles.iconBox, { backgroundColor: theme.warningBg }]}>
          <ListTodo size={22} color={theme.warning} />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Remaining (Queue)</Text>
          <Text style={[styles.cardValueNumeric, { color: theme.text }]}>{pending}</Text>
          <Text style={[styles.cardSubtext, { color: theme.textSecondary }]}>Needs revision</Text>
        </View>
      </View>

      {/* 4. Revised */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, flex: isLargeScreen ? 1 : undefined }]}>
        <View style={[styles.iconBox, { backgroundColor: theme.successBg }]}>
          <CheckCircle size={22} color={theme.success} />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>Revised (Done)</Text>
          <Text style={[styles.cardValueNumeric, { color: theme.text }]}>{revised}</Text>
          <Text style={[styles.cardSubtext, { color: theme.textSecondary }]}>Ready to re-test</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  gridLarge: {
    flexDirection: "row",
  },
  gridSmall: {
    flexDirection: "column",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  radialContainer: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  radialText: {
    fontSize: 12,
    fontWeight: "800",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },
  cardValueNumeric: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 2,
  },
  subtextRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  iconSpaced: {
    marginRight: 4,
  },
  cardSubtext: {
    fontSize: 11,
  },
});
