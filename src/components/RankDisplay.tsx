// src/components/RankDisplay.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface RankUpPopupProps {
  visible: boolean;
  rankName: string;
  rankImg: string | null;
  onClose: () => void;
}

export function RankUpPopup({ visible, rankName, rankImg, onClose }: RankUpPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.crown}>✦</Text>
          <Text style={styles.title}>Rank Up!</Text>
          {rankImg ? (
            <Image
              source={{ uri: rankImg }}
              style={styles.img}
              resizeMode="contain"
            />
          ) : null}
          <Text style={styles.rankName}>{rankName}</Text>
          <Text style={styles.sub}>You've reached a new rank!</Text>
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(10,20,10,0.7)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  card: {
    backgroundColor: '#1a2414', borderRadius: 16, padding: 32,
    alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#3a5030',
    width: '100%', maxWidth: 320,
  },
  crown: { fontSize: 36, color: '#c9a84c' },
  title: { fontSize: 22, fontWeight: '700', color: '#c9a84c' },
  img:   { width: 80, height: 80, marginVertical: 8 },
  rankName: { fontSize: 18, fontWeight: '700', color: '#f0e8c8' },
  sub:   { fontSize: 12, color: '#8a9a7a', textAlign: 'center' },
  btn: {
    marginTop: 8, backgroundColor: '#2a4020', borderWidth: 1,
    borderColor: '#5a8040', borderRadius: 8,
    paddingHorizontal: 28, paddingVertical: 10,
  },
  btnText: { color: '#c9a84c', fontWeight: '600', fontSize: 13 },
});
