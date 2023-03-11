https://github.com/react-native-clipboard/clipboard

ni @react-native-clipboard/clipboard
npx pod-install

```jsx
import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const App = () => {
  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = () => {
    Clipboard.setString('hello world');
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={copyToClipboard}>
          <Text>Click here to copy to Clipboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={fetchCopiedText}>
          <Text>View copied text</Text>
        </TouchableOpacity>

        <Text style={styles.copiedText}>{copiedText}</Text>
      </View>
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
```
