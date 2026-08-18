import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { Sparkles, X, Plus } from "lucide-react-native";
import type { QuestionSet } from "../types";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string, answer: string, setId: string) => void;
  sets: QuestionSet[];
  activeSetId: string;
  onOpenAddSet?: () => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  sets,
  activeSetId,
  onOpenAddSet,
}) => {
  const theme = useTheme();
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedSetId, setSelectedSetId] = useState(() => {
    if (activeSetId !== "all" && sets.some((s) => s.id === activeSetId)) {
      return activeSetId;
    }
    return sets[0]?.id || "";
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!text.trim()) {
      setError("Question text cannot be empty.");
      return;
    }
    if (!selectedSetId) {
      setError("Please select or create a subject category.");
      return;
    }
    onAdd(text, answer, selectedSetId);
    setText("");
    setAnswer("");
    setError("");
    onClose();
  };

  const selectedSet = sets.find((s) => s.id === selectedSetId);

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerTitleRow}>
              <Sparkles size={20} color={theme.accent} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>Create Question</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            {sets.length === 0 ? (
              <View style={styles.noCategoriesContainer}>
                <Text style={[styles.noCategoriesTitle, { color: theme.text }]}>No Categories Found</Text>
                <Text style={[styles.noCategoriesDesc, { color: theme.textSecondary }]}>
                  You need to create a subject category first before adding questions.
                </Text>
                <Pressable
                  style={[styles.btn, { backgroundColor: theme.brand, width: "100%" }]}
                  onPress={() => {
                    onClose();
                    if (onOpenAddSet) onOpenAddSet();
                  }}
                >
                  <Text style={styles.submitBtnText}>Create Subject Category</Text>
                </Pressable>
              </View>
            ) : (
              <>
                {error ? (
                  <View style={[styles.errorContainer, { backgroundColor: theme.dangerBg, borderColor: theme.danger }]}>
                    <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
                  </View>
                ) : null}

                {/* Category selector chips */}
                <View style={styles.field}>
                  <View style={styles.categoryLabelRow}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Select Category</Text>
                    {onOpenAddSet && (
                      <Pressable
                        style={styles.addCategoryLink}
                        onPress={() => {
                          onClose();
                          onOpenAddSet();
                        }}
                      >
                        <Plus size={12} color={theme.brand} />
                        <Text style={[styles.addCategoryLinkText, { color: theme.brand }]}>New Category</Text>
                      </Pressable>
                    )}
                  </View>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                    <View style={styles.chipsRow}>
                      {sets.map((set) => {
                        const isSelected = set.id === selectedSetId;
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
                            onPress={() => {
                              setSelectedSetId(set.id);
                              if (error) setError("");
                            }}
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
                  {selectedSet?.description ? (
                    <Text style={[styles.categoryDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                      {selectedSet.description}
                    </Text>
                  ) : null}
                </View>

                {/* Question input */}
                <View style={styles.field}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Question Title</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                    placeholder="e.g. What is the difference between map and forEach?"
                    placeholderTextColor={theme.textSecondary + "80"}
                    value={text}
                    onChangeText={(val) => {
                      setText(val);
                      if (error) setError("");
                    }}
                  />
                </View>

                {/* Answer input */}
                <View style={styles.field}>
                  <View style={styles.answerHeader}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Answer / Explanation</Text>
                    <Text style={[styles.helpText, { color: theme.textSecondary }]}>Supports ```code blocks</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.textarea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                    placeholder="Write explanation, code snippets, or notes... (Optional)"
                    placeholderTextColor={theme.textSecondary + "80"}
                    value={answer}
                    onChangeText={setAnswer}
                    multiline={true}
                    numberOfLines={5}
                  />
                </View>

                {/* Footer */}
                <View style={[styles.footer, { borderTopColor: theme.border }]}>
                  <Pressable
                    style={[styles.btn, styles.cancelBtn, { borderColor: theme.border }]}
                    onPress={onClose}
                  >
                    <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btn, styles.submitBtn, { backgroundColor: theme.accent }]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitBtnText}>Add Question</Text>
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 0,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
  },
  modalCard: {
    width: "100%",
    maxWidth: 600,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
  },
  form: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  noCategoriesContainer: {
    paddingVertical: Spacing.five,
    alignItems: "center",
    gap: Spacing.two,
  },
  noCategoriesTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  noCategoriesDesc: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: Spacing.four,
  },
  errorContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.two,
    marginBottom: Spacing.one,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
  },
  field: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categoryLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addCategoryLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addCategoryLinkText: {
    fontSize: 12,
    fontWeight: "600",
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
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 13,
  },
  categoryDesc: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
  },
  answerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helpText: {
    fontSize: 10,
  },
  textarea: {
    height: 140,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  footer: {
    flexDirection: "row",
    gap: Spacing.two,
    borderTopWidth: 1,
    paddingTop: Spacing.four,
    marginTop: Spacing.two,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  submitBtn: {},
  submitBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
