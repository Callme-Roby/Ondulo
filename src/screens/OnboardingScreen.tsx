import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Colors, Fonts } from '../constants/theme';
import { ONBOARDING_STEPS, OnboardingAnswers, Reply } from '../constants/onboarding';
import { Profile, saveProfile } from '../storage/profileStore';
import BillyAvatar from '../components/BillyAvatar';

interface ChatMessage {
  id: number;
  from: 'billy' | 'user';
  text: string;
}

interface OnboardingScreenProps {
  onComplete: (profile: Profile) => void;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Billy "types" a little longer for longer sentences
const typingDuration = (text: string) => Math.min(450 + text.length * 14, 1400);

function TypingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 300 }), withTiming(0.3, { duration: 300 })),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

function SendIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const [billyTyping, setBillyTyping] = useState(false);
  const [awaitingReply, setAwaitingReply] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [draft, setDraft] = useState('');
  const nextId = useRef(0);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const reply = ONBOARDING_STEPS[stepIndex].reply;

  const addMessage = (from: ChatMessage['from'], text: string) => {
    setMessages((prev) => [...prev, { id: nextId.current++, from, text }]);
  };

  const scrollToEnd = () => scrollRef.current?.scrollToEnd({ animated: true });

  // Billy says the lines of the current step, then waits for an answer
  useEffect(() => {
    let cancelled = false;
    const lines = ONBOARDING_STEPS[stepIndex].billy(answers);

    (async () => {
      await wait(400);
      for (const line of lines) {
        if (cancelled) return;
        setBillyTyping(true);
        await wait(typingDuration(line));
        if (cancelled) return;
        setBillyTyping(false);
        addMessage('billy', line);
        await wait(250);
      }
      if (!cancelled) setAwaitingReply(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [stepIndex]);

  // Focus the name field once its entering animation has started; on web the
  // element is still hidden on mount, so autoFocus would be ignored.
  useEffect(() => {
    if (!awaitingReply || reply.kind !== 'text') return;
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [awaitingReply, reply]);

  const finish = async (finalAnswers: Partial<OnboardingAnswers>, delay: number) => {
    setFinishing(true);
    const profile: Profile = { ...finalAnswers, createdAt: new Date().toISOString() };
    await saveProfile(profile);
    await wait(delay);
    onComplete(profile);
  };

  const answer = (label: string, patch: Partial<OnboardingAnswers>) => {
    setAwaitingReply(false);
    addMessage('user', label);
    const nextAnswers = { ...answers, ...patch };
    setAnswers(nextAnswers);
    if (stepIndex < ONBOARDING_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      finish(nextAnswers, 700);
    }
  };

  const submitName = () => {
    const name = draft.trim();
    if (!name) return;
    setDraft('');
    answer(name, { name });
  };

  const renderReply = (reply: Reply) => {
    switch (reply.kind) {
      case 'text':
        return (
          <View style={styles.inputRow}>
            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={submitName}
              placeholder={reply.placeholder}
              placeholderTextColor={Colors.textLight}
              autoCapitalize="words"
              autoComplete="given-name"
              autoCorrect={false}
              maxLength={30}
              returnKeyType="send"
              aria-label={reply.placeholder}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={submitName}
              disabled={!draft.trim()}
              activeOpacity={0.8}
              accessibilityRole="button"
              aria-label="Envoyer"
              style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
            >
              <SendIcon />
            </TouchableOpacity>
          </View>
        );
      case 'choice':
        return (
          <View style={styles.chips}>
            {reply.options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() =>
                  answer(option.label, { [reply.field]: option.value } as Partial<OnboardingAnswers>)
                }
                activeOpacity={0.7}
                accessibilityRole="button"
                style={styles.chip}
              >
                <Text style={styles.chipText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'finish':
        return (
          <TouchableOpacity
            onPress={() => answer(reply.label, {})}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={styles.finishBtn}
          >
            <Text style={styles.finishText}>{reply.label}</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <BillyAvatar size={72} />
          <Text style={styles.billyName}>Billy</Text>
          <Text style={styles.billyStatus}>
            {billyTyping ? "est en train d'écrire…" : 'ton compagnon Ondulo'}
          </Text>
          {!finishing && (
            <TouchableOpacity
              onPress={() => finish(answers, 0)}
              accessibilityRole="button"
              style={styles.skipBtn}
            >
              <Text style={styles.skipText}>Passer</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          onContentSizeChange={scrollToEnd}
          onLayout={scrollToEnd}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View aria-live="polite">
            {messages.map((message) => (
              <Animated.View
                key={message.id}
                entering={FadeInDown.duration(300)}
                style={[
                  styles.bubble,
                  message.from === 'billy' ? styles.bubbleBilly : styles.bubbleUser,
                ]}
              >
                <Text
                  style={[styles.bubbleText, message.from === 'user' && styles.bubbleTextUser]}
                >
                  {message.text}
                </Text>
              </Animated.View>
            ))}
          </View>
          {billyTyping && (
            <Animated.View
              entering={FadeInDown.duration(200)}
              style={[styles.bubble, styles.bubbleBilly, styles.typingBubble]}
            >
              <TypingDot delay={0} />
              <TypingDot delay={150} />
              <TypingDot delay={300} />
            </Animated.View>
          )}
        </ScrollView>

        <View style={styles.replyArea}>
          {awaitingReply && !finishing && (
            <Animated.View entering={FadeInDown.duration(250)}>
              {renderReply(reply)}
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  billyName: {
    fontSize: 18,
    fontWeight: Fonts.bold,
    color: Colors.primary,
    marginTop: 8,
  },
  billyStatus: {
    fontSize: 13,
    color: Colors.textMedium,
    marginTop: 2,
  },
  skipBtn: {
    position: 'absolute',
    top: 8,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: Fonts.semiBold,
    color: Colors.textMedium,
  },
  messages: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  bubble: {
    maxWidth: '82%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  bubbleBilly: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderTopRightRadius: 6,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textDark,
  },
  bubbleTextUser: {
    color: Colors.white,
  },
  typingBubble: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.textLight,
  },
  replyArea: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipText: {
    fontSize: 15,
    fontWeight: Fonts.semiBold,
    color: Colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 28,
    paddingLeft: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
    paddingVertical: 10,
    marginRight: 8,
    // The rounded row already shows focus; drop the browser outline
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  finishBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishText: {
    fontSize: 16,
    fontWeight: Fonts.bold,
    color: Colors.white,
  },
});
