// src/components/index.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

// ─── ThemedText ───────────────────────────────────────────────
type TextVariant = 'display' | 'body' | 'caption' | 'label' | 'mono';
interface ThemedTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  size?: number;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
}
export function ThemedText({
  children, variant = 'body', size, color, style, numberOfLines,
}: ThemedTextProps) {
  const base = variantStyles[variant];
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[base, size ? { fontSize: size } : null, color ? { color } : null, style]}
    >
      {children}
    </Text>
  );
}
const variantStyles: Record<TextVariant, TextStyle> = {
  display: { fontFamily: undefined, fontSize: 20, fontWeight: '700', color: '#141f14' },
  body:    { fontSize: 13, color: '#344834' },
  caption: { fontSize: 10, color: '#607860' },
  label:   { fontSize: 11, fontWeight: '600', color: '#344834' },
  mono:    { fontFamily: undefined, fontSize: 11, color: '#607860' },
};

// ─── Button ──────────────────────────────────────────────────
type ButtonVariant = 'green' | 'ghost' | 'red';
type ButtonSize = 'sm' | 'md';
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
}
export function Button({ label, onPress, variant = 'green', size = 'md', loading, disabled }: ButtonProps) {
  const vs = btnVariant[variant];
  const ss = size === 'sm' ? { paddingHorizontal: 10, paddingVertical: 5 } : { paddingHorizontal: 14, paddingVertical: 8 };
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[btnStyles.base, vs.btn, ss, (disabled || loading) ? { opacity: 0.5 } : null]}
    >
      {loading
        ? <ActivityIndicator size="small" color={vs.textColor} />
        : <Text style={[btnStyles.text, { color: vs.textColor, fontSize: size === 'sm' ? 10 : 12 }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}
const btnVariant = {
  green: { btn: { backgroundColor: '#e8f5ec', borderColor: '#9ecfb0' }, textColor: '#0f5228' },
  ghost: { btn: { backgroundColor: '#fff', borderColor: '#ccdccc' }, textColor: '#344834' },
  red:   { btn: { backgroundColor: '#fdf0f0', borderColor: '#e0a8a8' }, textColor: '#b83232' },
};
const btnStyles = StyleSheet.create({
  base: { borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '600' },
});

// ─── Badge ───────────────────────────────────────────────────
type BadgeVariant = 'pass' | 'fail' | 'muted' | 'violet' | 'amber';
interface BadgeProps { label: string; variant?: BadgeVariant; }
export function Badge({ label, variant = 'muted' }: BadgeProps) {
  const vs = badgeVariant[variant] || badgeVariant.muted;
  return (
    <View style={[badgeStyles.base, { backgroundColor: vs.bg, borderColor: vs.bd }]}>
      <Text style={[badgeStyles.text, { color: vs.tx }]}>{label}</Text>
    </View>
  );
}
const badgeVariant = {
  pass:   { bg: '#e8f5ec', bd: '#9ecfb0', tx: '#0f5228' },
  fail:   { bg: '#fdf0f0', bd: '#e0a8a8', tx: '#b83232' },
  muted:  { bg: '#f4f9f4', bd: '#e0ebe0', tx: '#607860' },
  violet: { bg: '#f0edf8', bd: '#b0a0d8', tx: '#6040a8' },
  amber:  { bg: '#fdf6ea', bd: '#d4b070', tx: '#a06010' },
};
const badgeStyles = StyleSheet.create({
  base: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  text: { fontSize: 9, fontWeight: '600' },
});

// ─── StatCard ────────────────────────────────────────────────
type StatColor = 'green' | 'teal' | 'blue' | 'violet' | 'amber' | 'red';
interface StatCardProps { value: number | string; label: string; color?: StatColor; }
export function StatCard({ value, label, color = 'green' }: StatCardProps) {
  const c = statColors[color] || statColors.green;
  return (
    <View style={[statStyles.card, { borderTopColor: c.bar, flex: 1 }]}>
      <Text style={[statStyles.value, { color: c.tx }]}>{value ?? 0}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}
const statColors: Record<StatColor, { bar: string; tx: string }> = {
  green:  { bar: '#1a7a3c', tx: '#1a7a3c' },
  teal:   { bar: '#147a65', tx: '#147a65' },
  blue:   { bar: '#1e5fa0', tx: '#1e5fa0' },
  violet: { bar: '#6040a8', tx: '#6040a8' },
  amber:  { bar: '#a06010', tx: '#a06010' },
  red:    { bar: '#b83232', tx: '#b83232' },
};
const statStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0ebe0',
    borderRadius: 10, padding: 14, borderTopWidth: 3,
  },
  value: { fontSize: 26, fontWeight: '700', marginBottom: 2 },
  label: { fontSize: 9, color: '#607860', textTransform: 'uppercase', letterSpacing: 0.5 },
});

