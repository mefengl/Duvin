import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, TextInput, Button} from 'react-native';

const OpenAIKeyInputBox = () => {
  const [openaiKey, setOpenaiKey] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);

  useEffect(() => {
    checkOpenaiKey();
  }, []);

  const checkOpenaiKey = async () => {
    const key = await AsyncStorage.getItem('OPENAI_API_KEY');
    setOpenaiKey(key);
  };

  const saveOpenaiKey = async () => {
    await AsyncStorage.setItem('OPENAI_API_KEY', inputKey);
    setOpenaiKey(inputKey);
    setInputKey('');
  };

  const clearOpenaiKey = async () => {
    await AsyncStorage.removeItem('OPENAI_API_KEY');
    setOpenaiKey(null);
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  const renderForm = () => (
    <View>
      <Text>Please enter your OpenAI key:</Text>
      <TextInput
        value={inputKey}
        onChangeText={setInputKey}
        placeholder="OpenAI key"
        autoCapitalize="none"
      />
      <Button title="Save" onPress={saveOpenaiKey} />
    </View>
  );

  const renderMessage = () => (
    <View>
      <Text>Your OpenAI key is:</Text>
      {showKey ? (
        <View>
          <Text>{openaiKey}</Text>
          <Button title="Hide" onPress={toggleShowKey} />
        </View>
      ) : (
        <Button title="Show" onPress={toggleShowKey} />
      )}
      <Button title="Clear" onPress={clearOpenaiKey} />
    </View>
  );

  return <View>{openaiKey ? renderMessage() : renderForm()}</View>;
};

export default OpenAIKeyInputBox;
