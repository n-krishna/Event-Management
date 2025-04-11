import { useIsFocused } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../config/firebase';

export default function DashboardScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const isFocused = useIsFocused();

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'), where("userId", "==", auth.currentUser.uid));
      const snapshot = await getDocs(q);
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    if (isFocused) fetchEvents();
  }, [isFocused]);

  const handleDelete = (eventId) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          await deleteDoc(doc(db, 'events', eventId));
          fetchEvents();
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.actions}>
        <Button title="Edit" onPress={() => navigation.navigate('EventForm', { event: item })} />
        <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Button title="Create Event" onPress={() => navigation.navigate('EventForm')} />
        <Button title="Favourites" onPress={() => navigation.navigate('Favorites')} />
        <Button title="Logout" color="red" onPress={() => signOut(auth).then(() => navigation.replace('SignIn'))} />
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No events yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  description: { marginTop: 4, fontSize: 14 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
});
