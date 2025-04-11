import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EventDetailsScreen({ route }) {
  const { event } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.detail}><Text style={styles.label}>📍 Location:</Text> {event.location}</Text>
        <Text style={styles.detail}><Text style={styles.label}>📅 Date & Time:</Text> {event.dateTime}</Text>
        <Text style={styles.detail}><Text style={styles.label}>📝 Description:</Text> {event.description}</Text>
        <Text style={styles.detail}><Text style={styles.label}>🏷 Category:</Text> {event.category}</Text>
        <Text style={styles.detail}><Text style={styles.label}>👤 Organizer:</Text> {event.organizer}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f0f2f5',
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  detail: {
    fontSize: 16,
    marginBottom: 12,
    color: '#555',
  },
  label: {
    fontWeight: '600',
    color: '#000',
  },
});
