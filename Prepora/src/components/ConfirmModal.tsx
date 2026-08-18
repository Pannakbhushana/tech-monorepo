import React from "react";
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react-native";
import { useTheme } from "../hooks/use-theme";
import { Spacing } from "../constants/theme";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  const theme = useTheme();

  const getIcon = () => {
    const size = 24;
    switch (variant) {
      case "warning":
        return <AlertTriangle size={size} color={theme.warning} />;
      case "info":
        return <Info size={size} color={theme.brand} />;
      case "danger":
      default:
        return <AlertCircle size={size} color={theme.danger} />;
    }
  };

  const getIconBgColor = () => {
    switch (variant) {
      case "warning":
        return theme.warningBg;
      case "info":
        return theme.brandBg;
      case "danger":
      default:
        return theme.dangerBg;
    }
  };

  const getConfirmBtnColor = () => {
    switch (variant) {
      case "warning":
        return theme.warning;
      case "info":
        return theme.brand;
      case "danger":
      default:
        return theme.danger;
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop press to close */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Close button top right */}
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <X size={18} color={theme.textSecondary} />
          </Pressable>

          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: getIconBgColor() }]}>
            {getIcon()}
          </View>

          {/* Text content */}
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.btn, styles.cancelBtn, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>{cancelText}</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: getConfirmBtnColor() }]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.four,
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
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 6,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: Spacing.one,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: Spacing.four,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.two,
    width: "100%",
  },
  btn: {
    flex: 1,
    height: 44,
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
  confirmBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
