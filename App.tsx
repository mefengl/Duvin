import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, AppState} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import ListScreen from './ListScreen';

const App = () => {
  const [copiedText, setCopiedText] = useState('');

  const checkClipboardContent = async () => {
    const content = await Clipboard.getString();
    if (content !== '') {
      setCopiedText(content);
    }
  };

  useEffect(() => {
    const onFocus = async () => {
      checkClipboardContent();
    };

    const appStateListener = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkClipboardContent();
      }
    });

    onFocus();

    return () => {
      appStateListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.copiedText}>{copiedText}</Text>
      </View>
      <ListScreen
        items={[
          {id: '1', title: 'Item 1'},
          {id: '2', title: 'Item 2'},
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copiedText: {
    marginTop: 10,
    color: 'red',
  },
});

export default App;
