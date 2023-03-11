import React, {useState} from 'react';
import {FlatList, Text, View} from 'react-native';

type Item = {
  id: string;
  title: string;
};

type Props = {
  items: Item[];
};

const ListItem = ({title}: {title: string}) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

const ListScreen = ({items}: Props) => {
  const [selectedItemId, setSelectedItemId] = useState('');

  const renderItem = ({item}: {item: Item}) => <ListItem title={item.title} />;

  const handleItemPress = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      extraData={selectedItemId}
    />
  );
};

export default ListScreen;
