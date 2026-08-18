import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Question, QuestionSet } from "../types";

const STORAGE_KEYS = {
  QUESTIONS: "prep_app_questions_v1",
  SETS: "prep_app_sets_v1",
  THEME: "prep_app_theme_v1",
  ACTIVE_SET: "prep_app_active_set_v1",
};

const DEFAULT_SETS: QuestionSet[] = [
  {
    id: "set-javascript",
    name: "JavaScript",
    description: "Core JS concepts, ES6+, Async programming, and closures."
  },
  {
    id: "set-react",
    name: "React & React Native",
    description: "Components, Hooks, State management, and Native performance."
  }
];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1",
    setId: "set-javascript",
    text: "What is the difference between let, const, and var?",
    answer: "1. `var` is function-scoped, can be re-declared, and is hoisted with `undefined`.\n2. `let` is block-scoped, cannot be re-declared in the same scope, and is in the Temporal Dead Zone until initialized.\n3. `const` is block-scoped, cannot be reassigned, and must be initialized when declared.",
    isRevised: false
  },
  {
    id: "q2",
    setId: "set-javascript",
    text: "Explain closures in JavaScript.",
    answer: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function's scope even after the outer function has returned.\n\nExample:\n```javascript\nfunction outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  };\n}\nconst counter = outer();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```",
    isRevised: false
  },
  {
    id: "q3",
    setId: "set-react",
    text: "What is the difference between useEffect and useLayoutEffect?",
    answer: "- `useEffect` runs asynchronously **after** the render is committed to the screen and the browser has painted. It is suitable for most side-effects like data fetching and event listeners.\n- `useLayoutEffect` runs synchronously **before** the browser paints the screen, right after DOM mutations. Use it if you need to measure layout properties and make visual adjustments before paint to prevent flickering.",
    isRevised: false
  }
];

interface PrepStoreContextType {
  questions: Question[];
  sets: QuestionSet[];
  activeSetId: string;
  setActiveSetId: (id: string) => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: "all" | "unrevised" | "revised";
  setFilterType: (filter: "all" | "unrevised" | "revised") => void;
  filteredQuestions: Question[];
  addQuestion: (text: string, answer: string, setId: string) => void;
  updateQuestion: (id: string, text: string, answer: string, setId?: string) => void;
  deleteQuestion: (id: string) => void;
  toggleQuestionRevised: (id: string) => void;
  addSet: (name: string, description: string) => string;
  deleteSet: (setId: string) => void;
  resetSetQuestions: (setId: string) => void;
  restoreQuestions: (ids: string[]) => void;
  markQuestionsAsRevised: (ids: string[]) => void;
  loading: boolean;
}

const PrepStoreContext = createContext<PrepStoreContextType | undefined>(undefined);

export const PrepStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeSetId, setActiveSetIdState] = useState<string>("all");
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unrevised" | "revised">("all");
  const [loading, setLoading] = useState(true);

  // Load initial data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSets = await AsyncStorage.getItem(STORAGE_KEYS.SETS);
        const savedQuestions = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
        const savedActiveSet = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SET);
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);

        if (savedSets !== null) {
          setSets(JSON.parse(savedSets));
        } else {
          // First run - seed data
          setSets(DEFAULT_SETS);
          await AsyncStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify(DEFAULT_SETS));
        }

        if (savedQuestions !== null) {
          setQuestions(JSON.parse(savedQuestions));
        } else {
          // First run - seed data
          setQuestions(DEFAULT_QUESTIONS);
          await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
        }

        if (savedActiveSet !== null) {
          setActiveSetIdState(savedActiveSet);
        }

        if (savedTheme !== null) {
          setThemeState(savedTheme as "light" | "dark" | "system");
        }
      } catch (e) {
        console.error("Failed to load prep data from AsyncStorage", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const setActiveSetId = async (id: string) => {
    setActiveSetIdState(id);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SET, id);
    } catch (e) {
      console.error(e);
    }
  };

  const setTheme = async (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch (e) {
      console.error(e);
    }
  };

  const saveQuestions = async (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(newQuestions));
    } catch (e) {
      console.error(e);
    }
  };

  const saveSets = async (newSets: QuestionSet[]) => {
    setSets(newSets);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETS, JSON.stringify(newSets));
    } catch (e) {
      console.error(e);
    }
  };

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

  const deleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    saveQuestions(updated);
  };

  const toggleQuestionRevised = (id: string) => {
    const updated = questions.map((q) => {
      if (q.id === id) {
        return { ...q, isRevised: !q.isRevised };
      }
      return q;
    });
    saveQuestions(updated);
  };

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

  const deleteSet = (setId: string) => {
    const updatedSets = sets.filter((s) => s.id !== setId);
    saveSets(updatedSets);

    const updatedQuestions = questions.filter((q) => q.setId !== setId);
    saveQuestions(updatedQuestions);

    if (activeSetId === setId) {
      setActiveSetId("all");
    }
  };

  const resetSetQuestions = (setId: string) => {
    const updated = questions.map((q) => {
      if (setId === "all" || q.setId === setId) {
        return { ...q, isRevised: false };
      }
      return q;
    });
    saveQuestions(updated);
  };

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

  const filteredQuestions = questions.filter((q) => {
    if (activeSetId !== "all" && q.setId !== activeSetId) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = q.text.toLowerCase().includes(query);
      const matchAnswer = q.answer.toLowerCase().includes(query);
      if (!matchText && !matchAnswer) {
        return false;
      }
    }
    if (filterType === "unrevised" && q.isRevised) {
      return false;
    }
    if (filterType === "revised" && !q.isRevised) {
      return false;
    }
    return true;
  });

  return (
    <PrepStoreContext.Provider
      value={{
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
        loading,
      }}
    >
      {children}
    </PrepStoreContext.Provider>
  );
};

export const usePrepStore = () => {
  const context = useContext(PrepStoreContext);
  if (!context) {
    throw new Error("usePrepStore must be used within a PrepStoreProvider");
  }
  return context;
};
