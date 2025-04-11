import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { auth, db } from '../config/firebase';

export default function EventFormScreen({ route, navigation }) {
  const event = route.params?.event;
  const [title, setTitle] = useState(event ? event.title : '');
  const [description, setDescription] = useState(event ? event.description : '');

  const handleSave = async () => {
    if (!title || !description) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    if (event) {
      await updateDoc(doc(db, 'events', event.id), { title, description });
    } else {
      await addDoc(collection(db, 'events'), { title, description, userId: auth.currentUser.uid });
    }
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Title:</Text>
      <TextInput value={title} onChangeText={setTitle} style={{ borderBottomWidth: 1 }} />
      <Text>Description:</Text>
      <TextInput value={description} onChangeText={setDescription} style={{ borderBottomWidth: 1 }} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}