// ─── SectionCard ─────────────────────────────────────────────
interface SectionCardProps {
  title: string;
  count?: number;
  children: React.ReactNode;
}
export function SectionCard({ title, count, children }: SectionCardProps) {
  return (
    <View style={sectionStyles.card}>
      <View style={sectionStyles.header}>
        <Text style={sectionStyles.title}>{title}</Text>
        {count !== undefined && (
          <View style={sectionStyles.countBadge}>
            <Text style={sectionStyles.countText}>{count}</Text>
          </View>
        )}
      </View>
      {children}
    </View>
  );
}
const sectionStyles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0ebe0', borderRadius: 10, overflow: 'hidden' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#e0ebe0',
    backgroundColor: '#f4f9f4',
  },
  title: { fontSize: 13, fontWeight: '600', color: '#141f14', flex: 1 },
  countBadge: { backgroundColor: '#f4f9f4', borderWidth: 1, borderColor: '#e0ebe0', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { fontSize: 9, color: '#607860' },
});

// ─── Loading ─────────────────────────────────────────────────
interface LoadingProps { text?: string; }
export function Loading({ text = 'Loading…' }: LoadingProps) {
  return (
    <View style={loadStyles.wrap}>
      <ActivityIndicator size="large" color="#1a7a3c" />
      <Text style={loadStyles.text}>{text}</Text>
    </View>
  );
}
const loadStyles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  text: { fontSize: 10, color: '#607860', letterSpacing: 0.5 },
});

// ─── EmptyState ──────────────────────────────────────────────
interface EmptyStateProps { icon?: string; message: string; }
export function EmptyState({ icon = '◆', message }: EmptyStateProps) {
  return (
    <View style={emptyStyles.wrap}>
      <Text style={emptyStyles.icon}>{icon}</Text>
      <Text style={emptyStyles.text}>{message}</Text>
    </View>
  );
}
const emptyStyles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 8 },
  icon: { fontSize: 28, opacity: 0.3 },
  text: { fontSize: 11, color: '#98b098' },
});

// ─── CongratsModal ───────────────────────────────────────────
import { Modal } from 'react-native';
interface CongratsModalProps {
  visible: boolean;
  pts: number;
  maxPts: number;
  trialsCount: number;
  onRetake: () => void;
  onHall: () => void;
}
export function CongratsModal({ visible, pts, maxPts, trialsCount, onRetake, onHall }: CongratsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex:1, backgroundColor:'rgba(10,20,10,0.7)', alignItems:'center', justifyContent:'center', padding:24 }}>
        <View style={{ backgroundColor:'#fff', borderRadius:12, padding:24, width:'100%', maxWidth:360, alignItems:'center', gap:10, borderWidth:1, borderColor:'#e0ebe0' }}>
          <Text style={{ fontSize:32 }}>✦</Text>
          <Text style={{ fontSize:18, fontWeight:'700', color:'#1a7a3c' }}>Solution Submitted!</Text>
          <Text style={{ fontSize:13, color:'#607860', textAlign:'center' }}>{pts} / {maxPts} pts · {trialsCount} trials</Text>
          <View style={{ flexDirection:'row', gap:10, marginTop:8 }}>
            <TouchableOpacity onPress={onRetake} style={{ flex:1, padding:10, borderRadius:8, borderWidth:1, borderColor:'#ccdccc', alignItems:'center' }}>
              <Text style={{ fontSize:13, fontWeight:'600', color:'#344834' }}>↺ Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onHall} style={{ flex:1, padding:10, borderRadius:8, borderWidth:1, borderColor:'#9ecfb0', backgroundColor:'#e8f5ec', alignItems:'center' }}>
              <Text style={{ fontSize:13, fontWeight:'600', color:'#0f5228' }}>← Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
