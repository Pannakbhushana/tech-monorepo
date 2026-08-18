import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { FolderPlus, X } from "lucide-react-native";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";

interface AddSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, description: string) => void;
}

export const AddSetModal: React.FC<AddSetModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Set name cannot be empty.");
      return;
    }
    onAdd(name, description);
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

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
              <FolderPlus size={20} color={theme.brand} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>Create Subject Set</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView contentContainerStyle={styles.form}>
            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: theme.dangerBg, borderColor: theme.danger }]}>
                <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Set / Category Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g. Web Security, System Design"
                placeholderTextColor={theme.textSecondary + "80"}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (error) setError("");
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textarea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                placeholder="Briefly describe what topics this question set covers..."
                placeholderTextColor={theme.textSecondary + "80"}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
              />
            </View>

            {/* Footer Buttons */}
            <View style={[styles.footer, { borderTopColor: theme.border }]}>
              <Pressable
                style={[styles.btn, styles.cancelBtn, { borderColor: theme.border }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.submitBtn, { backgroundColor: theme.brand }]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitBtnText}>Create Set</Text>
              </Pressable>
            </View>
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
    maxHeight: "85%",
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
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
  },
  textarea: {
    height: 100,
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
