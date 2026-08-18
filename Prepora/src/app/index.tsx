import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Plus,
  Search,
  X,
  Sparkles,
  Laptop,
  Sun,
  Moon,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  FolderPlus,
  Trash2,
  Menu,
} from "lucide-react-native";
import { usePrepStore } from "../context/PrepStoreContext";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";
import { StatsPanel } from "../components/StatsPanel";
import { QuestionCard } from "../components/QuestionCard";
import { AddQuestionModal } from "../components/AddQuestionModal";
import { AddSetModal } from "../components/AddSetModal";
import { ConfirmModal } from "../components/ConfirmModal";

export default function HomeScreen() {
  const {
    questions,
    sets,
    activeSetId,
    setActiveSetId,
    theme,
    setTheme,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filteredQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    toggleQuestionRevised,
    addSet,
    deleteSet,
    resetSetQuestions,
    restoreQuestions,
    markQuestionsAsRevised,
  } = usePrepStore();

  const themeColors = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Responsive breakpoints
  const isWebSplit = Platform.OS === "web" && width >= 800;

  // Modal views visibility
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isAddSetOpen, setIsAddSetOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
  } | null>(null);

  const activeSet = sets.find((s) => s.id === activeSetId);
  const activeSetName = activeSetId === "all" ? "All Subjects" : activeSet?.name || "Subject";
  const activeSetDesc =
    activeSetId === "all"
      ? "Review all questions across all subjects and categories."
      : activeSet?.description || "Subject-specific preparation questions.";

  // Calculate statistics for the active set
  const setQuestions = questions.filter(
    (q) => activeSetId === "all" || q.setId === activeSetId
  );
  const totalInSet = setQuestions.length;
  const revisedInSet = setQuestions.filter((q) => q.isRevised).length;
  const pendingInSet = totalInSet - revisedInSet;

  // Actions
  const handleResetSetProgress = () => {
    setConfirmConfig({
      title: "Reset Progress",
      message: `Restore all completed questions in "${activeSetName}" back to the revision queue?`,
      confirmText: "Reset",
      variant: "warning",
      onConfirm: () => resetSetQuestions(activeSetId),
    });
  };

  const handleMarkAllAsDone = () => {
    const pendingIds = filteredQuestions.filter((q) => !q.isRevised).map((q) => q.id);
    if (pendingIds.length === 0) return;
    setConfirmConfig({
      title: "Mark All Revised",
      message: `Mark all ${pendingIds.length} pending questions in this view as revised?`,
      confirmText: "Mark Revised",
      variant: "info",
      onConfirm: () => markQuestionsAsRevised(pendingIds),
    });
  };

  const handleRestoreAllDone = () => {
    const revisedIds = filteredQuestions.filter((q) => q.isRevised).map((q) => q.id);
    if (revisedIds.length === 0) return;
    setConfirmConfig({
      title: "Restore All to Queue",
      message: `Add all ${revisedIds.length} completed questions back to your revision queue?`,
      confirmText: "Restore",
      variant: "info",
      onConfirm: () => restoreQuestions(revisedIds),
    });
  };

  const handleDeleteSet = (setId: string, name: string) => {
    setConfirmConfig({
      title: "Delete Category",
      message: `Are you sure you want to delete the category "${name}"? This will also delete all its questions!`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: () => deleteSet(setId),
    });
  };

  const renderThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={18} color="#f59e0b" />;
      case "dark":
        return <Moon size={18} color="#818cf8" />;
      case "system":
      default:
        return <Laptop size={18} color={themeColors.textSecondary} />;
    }
  };

  // Main board container UI
  const BoardContent = (
    <View style={styles.boardWrapper}>
      {/* Header */}
      <View style={[styles.boardHeader, { borderBottomColor: themeColors.border }]}>
        <View style={styles.boardHeaderLeft}>
          <Text style={[styles.boardTitle, { color: themeColors.text }]}>{activeSetName}</Text>
          <Text style={[styles.boardSubtitle, { color: themeColors.textSecondary }]} numberOfLines={1}>
            {activeSetDesc}
          </Text>
        </View>

        <View style={styles.boardHeaderRight}>
          {/* Theme Dropdown Toggle - Only visible on desktop/wide screens, since mobile layout has it in the top navbar */}
          {isWebSplit && (
            <View style={styles.themeSelectorContainer}>
              <Pressable
                style={[styles.iconButton, { borderColor: themeColors.border, backgroundColor: themeColors.card }]}
                onPress={() => setShowThemeMenu(!showThemeMenu)}
              >
                {renderThemeIcon()}
              </Pressable>

              {showThemeMenu && (
                <View style={[styles.themeDropdown, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTheme("light");
                      setShowThemeMenu(false);
                    }}
                  >
                    <Sun size={14} color="#f59e0b" style={styles.dropdownIcon} />
                    <Text style={[styles.dropdownText, { color: themeColors.text }]}>Light Mode</Text>
                  </Pressable>
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTheme("dark");
                      setShowThemeMenu(false);
                    }}
                  >
                    <Moon size={14} color="#818cf8" style={styles.dropdownIcon} />
                    <Text style={[styles.dropdownText, { color: themeColors.text }]}>Dark Mode</Text>
                  </Pressable>
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTheme("system");
                      setShowThemeMenu(false);
                    }}
                  >
                    <Laptop size={14} color={themeColors.textSecondary} style={styles.dropdownIcon} />
                    <Text style={[styles.dropdownText, { color: themeColors.text }]}>System</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}

          {/* Quick Add Question Button */}
          <Pressable
            style={[styles.quickAddButton, { backgroundColor: themeColors.accent }]}
            onPress={() => setIsAddQuestionOpen(true)}
          >
            <Plus size={16} color="#ffffff" style={styles.btnIcon} />
            <Text style={styles.quickAddButtonText}>Add Question</Text>
          </Pressable>
        </View>
      </View>

      {/* Main body scroll */}
      <ScrollView
        contentContainerStyle={styles.boardBody}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Stats Section */}
        <StatsPanel
          total={totalInSet}
          revised={revisedInSet}
          pending={pendingInSet}
          activeSetName={activeSetName}
        />

        {/* Filter and Actions Row */}
        <View style={styles.filterRow}>
          {/* Status Tabs */}
          <View style={[styles.filterTabs, { backgroundColor: themeColors.backgroundSelected }]}>
            <Pressable
              style={[
                styles.filterTab,
                filterType === "all" && [styles.filterTabActive, { backgroundColor: themeColors.card }],
              ]}
              onPress={() => setFilterType("all")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: filterType === "all" ? themeColors.text : themeColors.textSecondary },
                ]}
              >
                All
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterTab,
                filterType === "unrevised" && [styles.filterTabActive, { backgroundColor: themeColors.card }],
              ]}
              onPress={() => setFilterType("unrevised")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: filterType === "unrevised" ? themeColors.text : themeColors.textSecondary },
                ]}
              >
                Pending ({pendingInSet})
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterTab,
                filterType === "revised" && [styles.filterTabActive, { backgroundColor: themeColors.card }],
              ]}
              onPress={() => setFilterType("revised")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: filterType === "revised" ? themeColors.text : themeColors.textSecondary },
                ]}
              >
                Revised ({revisedInSet})
              </Text>
            </Pressable>
          </View>

          {/* Context Actions */}
          <View style={styles.actionRow}>
            {filterType === "unrevised" && pendingInSet > 0 && (
              <Pressable
                style={[styles.actionBadgeBtn, { backgroundColor: themeColors.successBg, borderColor: themeColors.success }]}
                onPress={handleMarkAllAsDone}
              >
                <CheckCircle size={12} color={themeColors.success} style={{ marginRight: 4 }} />
                <Text style={[styles.actionBadgeText, { color: themeColors.success }]}>Mark All Revised</Text>
              </Pressable>
            )}

            {filterType === "revised" && revisedInSet > 0 && (
              <Pressable
                style={[styles.actionBadgeBtn, { backgroundColor: themeColors.brandBg, borderColor: themeColors.brand }]}
                onPress={handleRestoreAllDone}
              >
                <RotateCcw size={12} color={themeColors.brand} style={{ marginRight: 4 }} />
                <Text style={[styles.actionBadgeText, { color: themeColors.brand }]}>Restore All</Text>
              </Pressable>
            )}

            {filterType === "all" && revisedInSet > 0 && (
              <Pressable
                style={[styles.actionBadgeBtn, { backgroundColor: themeColors.warningBg, borderColor: themeColors.warning }]}
                onPress={handleResetSetProgress}
              >
                <RotateCcw size={12} color={themeColors.warning} style={{ marginRight: 4 }} />
                <Text style={[styles.actionBadgeText, { color: themeColors.warning }]}>Reset Progress</Text>
              </Pressable>
            )}
          </View>
        </View>
        {/* Questions cards list */}
        <View style={styles.cardsList}>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => {
              const originalIndex = questions.findIndex((origQ) => origQ.id === q.id) + 1;
              return (
                <QuestionCard
                  key={q.id}
                  question={q}
                  serialNumber={originalIndex}
                  sets={sets}
                  onToggleRevised={toggleQuestionRevised}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                />
              );
            })
          ) : (
            /* EMPTY STATES */
            <View style={[styles.emptyCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
              {sets.length === 0 ? (
                <>
                  <View style={[styles.emptyIconBox, { backgroundColor: themeColors.brandBg }]}>
                    <FolderPlus size={32} color={themeColors.brand} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: themeColors.text }]}>Welcome to Prepora!</Text>
                  <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                    Create your first subject category on the "Subjects" page to get started.
                  </Text>
                </>
              ) : filterType === "unrevised" && totalInSet > 0 ? (
                <>
                  <View style={[styles.emptyIconBox, { backgroundColor: themeColors.successBg }]}>
                    <CheckCircle size={32} color={themeColors.success} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: themeColors.text }]}>Subject Mastered! 🎉</Text>
                  <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                    You have revised all {totalInSet} questions in {activeSetName}.
                  </Text>
                  <Pressable
                    style={[styles.emptyButton, { backgroundColor: themeColors.success }]}
                    onPress={handleResetSetProgress}
                  >
                    <Text style={styles.emptyButtonText}>Reset Progress</Text>
                  </Pressable>
                </>
              ) : filterType === "revised" && totalInSet > 0 ? (
                <>
                  <View style={[styles.emptyIconBox, { backgroundColor: themeColors.backgroundSelected }]}>
                    <HelpCircle size={32} color={themeColors.textSecondary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: themeColors.text }]}>No Revised Cards Yet</Text>
                  <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                    Read through your cards and check them off when you feel confident.
                  </Text>
                  <Pressable
                    style={[styles.emptyButton, { backgroundColor: themeColors.brand }]}
                    onPress={() => setFilterType("unrevised")}
                  >
                    <Text style={styles.emptyButtonText}>Go to Pending Queue</Text>
                  </Pressable>
                </>
              ) : searchQuery ? (
                <>
                  <View style={[styles.emptyIconBox, { backgroundColor: themeColors.backgroundSelected }]}>
                    <Search size={32} color={themeColors.textSecondary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: themeColors.text }]}>No Matches Found</Text>
                  <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                    We couldn't find any questions matching "{searchQuery}".
                  </Text>
                  <Pressable
                    style={[styles.emptyButton, { backgroundColor: themeColors.brand }]}
                    onPress={() => setSearchQuery("")}
                  >
                    <Text style={styles.emptyButtonText}>Clear Search</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={[styles.emptyIconBox, { backgroundColor: themeColors.backgroundSelected }]}>
                    <HelpCircle size={32} color={themeColors.textSecondary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: themeColors.text }]}>No Questions Yet</Text>
                  <Text style={[styles.emptyDesc, { color: themeColors.textSecondary }]}>
                    There are no questions in this category. Add one now!
                  </Text>
                  <Pressable
                    style={[styles.emptyButton, { backgroundColor: themeColors.accent }]}
                    onPress={() => setIsAddQuestionOpen(true)}
                  >
                    <Text style={styles.emptyButtonText}>Create First Question</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  const renderSidebar = (isCollapsible = false) => {
    return (
      <View
        style={[
          styles.sidebar,
          { backgroundColor: themeColors.card, borderRightColor: themeColors.border },
          isCollapsible && styles.mobileSidebarOverlay,
        ]}
      >
        <View style={[styles.sidebarHeader, { borderBottomColor: themeColors.border }]}>
          <View style={styles.logoRow}>
            <View style={[styles.logoIcon, { backgroundColor: themeColors.brand }]}>
              <Sparkles size={16} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.logoText, { color: themeColors.brand }]}>Prepora</Text>
              <Text style={[styles.logoSubtext, { color: themeColors.textSecondary }]}>REVISION BOARD</Text>
            </View>
            {isCollapsible && (
              <Pressable style={styles.closeSidebarButton} onPress={() => setIsSidebarOpen(false)}>
                <X size={18} color={themeColors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Sidebar Sets List */}
        <ScrollView contentContainerStyle={styles.sidebarScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.sidebarSectionTitleRow}>
            <Text style={[styles.sidebarSectionTitle, { color: themeColors.textSecondary }]}>Subjects</Text>
            <Pressable onPress={() => { setIsAddSetOpen(true); if (isCollapsible) setIsSidebarOpen(false); }}>
              <FolderPlus size={14} color={themeColors.brand} />
            </Pressable>
          </View>

          <View style={styles.sidebarList}>
            {/* All Subjects Item */}
            <Pressable
              style={[
                styles.sidebarItem,
                activeSetId === "all" && [styles.sidebarItemActive, { backgroundColor: themeColors.brandBg }],
              ]}
              onPress={() => { setActiveSetId("all"); if (isCollapsible) setIsSidebarOpen(false); }}
            >
              <View style={styles.sidebarItemLeft}>
                <Sparkles size={14} color={activeSetId === "all" ? themeColors.brand : themeColors.textSecondary} style={{ marginRight: 8 }} />
                <Text
                  style={[
                    styles.sidebarItemName,
                    { color: activeSetId === "all" ? themeColors.brand : themeColors.text },
                    activeSetId === "all" && { fontWeight: "700" },
                  ]}
                >
                  All Subjects
                </Text>
              </View>
              <Text style={[styles.sidebarItemBadge, { backgroundColor: themeColors.background, color: themeColors.textSecondary }]}>
                {questions.filter((q) => !q.isRevised).length}/{questions.length}
              </Text>
            </Pressable>

            {/* Categories */}
            {sets.map((set) => {
              const setQuestions = questions.filter((q) => q.setId === set.id);
              const isSelected = activeSetId === set.id;

              return (
                <Pressable
                  key={set.id}
                  style={[
                    styles.sidebarItem,
                    isSelected && [styles.sidebarItemActive, { backgroundColor: themeColors.brandBg }],
                  ]}
                  onPress={() => { setActiveSetId(set.id); if (isCollapsible) setIsSidebarOpen(false); }}
                >
                  <View style={styles.sidebarItemLeft}>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: isSelected ? themeColors.brand : themeColors.textSecondary + "40" },
                      ]}
                    />
                    <Text
                      style={[
                        styles.sidebarItemName,
                        { color: isSelected ? themeColors.brand : themeColors.text },
                        isSelected && { fontWeight: "700" },
                      ]}
                      numberOfLines={1}
                    >
                      {set.name}
                    </Text>
                  </View>
                  <View style={styles.sidebarItemRight}>
                    <Text style={[styles.sidebarItemBadge, { backgroundColor: themeColors.background, color: themeColors.textSecondary }]}>
                      {setQuestions.filter((q) => !q.isRevised).length}/{setQuestions.length}
                    </Text>
                    <Pressable
                      style={styles.sidebarDeleteBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteSet(set.id, set.name);
                      }}
                    >
                      <Trash2 size={12} color={themeColors.danger} />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.background,
          paddingTop: Platform.OS === "web" ? 0 : safeAreaInsets.top,
        },
      ]}
    >
      {isWebSplit ? (
        /* RESPONSIVE SPLIT-PANE LAYOUT FOR WEB / WIDE SCREENS */
        <View style={styles.splitLayout}>
          {renderSidebar(false)}
          {/* Main Board Pane */}
          <View style={styles.splitMain}>{BoardContent}</View>
        </View>
      ) : (
        /* SINGLE SCREEN MOBILE VIEW WITH COLLAPSIBLE SIDEBAR DRAWER */
        <View style={styles.mobileLayout}>
          {/* Mobile Header Bar - Logo on left, Hamburger & Theme Toggle on right */}
          <View style={[styles.mobileHeader, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
            <View style={styles.logoRow}>
              <View style={[styles.logoIcon, { backgroundColor: themeColors.brand, width: 26, height: 26, borderRadius: 6 }]}>
                <Sparkles size={14} color="#ffffff" />
              </View>
              <Text style={[styles.logoText, { color: themeColors.brand, fontSize: 16, fontWeight: "900" }]}>Prepora</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {/* Theme Dropdown Toggle */}
              <View style={styles.themeSelectorContainer}>
                <Pressable
                  style={[styles.iconButton, { width: 32, height: 32, borderRadius: 8, borderColor: themeColors.border, backgroundColor: themeColors.background }]}
                  onPress={() => setShowThemeMenu(!showThemeMenu)}
                >
                  {theme === "light" && <Sun size={15} color="#f59e0b" />}
                  {theme === "dark" && <Moon size={15} color="#6366f1" />}
                  {theme === "system" && <Laptop size={15} color={themeColors.textSecondary} />}
                </Pressable>

                {showThemeMenu && (
                  <View style={[styles.dropdownMenu, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setTheme("light");
                        setShowThemeMenu(false);
                      }}
                    >
                      <Sun size={12} color="#f59e0b" style={{ marginRight: 6 }} />
                      <Text style={[styles.dropdownText, { color: themeColors.text }]}>Light Mode</Text>
                    </Pressable>
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setTheme("dark");
                        setShowThemeMenu(false);
                      }}
                    >
                      <Moon size={12} color="#6366f1" style={{ marginRight: 6 }} />
                      <Text style={[styles.dropdownText, { color: themeColors.text }]}>Dark Mode</Text>
                    </Pressable>
                    <Pressable
                      style={styles.dropdownItem}
                      onPress={() => {
                        setTheme("system");
                        setShowThemeMenu(false);
                      }}
                    >
                      <Laptop size={12} color={themeColors.textSecondary} style={{ marginRight: 6 }} />
                      <Text style={[styles.dropdownText, { color: themeColors.text }]}>System</Text>
                    </Pressable>
                  </View>
                )}
              </View>

              <Pressable style={styles.menuButton} onPress={() => setIsSidebarOpen(true)}>
                <Menu size={22} color={themeColors.text} />
              </Pressable>
            </View>
          </View>

          {/* Board Content (no search bar at top!) */}
          {BoardContent}



          {/* Collapsible Mobile Sidebar Drawer */}
          {isSidebarOpen && (
            <View style={StyleSheet.absoluteFill}>
              <Pressable
                style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(15, 23, 42, 0.4)" }]}
                onPress={() => setIsSidebarOpen(false)}
              />
              {renderSidebar(true)}
            </View>
          )}
        </View>
      )}

      {/* MODALS */}
      {isAddQuestionOpen && (
        <AddQuestionModal
          isOpen={isAddQuestionOpen}
          onClose={() => setIsAddQuestionOpen(false)}
          onAdd={addQuestion}
          sets={sets}
          activeSetId={activeSetId}
          onOpenAddSet={() => setIsAddSetOpen(true)}
        />
      )}

      {isAddSetOpen && (
        <AddSetModal
          isOpen={isAddSetOpen}
          onClose={() => setIsAddSetOpen(false)}
          onAdd={(name, desc) => {
            const newId = addSet(name, desc);
            setActiveSetId(newId);
          }}
        />
      )}

      {confirmConfig && (
        <ConfirmModal
          isOpen={!!confirmConfig}
          onClose={() => setConfirmConfig(null)}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          variant={confirmConfig.variant}
        />
      )}
    </View>
  );
}

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
  },
  splitLayout: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 260,
    borderRightWidth: 1,
    height: "100%",
  },
  sidebarHeader: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  logoSubtext: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  sidebarSearch: {
    padding: Spacing.three,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 38,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  sidebarScroll: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
  },
  sidebarSectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
    paddingHorizontal: 6,
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sidebarList: {
    gap: 4,
  },
  sidebarItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sidebarItemActive: {
    // bg injected dynamically
  },
  sidebarItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  sidebarItemName: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  sidebarItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sidebarItemBadge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  sidebarDeleteBtn: {
    padding: 4,
    borderRadius: 6,
  },
  splitMain: {
    flex: 1,
    height: "100%",
  },
  mobileLayout: {
    flex: 1,
  },
  mobileSearchWrapper: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  boardWrapper: {
    flex: 1,
  },
  boardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    flexWrap: "wrap",
    gap: 12,
  },
  boardHeaderLeft: {
    flex: 1,
    minWidth: 150,
  },
  boardTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  boardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  boardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  themeSelectorContainer: {
    position: "relative",
    zIndex: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  themeDropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 4,
    width: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownIcon: {
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: "600",
  },
  quickAddButton: {
    flexDirection: "row",
    height: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0d9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  btnIcon: {
    marginRight: 4,
  },
  quickAddButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  boardBody: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
    flexWrap: "wrap",
    gap: 8,
  },
  filterTabs: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterTabActive: {
    // shadow etc.
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBadgeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  searchBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: Spacing.three,
  },
  searchBannerText: {
    fontSize: 12,
  },
  cardsList: {
    gap: 2,
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.five,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.two,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.three,
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
    maxWidth: 320,
    lineHeight: 18,
  },
  emptyButton: {
    height: 38,
    paddingHorizontal: Spacing.four,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  mobileHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: -8,
  },
  mobileHeaderTitleContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  mobileHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  themeToggleWrapper: {
    position: "relative",
    zIndex: 100,
  },
  themeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: 38,
    right: 0,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 200,
  },
  mobileSidebarOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    height: "100%",
    borderRightWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000,
  },
  closeSidebarButton: {
    padding: 6,
    borderRadius: 8,
  },
});
