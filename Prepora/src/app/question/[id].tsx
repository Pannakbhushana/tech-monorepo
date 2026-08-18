import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Check, CheckCircle2, RotateCcw } from "lucide-react-native";
import { usePrepStore } from "../../context/PrepStoreContext";
import { useTheme } from "../../hooks/use-theme";
import { Spacing } from "../../constants/theme";

export default function QuestionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { questions, sets, toggleQuestionRevised } = usePrepStore();
  const theme = useTheme();
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();

  const questionIndex = questions.findIndex((q) => q.id === id);
  const question = questions[questionIndex];

  if (!question) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Question not found</Text>
        <Pressable style={[styles.backBtn, { backgroundColor: theme.brand }]} onPress={() => router.replace("/")}>
          <Text style={styles.backBtnText}>Back to Board</Text>
        </Pressable>
      </View>
    );
  }

  const activeSet = sets.find((s) => s.id === question.setId);
  const activeSetName = activeSet?.name || "General";

  const formatAnswerContent = (text: string) => {
    if (!text.trim()) {
      return (
        <Text style={[styles.emptyAnswerText, { color: theme.textSecondary }]}>
          No answer explanation has been added for this card yet.
        </Text>
      );
    }

    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : "";
        const code = match ? match[2] : part.slice(3, -3);

        return (
          <View key={index} style={[styles.codeBlockContainer, { backgroundColor: "#0f172a", borderColor: "#1e293b" }]}>
            {language ? (
              <View style={styles.codeBlockHeader}>
                <Text style={styles.codeBlockLang}>{language.toUpperCase()}</Text>
              </View>
            ) : null}
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
              <Text style={styles.codeBlockText}>{code.trim()}</Text>
            </ScrollView>
          </View>
        );
      } else {
        const subParts = part.split(/(`[^`\n]+`)/g);
        return (
          <Text key={index} style={[styles.normalText, { color: theme.text }]}>
            {subParts.map((subPart, subIndex) => {
              if (subPart.startsWith("`") && subPart.endsWith("`")) {
                return (
                  <Text key={subIndex} style={[styles.inlineCode, { backgroundColor: theme.backgroundSelected, color: theme.danger }]}>
                    {` ${subPart.slice(1, -1)} `}
                  </Text>
                );
              }
              return subPart;
            })}
          </Text>
        );
      }
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: Platform.OS === "web" ? Spacing.four : safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom + Spacing.four,
        },
      ]}
    >
      {/* Header Bar */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable style={styles.backIconButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Dedicated Study View</Text>
        <View style={{ width: 40 }} /> {/* balance layout */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainWrapper}>
          {/* Card Container */}
          <View style={[styles.detailCard, { backgroundColor: theme.card, borderColor: question.isRevised ? theme.success : theme.border }]}>
            
            {/* Meta Tags */}
            <View style={styles.metaRow}>
              <Text style={[styles.numberBadge, { backgroundColor: theme.backgroundSelected, color: theme.textSecondary }]}>
                Question #{questionIndex + 1}
              </Text>
              <Text style={[styles.categoryBadge, { backgroundColor: theme.brandBg, color: theme.brand }]}>
                {activeSetName}
              </Text>
              {question.isRevised && (
                <View style={[styles.revisedBadge, { backgroundColor: theme.successBg }]}>
                  <Check size={10} color={theme.success} style={{ marginRight: 2 }} />
                  <Text style={[styles.revisedBadgeText, { color: theme.success }]}>Revised</Text>
                </View>
              )}
            </View>

            {/* Question Text */}
            <Text style={[styles.questionText, { color: theme.text }]}>
              {question.text}
            </Text>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Answer Subtitle */}
            <Text style={[styles.answerLabel, { color: theme.textSecondary }]}>
              Answer Explanation & Reference
            </Text>

            {/* Answer Formatted Content */}
            <View style={styles.answerContent}>
              {formatAnswerContent(question.answer)}
            </View>

          </View>

          {/* Action Button at bottom */}
          <Pressable
            style={[
              styles.actionButton,
              {
                backgroundColor: question.isRevised ? theme.warningBg : theme.success,
                borderColor: question.isRevised ? theme.warning : "transparent",
                borderWidth: question.isRevised ? 1 : 0,
              },
            ]}
            onPress={() => toggleQuestionRevised(question.id)}
          >
            {question.isRevised ? (
              <>
                <RotateCcw size={16} color={theme.warning} style={{ marginRight: 8 }} />
                <Text style={[styles.actionButtonText, { color: theme.warning }]}>Send Back to Queue</Text>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={[styles.actionButtonText, { color: "#ffffff" }]}>Mark as Revised</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.six,
    gap: Spacing.four,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  backIconButton: {
    padding: 8,
    borderRadius: 12,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  scrollContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    alignItems: "center",
  },
  mainWrapper: {
    width: "100%",
    maxWidth: 700,
    gap: Spacing.four,
  },
  detailCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.five,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.three,
  },
  numberBadge: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  revisedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  revisedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  questionText: {
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 30,
    marginBottom: Spacing.four,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: Spacing.four,
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.three,
  },
  answerContent: {
    gap: Spacing.two,
  },
  emptyAnswerText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  normalText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: Spacing.two,
  },
  inlineCode: {
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "700",
    borderRadius: 4,
    paddingHorizontal: 3,
  },
  codeBlockContainer: {
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.four,
    marginVertical: Spacing.three,
    width: "100%",
  },
  codeBlockHeader: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  codeBlockLang: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: "700",
    backgroundColor: "#1e293b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeBlockText: {
    color: "#e2e8f0",
    fontFamily: "monospace",
    fontSize: 13,
    lineHeight: 20,
  },
  actionButton: {
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
