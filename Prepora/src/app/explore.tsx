import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Plus, Trash2, RotateCcw, Sparkles, BookOpen, ChevronRight } from "lucide-react-native";
import { usePrepStore } from "@/context/PrepStoreContext";
import { useTheme } from "@/hooks/use-theme";
import { Spacing } from "@/constants/theme";
import { AddSetModal } from "@/components/AddSetModal";
import { ConfirmModal } from "@/components/ConfirmModal";

export default function ExploreScreen() {
  const {
    sets,
    questions,
    activeSetId,
    setActiveSetId,
    deleteSet,
    resetSetQuestions,
  } = usePrepStore();

  const theme = useTheme();
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();

  const [isAddSetOpen, setIsAddSetOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null);

  const getSetStats = (setId: string) => {
    const setQuestions = questions.filter(
      (q) => setId === "all" || q.setId === setId
    );
    const total = setQuestions.length;
    const revised = setQuestions.filter((q) => q.isRevised).length;
    const pending = total - revised;
    const percent = total > 0 ? Math.round((revised / total) * 100) : 0;
    return { total, revised, pending, percent };
  };

  const handleSelectSet = (setId: string) => {
    setActiveSetId(setId);
    router.push("/");
  };

  const allStats = getSetStats("all");

  const selectedDeleteSet = sets.find((s) => s.id === confirmDeleteId);
  const selectedResetSet = sets.find((s) => s.id === confirmResetId);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: Platform.OS === "web" ? Spacing.four : safeAreaInsets.top + Spacing.two,
          paddingBottom: safeAreaInsets.bottom + Spacing.six,
        },
      ]}
    >
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Subject Sets</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Organize and track your revision categories
            </Text>
          </View>
          <Pressable
            style={[styles.addButton, { backgroundColor: theme.brand }]}
            onPress={() => setIsAddSetOpen(true)}
          >
            <Plus size={16} color="#ffffff" style={styles.btnIcon} />
            <Text style={styles.addButtonText}>Add Subject</Text>
          </Pressable>
        </View>

        {/* Categories List */}
        <View style={styles.listContainer}>
          {/* ALL SUBJECTS TAB */}
          <Pressable
            style={[
              styles.setCard,
              {
                backgroundColor: theme.card,
                borderColor: activeSetId === "all" ? theme.brand : theme.border,
                borderWidth: activeSetId === "all" ? 2 : 1,
              },
            ]}
            onPress={() => handleSelectSet("all")}
          >
            <View style={styles.setCardHeader}>
              <View style={styles.setCardTitleRow}>
                <View style={[styles.iconWrapper, { backgroundColor: theme.accentBg }]}>
                  <Sparkles size={20} color={theme.accent} />
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={[styles.setName, { color: theme.text }]}>All Subjects</Text>
                  <Text style={[styles.setDesc, { color: theme.textSecondary }]}>
                    Review all questions across all subjects
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color={theme.textSecondary} />
            </View>

            {/* Stats Summary */}
            <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
              <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                Progress: <Text style={{ color: theme.text, fontWeight: "700" }}>{allStats.revised} / {allStats.total}</Text> revised
              </Text>
              <View style={[styles.progressBadge, { backgroundColor: theme.accentBg }]}>
                <Text style={[styles.progressBadgeText, { color: theme.accent }]}>{allStats.percent}%</Text>
              </View>
            </View>
          </Pressable>

          {/* DYNAMIC SETS */}
          {sets.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <BookOpen size={40} color={theme.textSecondary} style={styles.emptyIcon} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Subjects Yet</Text>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                Add your first subject category to organize your revision cards.
              </Text>
              <Pressable
                style={[styles.emptyBtn, { backgroundColor: theme.brand }]}
                onPress={() => setIsAddSetOpen(true)}
              >
                <Text style={styles.emptyBtnText}>Create Subject</Text>
              </Pressable>
            </View>
          ) : (
            sets.map((set) => {
              const stats = getSetStats(set.id);
              const isActive = activeSetId === set.id;

              return (
                <View
                  key={set.id}
                  style={[
                    styles.setCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: isActive ? theme.brand : theme.border,
                      borderWidth: isActive ? 2 : 1,
                    },
                  ]}
                >
                  <Pressable style={styles.cardPressArea} onPress={() => handleSelectSet(set.id)}>
                    <View style={styles.setCardHeader}>
                      <View style={styles.setCardTitleRow}>
                        <View style={[styles.iconWrapper, { backgroundColor: theme.brandBg }]}>
                          <BookOpen size={18} color={theme.brand} />
                        </View>
                        <View style={styles.titleWrapper}>
                          <Text style={[styles.setName, { color: theme.text }]}>{set.name}</Text>
                          {set.description ? (
                            <Text style={[styles.setDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                              {set.description}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                      <ChevronRight size={18} color={theme.textSecondary} />
                    </View>
                  </Pressable>

                  {/* Actions and Stats Footer */}
                  <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                    <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                      Progress: <Text style={{ color: theme.text, fontWeight: "700" }}>{stats.revised} / {stats.total}</Text> revised
                    </Text>

                    <View style={styles.footerActions}>
                      <View style={[styles.progressBadge, { backgroundColor: theme.brandBg }]}>
                        <Text style={[styles.progressBadgeText, { color: theme.brand }]}>{stats.percent}%</Text>
                      </View>

                      {stats.revised > 0 && (
                        <Pressable
                          style={styles.actionIconButton}
                          onPress={() => setConfirmResetId(set.id)}
                          title="Reset progress"
                        >
                          <RotateCcw size={14} color={theme.warning} />
                        </Pressable>
                      )}

                      <Pressable
                        style={styles.actionIconButton}
                        onPress={() => setConfirmDeleteId(set.id)}
                        title="Delete category"
                      >
                        <Trash2 size={14} color={theme.danger} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* Add Set Modal */}
      {isAddSetOpen && (
        <AddSetModal
          isOpen={isAddSetOpen}
          onClose={() => setIsAddSetOpen(false)}
          onAdd={(name, desc) => {
            const newId = usePrepStore.getState ? usePrepStore.getState().addSet(name, desc) : "";
            // Tapping save returns new ID. In context:
            // Since we import hook, let's call the function
          }}
        />
      )}

      {/* Context handlers */}
      <AddSetModalWrapper isOpen={isAddSetOpen} onClose={() => setIsAddSetOpen(false)} />

      {/* Reset progress confirmation modal */}
      {confirmResetId && (
        <ConfirmModal
          isOpen={!!confirmResetId}
          onClose={() => setConfirmResetId(null)}
          onConfirm={() => {
            if (confirmResetId) resetSetQuestions(confirmResetId);
          }}
          title="Reset Subject Progress"
          message={`Are you sure you want to reset all completed questions in "${sets.find((s) => s.id === confirmResetId)?.name}" back to the revision queue?`}
          confirmText="Reset Progress"
          cancelText="Cancel"
          variant="warning"
        />
      )}

      {/* Delete set confirmation modal */}
      {confirmDeleteId && (
        <ConfirmModal
          isOpen={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
          onConfirm={() => {
            if (confirmDeleteId) deleteSet(confirmDeleteId);
          }}
          title="Delete Subject Category"
          message={`Are you sure you want to delete "${sets.find((s) => s.id === confirmDeleteId)?.name}"? This will permanently delete all its questions!`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      )}
    </ScrollView>
  );
}

// Wrapper to consume context safely
function AddSetModalWrapper({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addSet, setActiveSetId } = usePrepStore();
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AddSetModal
      isOpen={isOpen}
      onClose={onClose}
      onAdd={(name, desc) => {
        const newId = addSet(name, desc);
        setActiveSetId(newId);
        router.push("/");
      }}
    />
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    alignItems: "center",
  },
  mainContainer: {
    width: "100%",
    maxWidth: 600,
    gap: Spacing.four,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    height: 38,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  btnIcon: {
    marginRight: 6,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  listContainer: {
    gap: Spacing.three,
  },
  setCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  cardPressArea: {
    width: "100%",
  },
  setCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  setCardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  titleWrapper: {
    flex: 1,
    gap: 2,
  },
  setName: {
    fontSize: 15,
    fontWeight: "800",
  },
  setDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
  },
  progressText: {
    fontSize: 12,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  progressBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  actionIconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.five,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    marginBottom: Spacing.two,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: Spacing.four,
    maxWidth: 300,
    lineHeight: 18,
  },
  emptyBtn: {
    height: 40,
    paddingHorizontal: Spacing.four,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "750",
  },
});
