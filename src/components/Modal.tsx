// src/components/Modal.tsx
import React from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
} from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  icon?: string;
}

export function ConfirmModal({
  visible, onCancel, onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  icon = '⚠',
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, danger ? styles.dangerBtn : styles.greenBtn]}
              onPress={onConfirm}
            >
              <Text style={[styles.confirmText, danger ? styles.dangerText : styles.greenText]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(20,31,20,0.4)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: 12, padding: 24,
    width: '100%', maxWidth: 380, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#e0ebe0',
  },
  icon:    { fontSize: 28, marginBottom: 4 },
  title:   { fontSize: 15, fontWeight: '700', color: '#141f14', textAlign: 'center' },
  message: { fontSize: 12, color: '#607860', textAlign: 'center', lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancelBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#ccdccc', backgroundColor: '#fff', alignItems: 'center',
  },
  cancelText: { fontSize: 13, fontWeight: '600', color: '#344834' },
  confirmBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1, alignItems: 'center',
  },
  greenBtn:   { backgroundColor: '#e8f5ec', borderColor: '#9ecfb0' },
  dangerBtn:  { backgroundColor: '#fdf0f0', borderColor: '#e0a8a8' },
  confirmText: { fontSize: 13, fontWeight: '600' },
  greenText:   { color: '#0f5228' },
  dangerText:  { color: '#b83232' },
});
