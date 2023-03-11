import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, AppState} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import OpenAIKeyInputBox from './OpenAIKeyInputBox';

const App = () => {
  const [copiedText, setCopiedText] = useState('');
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
