import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ScreenBackground from '../../components/ScreenBackground';
import FigmaIcon from '../../components/FigmaIcon';
import { PrimaryButton } from '../../components/ui';
import { HeaderWave } from './HeaderWave';
import {
  CHAT_STEPS,
  Reply,
  TextField,
  cleanName,
  formatBirthday,
  isValidBirthday,
} from '../../constants/onboarding';
import type { Profile } from '../../state/AppState';
import { Colors, Fonts, Type } from '../../constants/theme';

interface Message {
  id: number;
  from: 'billy' | 'user';
  text: string;
  /** Name above the bubble; null hides it (consecutive messages) */
  speaker: string | null;
  background?: string;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const readingTime = (text: string) => Math.min(500 + text.length * 12, 1600);

function Bubble({ message }: { message: Message }) {
  const mine = message.from === 'user';
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={[styles.message, mine ? styles.messageMine : styles.messageBilly]}
    >
      {message.speaker !== null && (
        <Text style={[styles.speaker, mine && { textAlign: 'right' }]}>{message.speaker}</Text>
      )}
      <View
        style={[
          styles.bubble,
          mine ? styles.bubbleMine : styles.bubbleBilly,
          message.background ? { backgroundColor: message.background } : null,
        ]}
      >
        <Text style={Type.chat}>{message.text}</Text>
      </View>
    </Animated.View>
  );
}

