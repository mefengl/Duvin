import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  AppState,
  FlatList,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import OpenAIKeyInputBox from './OpenAIKeyInputBox';

const questions = [
  (sentence: string) => `${sentence}\n可以用表格的方式总结观点：`,
  (sentence: string) => `${sentence}\n如果用现实生活中的例子来说，就是：`,
  (sentence: string) => `${sentence}\n类似的句子还有：`,
  (sentence: string) => `${sentence}\n相反的观点有：`,
  (sentence: string) =>
    `${sentence}\n不同生活环境，不同职业的人会有不同的视角，比如：`,
  (sentence: string) => `${sentence}\n这句话相关历史和背景是：`,
  (sentence: string) => `${sentence}\n不同的国家对这句的看法会是：`,
  (sentence: string) => `${sentence}\n如果莎士比亚将它写成中文诗会是：`,
  (sentence: string) =>
    `${sentence}\n想要深入了解这句话，推荐以下的文章、书籍：`,
];

type one_conversation = {
  prompt: string;
  response: string;
};

const App = () => {
  const [copiedText, setCopiedText] = useState('');
  const [conversations, setConversations] = useState<one_conversation[]>([]);
  useEffect(() => {
    if (copiedText !== '') {
      const prompts = questions.map(q => q(copiedText));
      setConversations(
        prompts.map(prompt => ({
          prompt,
          response: '',
        })),
      );
    }
  }, [copiedText]);

  const checkClipboardContent = async () => {
    const content = await Clipboard.getString();
    if (content !== '') {
      setCopiedText(content);
    }
  };

  useEffect(() => {
    checkClipboardContent();
    const appStateListener = AppState.addEventListener(
      'change',
      state => state === 'active' && checkClipboardContent(),
    );
    return () => appStateListener.remove();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <OpenAIKeyInputBox />
      <View style={styles.container}>
        <Text style={styles.copiedText}>{copiedText}</Text>
      </View>
      <FlatList
        data={conversations}
        renderItem={({item}) => (
          <View style={styles.container}>
            <Text>{item.prompt}</Text>
            <Text>{item.response}</Text>
          </View>
        )}
        keyExtractor={item => item.prompt}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
});

export default App;
