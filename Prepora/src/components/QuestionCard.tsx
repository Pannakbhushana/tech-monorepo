import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { Eye, EyeOff, Edit3, Trash2, Check, X, Save, Maximize2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import type { Question, QuestionSet } from "../types";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";
import { ConfirmModal } from "./ConfirmModal";

interface QuestionCardProps {
  question: Question;
  serialNumber: number;
  sets: QuestionSet[];
  onToggleRevised: (id: string) => void;
  onUpdate: (id: string, text: string, answer: string, setId?: string) => void;
  onDelete: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  serialNumber,
  sets,
  onToggleRevised,
  onUpdate,
  onDelete,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 640;

  const [isEditing, setIsEditing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Edit form states
  const [editText, setEditText] = useState(question.text);
  const [editAnswer, setEditAnswer] = useState(question.answer);
  const [editSetId, setEditSetId] = useState(question.setId);

  const handleStartEdit = () => {
    setEditText(question.text);
    setEditAnswer(question.answer);
    setEditSetId(question.setId);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editText.trim()) return;
    onUpdate(question.id, editText, editAnswer, editSetId);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(question.text);
    setEditAnswer(question.answer);
    setEditSetId(question.setId);
    setIsEditing(false);
  };

  const activeSet = sets.find((s) => s.id === question.setId);
  const activeSetName = activeSet?.name || "General";

  const formatAnswerContent = (text: string) => {
    if (!text.trim()) {
      return (
        <Text style={[styles.emptyAnswerText, { color: theme.textSecondary }]}>
          No answer added yet. Tap the edit icon to add notes or code.
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
              // Render normal text
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
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: question.isRevised ? theme.success : theme.border,
          opacity: question.isRevised ? 0.8 : 1,
        },
        isEditing && { borderWidth: 2, borderColor: theme.brand },
      ]}
    >
      {isEditing ? (
        // EDIT MODE
        <View style={styles.editForm}>
          <View style={[styles.editHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.editTitle, { color: theme.textSecondary }]}>
              Editing Question #{serialNumber}
            </Text>
          </View>

          {/* Category Selector Chips */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Category</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              <View style={styles.chipsRow}>
                {sets.map((set) => {
                  const isSelected = set.id === editSetId;
                  return (
                    <Pressable
                      key={set.id}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? theme.accentBg : theme.background,
                          borderColor: isSelected ? theme.accent : theme.border,
                        },
                      ]}
                      onPress={() => setEditSetId(set.id)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isSelected ? theme.accent : theme.textSecondary,
                            fontWeight: isSelected ? "700" : "500",
                          },
                        ]}
                      >
                        {set.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Question text input */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Question Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={editText}
              onChangeText={setEditText}
              placeholder="Enter question text..."
              placeholderTextColor={theme.textSecondary + "80"}
            />
          </View>

          {/* Answer notes textarea */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Answer / Notes</Text>
            <TextInput
              style={[styles.input, styles.textarea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
              value={editAnswer}
              onChangeText={setEditAnswer}
              multiline={true}
              numberOfLines={6}
              placeholder="Enter answer or explanation..."
              placeholderTextColor={theme.textSecondary + "80"}
            />
          </View>

          {/* Save / Cancel */}
          <View style={styles.editFooter}>
            <Pressable style={[styles.btn, styles.cancelBtn, { borderColor: theme.border }]} onPress={handleCancel}>
              <X size={14} color={theme.textSecondary} style={styles.btnIcon} />
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.saveBtn, { backgroundColor: theme.brand }]} onPress={handleSave}>
              <Save size={14} color="#ffffff" style={styles.btnIcon} />
              <Text style={styles.saveBtnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        // DISPLAY MODE
        <View style={styles.cardLayout}>
          <View style={styles.row}>
            {/* Checkbox */}
            <Pressable
              style={[
                styles.checkbox,
                {
                  borderColor: question.isRevised ? theme.success : theme.textSecondary,
                  backgroundColor: question.isRevised ? theme.success : "transparent",
                },
              ]}
              onPress={() => onToggleRevised(question.id)}
            >
              {question.isRevised && <Check size={14} color="#ffffff" strokeWidth={3} />}
            </Pressable>

            {/* Question info & text */}
            <View style={styles.content}>
              <View style={styles.badgeRow}>
                <Text style={[styles.numberBadge, { backgroundColor: theme.backgroundSelected, color: theme.textSecondary }]}>
                  #{serialNumber}
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

              <Pressable onPress={() => setShowAnswer(!showAnswer)}>
                <Text
                  style={[
                    styles.questionText,
                    { color: theme.text },
                    question.isRevised && styles.questionTextRevised,
                  ]}
                >
                  {question.text}
                </Text>
              </Pressable>
            </View>

            {/* Action buttons (Edit & Delete) */}
            <View style={styles.actions}>
              <Pressable style={styles.actionBtn} onPress={handleStartEdit}>
                <Edit3 size={16} color={theme.textSecondary} />
              </Pressable>
              <Pressable style={styles.actionBtn} onPress={() => setIsDeleteConfirmOpen(true)}>
                <Trash2 size={16} color={theme.textSecondary} />
              </Pressable>
            </View>
          </View>

          {/* Reveal button & Answer container */}
          <View style={styles.answerSection}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Pressable
                style={[
                  styles.revealBtn,
                  {
                    backgroundColor: showAnswer ? theme.backgroundSelected : theme.brandBg,
                  },
                ]}
                onPress={() => setShowAnswer(!showAnswer)}
              >
                {showAnswer ? (
                  <>
                    <EyeOff size={12} color={showAnswer ? theme.text : theme.brand} style={{ marginRight: 4 }} />
                    <Text style={[styles.revealBtnText, { color: theme.text }]}>Hide Answer</Text>
                  </>
                ) : (
                  <>
                    <Eye size={12} color={theme.brand} style={{ marginRight: 4 }} />
                    <Text style={[styles.revealBtnText, { color: theme.brand }]}>Reveal Answer</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={[
                  styles.revealBtn,
                  {
                    backgroundColor: theme.accentBg,
                  },
                ]}
                onPress={() => router.push(`/question/${question.id}`)}
              >
                <Maximize2 size={12} color={theme.accent} style={{ marginRight: 4 }} />
                <Text style={[styles.revealBtnText, { color: theme.accent }]}>Focus View</Text>
              </Pressable>
            </View>

            {showAnswer && (
              <View style={[styles.answerContainer, { borderTopColor: theme.border }]}>
                {formatAnswerContent(question.answer)}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Delete confirmation modal */}
      {isDeleteConfirmOpen && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={() => onDelete(question.id)}
          title="Delete Question"
          message="Are you sure you want to delete this question? This action is permanent."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  cardLayout: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  numberBadge: {
    fontSize: 10,
    fontFamily: "monospace",
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  revisedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  revisedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  questionText: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  questionTextRevised: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
  },
  answerSection: {
    paddingLeft: 32, // align with content after checkbox
  },
  revealBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  revealBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  answerContainer: {
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
  },
  emptyAnswerText: {
    fontSize: 13,
    fontStyle: "italic",
    paddingVertical: 4,
  },
  normalText: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  inlineCode: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "700",
    borderRadius: 4,
    paddingHorizontal: 2,
  },
  codeBlockContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.three,
    marginVertical: Spacing.two,
    width: "100%",
  },
  codeBlockHeader: {
    alignSelf: "flex-end",
    marginBottom: 6,
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
    fontSize: 12.5,
    lineHeight: 18,
  },
  editForm: {
    gap: Spacing.three,
  },
  editHeader: {
    borderBottomWidth: 1,
    paddingBottom: Spacing.one,
  },
  editTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  field: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  chipsScroll: {
    marginHorizontal: -4,
  },
  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 14,
  },
  textarea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  editFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  btn: {
    flexDirection: "row",
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnIcon: {
    marginRight: 4,
  },
  cancelBtn: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  saveBtn: {},
  saveBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});