function OptionButton({
  label,
  onPress,
  centered = false,
  background,
  outlined = true,
}: {
  label: string;
  onPress: () => void;
  centered?: boolean;
  background?: string;
  outlined?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      style={[
        styles.option,
        outlined ? styles.optionOutlined : styles.optionSoft,
        background ? { backgroundColor: background } : null,
      ]}
    >
      <Text style={[Type.chat, centered && { textAlign: 'center' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

interface ChatScreenProps {
  onFinish: (profile: Profile) => void;
}

/** Billy's first conversation ("Prise d'information" frames). */
export default function ChatScreen({ onFinish }: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(390);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [awaiting, setAwaiting] = useState(false);
  const [draft, setDraft] = useState('');
  const [replyHeight, setReplyHeight] = useState(80);
  const nextId = useRef(0);
  const scroll = useRef<ScrollView>(null);
  const input = useRef<TextInput>(null);
  const step = CHAT_STEPS[stepIndex];

  const push = (message: Omit<Message, 'id'>) =>
    setMessages((prev) => [...prev, { ...message, id: nextId.current++ }]);

  // Billy writes the lines of the current step, then waits for an answer
  useEffect(() => {
    let cancelled = false;
    const lines = step.billy(profile);
    (async () => {
      await wait(stepIndex === 0 ? 500 : 700);
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;
        push({
          from: 'billy',
          text: lines[i],
          speaker: i === 0 ? profile.petName ?? '????' : null,
        });
        await wait(readingTime(lines[i]));
      }
      if (!cancelled) setAwaiting(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [stepIndex]);

  // On web the input mounts during its entering animation; focus it once visible
  useEffect(() => {
    if (!awaiting || step.reply.kind !== 'text') return;
    const timer = setTimeout(() => input.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [awaiting, step]);

  const answer = (text: string, patch: Partial<Profile> = {}, background?: string) => {
    setAwaiting(false);
    const finishing = step.reply.kind === 'button' && step.reply.finish;
    // The last button starts the app; it is not an answer to Billy
    if (!finishing) push({ from: 'user', text, speaker: 'Vous', background });
    const next = { ...profile, ...patch };
    setProfile(next);
    if (finishing) {
      onFinish({
        petName: next.petName || 'Billy',
        userName: next.userName ?? '',
        birthday: next.birthday ?? '',
        dailyLife: next.dailyLife ?? '',
        allergy: next.allergy ?? '',
        color: next.color ?? '',
      });
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const field: TextField | null = step.reply.kind === 'text' ? step.reply.field : null;
  const isBirthday = field === 'birthday';
  const canSend = isBirthday ? isValidBirthday(draft) : draft.trim().length > 0;

  const send = () => {
    if (!field || !canSend) return;
    const text = draft.trim();
    setDraft('');
    const value = field === 'petName' || field === 'userName' ? cleanName(text) : text;
    answer(text, { [field]: value });
  };

  const renderReply = (reply: Reply) => {
    switch (reply.kind) {
      case 'choices':
        return (
          <View style={styles.row}>
            {reply.options.map((option) => (
              <OptionButton key={option} label={option} onPress={() => answer(option)} />
            ))}
          </View>
        );
      case 'allergies':
        return (
          <View style={styles.grid}>
            {reply.options.map((option) => (
              <OptionButton
                key={option.label}
                label={option.label}
                centered
                onPress={() => answer(option.answer, { allergy: option.label })}
              />
            ))}
          </View>
        );
      case 'colors':
        return (
          <View style={styles.grid}>
            {reply.options.map((option) => (
              <OptionButton
                key={option.label}
                label={option.label}
                centered
                outlined={false}
                background={option.bubble}
                onPress={() => answer(`${option.label} !`, { color: option.label }, option.bubble)}
              />
            ))}
          </View>
        );
      case 'button':
        return <PrimaryButton label={reply.label} onPress={() => answer(reply.label)} />;
      case 'text':
        return (
          <View style={styles.inputBar}>
            <TextInput
              ref={input}
              value={draft}
              onChangeText={(text) => setDraft(isBirthday ? formatBirthday(text) : text)}
              onSubmitEditing={send}
              placeholder={isBirthday ? 'JJ/MM/AAAA' : 'Votre message...'}
              placeholderTextColor={Colors.blueText}
              keyboardType={isBirthday ? 'number-pad' : 'default'}
              autoCapitalize={field === 'dailyLife' ? 'sentences' : 'words'}
              autoCorrect={false}
              maxLength={isBirthday ? 10 : 60}
              returnKeyType="send"
              aria-label={isBirthday ? 'Date de naissance' : 'Votre message'}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={send}
              disabled={!canSend}
              activeOpacity={0.8}
              accessibilityRole="button"
              aria-label="Envoyer"
              style={[styles.send, !canSend && { opacity: 0.4 }]}
            >
              <FigmaIcon name="iconSend" />
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <ScreenBackground flat />
      <ScrollView
        ref={scroll}
        style={styles.flex}
        contentContainerStyle={[
          styles.messages,
          { paddingTop: 150 + insets.top, paddingBottom: replyHeight + 48 + insets.bottom },
        ]}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.thread} aria-live="polite">
          {messages.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}
        </View>
      </ScrollView>

      <LinearGradient
        colors={['rgba(239,237,250,0)', Colors.chatFade, Colors.chatFade]}
        locations={[0, 0.24, 1]}
        style={[styles.fade, { height: replyHeight + 64 + insets.bottom }]}
        pointerEvents="none"
      />
      <View
        style={[styles.reply, { bottom: 24 + insets.bottom }]}
        onLayout={(e) => setReplyHeight(e.nativeEvent.layout.height)}
      >
        {awaiting && (
          <Animated.View key={stepIndex} entering={FadeInDown.duration(250)}>
            {renderReply(step.reply)}
          </Animated.View>
        )}
      </View>

      <HeaderWave width={width} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
  messages: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
  },
  thread: {
    gap: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  message: {
    gap: 1,
    maxWidth: '75%',
  },
  messageBilly: {
    alignSelf: 'flex-start',
    width: 236,
  },
  messageMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  speaker: {
    fontFamily: Fonts.interMedium,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.25,
    color: Colors.blueMuted,
  },
  bubble: {
    backgroundColor: Colors.lightWhite,
    borderWidth: 2,
    borderColor: Colors.middleWhite,
    padding: 16,
    borderRadius: 12,
  },
  bubbleBilly: {
    alignSelf: 'stretch',
    borderBottomLeftRadius: 0,
  },
  bubbleMine: {
    borderBottomRightRadius: 0,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  reply: {
    position: 'absolute',
    left: 24,
    right: 24,
    minHeight: 48,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexGrow: 1,
    flexBasis: '45%',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  optionOutlined: {
    backgroundColor: Colors.lightWhite,
    borderWidth: 1,
    borderColor: Colors.blue,
  },
  optionSoft: {
    borderWidth: 2,
    borderColor: Colors.middleWhite,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.interRegular,
    fontSize: 16,
    color: Colors.blueText,
    paddingVertical: 4,
    marginRight: 8,
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  send: {
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
