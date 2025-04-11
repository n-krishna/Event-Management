import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import { db } from '../config/firebase';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    const snapshot = await getDocs(collection(db, 'favorites'));
    setFavorites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    Alert.alert('Confirm', 'Remove from favorites?', [
      { text: 'Cancel' },
      {
        text: 'Yes', onPress: async () => {
          await deleteDoc(doc(db, 'favorites', id));
          fetchFavorites();
        }
      }
    ]);
  };

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginTop: 10, borderBottomWidth: 1 }}>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Button title="Remove" onPress={() => handleRemove(item.id)} />
          </View>
        )}
      />
    </View>
  );
}