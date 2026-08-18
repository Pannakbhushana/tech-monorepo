import { useState, useEffect } from "react";
import type { Question, QuestionSet } from "../types";

const STORAGE_KEYS = {
  QUESTIONS: "prep_app_questions_v1",
  SETS: "prep_app_sets_v1",
  THEME: "prep_app_theme_v1",
  ACTIVE_SET: "prep_app_active_set_v1",
};

export const usePrepStore = () => {
  const [sets, setSets] = useState<QuestionSet[]>(() => {
    const savedSets = localStorage.getItem(STORAGE_KEYS.SETS);
    if (savedSets) {
      try {
        return JSON.parse(savedSets);
      } catch (e) {
        console.error("Failed to parse sets from localStorage", e);
      }
    }
    return [];
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const savedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (savedQuestions) {
      try {
        return JSON.parse(savedQuestions);
      } catch (e) {
        console.error("Failed to parse questions from localStorage", e);
      }
    }
    return [];
  });

  const [activeSetId, setActiveSetId] = useState<string>(() => {
    const savedActiveSet = localStorage.getItem(STORAGE_KEYS.ACTIVE_SET);
    return savedActiveSet || "all";
  });

  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as "light" | "dark" | "system";
    return savedTheme || "system";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unrevised" | "revised">("all");

  // Sync active set to localStorage
  const handleSetActiveSetId = (id: string) => {
    setActiveSetId(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SET, id);
  };

  // Sync theme to DOM and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    
    let activeTheme = theme;
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      activeTheme = systemTheme;
    }
    
    root.classList.add(activeTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Listen to system theme change if set to system
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      const activeTheme = mediaQuery.matches ? "dark" : "light";
      root.classList.add(activeTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Save questions helper
  const saveQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(newQuestions));
  };

  // Save sets helper
  const saveSets = (newSets: QuestionSet[]) => {
    setSets(newSets);
    localStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify(newSets));
  };

  // 1. Add Question
  const addQuestion = (text: string, answer: string, setId: string) => {
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      answer: answer.trim(),
      isRevised: false,
      setId,
    };
    const updated = [newQuestion, ...questions];
    saveQuestions(updated);
  };

  // 2. Update Question (Edit text/answer)
  const updateQuestion = (id: string, text: string, answer: string, setId?: string) => {
    const updated = questions.map((q) => {
      if (q.id === id) {
        return {
          ...q,
          text: text.trim(),
          answer: answer,
          setId: setId || q.setId,
        };
      }
      return q;
    });
    saveQuestions(updated);
  };

  // 3. Delete Question
  const deleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    saveQuestions(updated);
  };

  // 4. Toggle Revised Status
  const toggleQuestionRevised = (id: string) => {
    const updated = questions.map((q) => {
      if (q.id === id) {
        return { ...q, isRevised: !q.isRevised };
      }
      return q;
    });
    saveQuestions(updated);
  };

  // 5. Add Custom Set
  const addSet = (name: string, description: string) => {
    const newSet: QuestionSet = {
      id: `set-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
    };
    const updated = [...sets, newSet];
    saveSets(updated);
    return newSet.id;
  };

  // 6. Delete Custom Set (and optionally delete or reassign questions)
  const deleteSet = (setId: string) => {
    // Delete the set
    const updatedSets = sets.filter((s) => s.id !== setId);
    saveSets(updatedSets);

    // Delete associated questions
    const updatedQuestions = questions.filter((q) => q.setId !== setId);
    saveQuestions(updatedQuestions);

    // If deleted active set, switch to "all"
    if (activeSetId === setId) {
      handleSetActiveSetId("all");
    }
  };

  // 7. Reset all questions in a set (Mark them as unrevised / not done)
  const resetSetQuestions = (setId: string) => {
    const updated = questions.map((q) => {
      if (setId === "all" || q.setId === setId) {
        return { ...q, isRevised: false };
      }
      return q;
    });
    saveQuestions(updated);
  };

  // 8. Restore specific revised questions (Mark as unrevised)
  const restoreQuestions = (ids: string[]) => {
    const idSet = new Set(ids);
    const updated = questions.map((q) => {
      if (idSet.has(q.id)) {
        return { ...q, isRevised: false };
      }
      return q;
    });
    saveQuestions(updated);
  };

  // 9. Mark all filtered/active questions as revised (Mark as done)
  const markQuestionsAsRevised = (ids: string[]) => {
    const idSet = new Set(ids);
    const updated = questions.map((q) => {
      if (idSet.has(q.id)) {
        return { ...q, isRevised: true };
      }
      return q;
    });
    saveQuestions(updated);
  };

  // 10. Reset to empty state (no hardcoded questions)
  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.SETS);
    setQuestions([]);
    setSets([]);
    handleSetActiveSetId("all");
  };

  // 11. Export entire backup as JSON
  const exportData = () => {
    const dataStr = JSON.stringify({ sets, questions }, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `prep-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // 12. Import backup JSON
  const importData = (jsonDataStr: string): { success: boolean; error?: string } => {
    try {
      const data = JSON.parse(jsonDataStr) as { sets?: unknown; questions?: unknown };
      if (!data.sets || !data.questions || !Array.isArray(data.sets) || !Array.isArray(data.questions)) {
        return { success: false, error: "Invalid backup format. Must contain 'sets' and 'questions' arrays." };
      }
      
      // Basic validation
      const setsArray = data.sets as Partial<QuestionSet>[];
      const questionsArray = data.questions as Partial<Question>[];
      
      const isValidSet = setsArray.every((s) => s && s.id && s.name);
      const isValidQuestion = questionsArray.every((q) => q && q.id && q.text && q.setId);
      
      if (!isValidSet || !isValidQuestion) {
        return { success: false, error: "Data integrity check failed. Some objects are missing required fields." };
      }

      saveSets(setsArray as QuestionSet[]);
      saveQuestions(questionsArray as Question[]);
      return { success: true };
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Failed to parse JSON file.";
      return { success: false, error: errMsg };
    }
  };

  // Filter questions based on activeSetId, searchQuery, and filterType
  const filteredQuestions = questions.filter((q) => {
    // 1. Filter by Set
    if (activeSetId !== "all" && q.setId !== activeSetId) {
      return false;
    }
    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = q.text.toLowerCase().includes(query);
      const matchAnswer = q.answer.toLowerCase().includes(query);
      if (!matchText && !matchAnswer) {
        return false;
      }
    }
    // 3. Filter by Done/Revised Status
    if (filterType === "unrevised" && q.isRevised) {
      return false;
    }
    if (filterType === "revised" && !q.isRevised) {
      return false;
    }
    return true;
  });

  return {
    questions,
    sets,
    activeSetId,
    setActiveSetId: handleSetActiveSetId,
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
    resetToDefaultData,
    exportData,
    importData,
  };
};
