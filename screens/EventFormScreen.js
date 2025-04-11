import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { auth, db } from '../config/firebase';

export default function EventFormScreen({ route, navigation }) {
  const event = route.params?.event;

  const [title, setTitle] = useState(event ? event.title : '');
  const [description, setDescription] = useState(event ? event.description : '');
  const [location, setLocation] = useState(event ? event.location : '');
  const [dateTime, setDateTime] = useState(event ? event.dateTime : '');
  const [organizer, setOrganizer] = useState(event ? event.organizer : '');
  const [category, setCategory] = useState(event ? event.category : '');

  const handleSave = async () => {
    if (!title || !description || !location || !dateTime || !organizer || !category) {
      Alert.alert('Validation', 'Please fill in all fields');
      return;
    }

    try {
      if (event) {
        await updateDoc(doc(db, 'events', event.id), {
          title,
          description,
          location,
          dateTime,
          organizer,
          category
        });
        navigation.goBack();
      } else {
        await addDoc(collection(db, 'events'), {
          title,
          description,
          location,
          dateTime,
          organizer,
          category,
          userId: auth.currentUser.uid,
          createdAt: new Date().toISOString()
        });
        Alert.alert('Success', 'Event successfully created');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        {event ? 'Edit Event' : 'Create New Event'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        multiline
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Date & Time (e.g. 2025-04-20 18:00)"
        value={dateTime}
        onChangeText={setDateTime}
      />

      <TextInput
        style={styles.input}
        placeholder="Organizer Name"
        value={organizer}
        onChangeText={setOrganizer}
      />

      <TextInput
        style={styles.input}
        placeholder="Category (e.g. Music, Tech, Sports)"
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{event ? 'Update Event' : 'Create Event'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
