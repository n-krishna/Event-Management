import { useIsFocused } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../config/firebase';

export default function DashboardScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const isFocused = useIsFocused();

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'), where('userId', '==', auth.currentUser.uid));
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

  const toggleFavorite = async (eventId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'events', eventId), {
        favorite: !currentStatus,
      });
      fetchEvents();
    } catch (err) {
      console.error('Error updating favorite status:', err);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event: item })}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id, item.favorite)}>
            <Text style={styles.favoriteIcon}>{item.favorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.meta}>📅 {item.dateTime}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EventForm', { event: item })}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity style={[styles.toolbarCard, { backgroundColor: '#007bff' }]} onPress={() => navigation.navigate('EventForm')}>
          <Text style={styles.toolbarText}>+ Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarCard, { backgroundColor: '#007bff' }]} onPress={() => navigation.navigate('Favorites')}>
          <Text style={styles.toolbarText}>⭐ Favourites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarCard, { backgroundColor: '#ff4d4d' }]} onPress={() => signOut(auth).then(() => navigation.replace('SignIn'))}>
          <Text style={styles.toolbarText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No events yet. Start by creating one!</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toolbarCard: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toolbarText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#f1c40f',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    marginTop: 8,
    color: '#444',
  },
  category: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
  },
  organizer: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  editBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
});
