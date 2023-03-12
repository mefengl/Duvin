import 'react-native-url-polyfill/auto';
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

import {Configuration, OpenAIApi} from 'openai';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useOpenAIKey = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  useEffect(() => {
    const getOpenAIKey = async () => {
      const OPENAI_API_KEY = await AsyncStorage.getItem('OPENAI_API_KEY');
      if (OPENAI_API_KEY) {
        setOpenAIKey(OPENAI_API_KEY);
      }
    };
    getOpenAIKey();
  }, []);
  return openAIKey;
};

const useOneExampleConversation = () => {
  const apiKey = useOpenAIKey();
  const [conversation, setConversation] = useState<one_conversation>({
    prompt: '子在川上曰,这句话是什么意思？',
    response: '',
  });
  useEffect(() => {
    if (apiKey !== '') {
      const config = new Configuration({
        apiKey,
      });
      const openai = new OpenAIApi(config);
      const getAnswer = async () => {
        const prompt = conversation.prompt;
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{role: 'user', content: prompt}],
        });
        const answer = completion.data.choices[0].message?.content;
        setConversation({
          prompt,
          // @ts-ignore
          response: answer,
        });
      };
      getAnswer();
    }
  }, [apiKey, conversation.prompt]);

  return conversation;
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

  const oneExampleConversation = useOneExampleConversation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <OpenAIKeyInputBox />
      <View style={styles.container}>
        <Text style={styles.copiedText}>{copiedText}</Text>
      </View>
      <FlatList
        // data={conversations}
        data={[oneExampleConversation]}
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
