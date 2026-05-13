import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !pin.trim()) {
      Alert.alert('ত্রুটি', 'নাম এবং PIN উভয়ই প্রয়োজন');
      return;
    }

    if (pin.length !== 4 || isNaN(pin)) {
      Alert.alert('ত্রুটি', 'PIN অবশ্যই ৪ সংখ্যা হতে হবে');
      return;
    }

    setLoading(true);

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`http://YOUR_SERVER_IP:5000${endpoint}`, {
        name,
        pin,
      });

      if (response.data.success) {
        onLogin({
          userId: response.data.userId,
          name: response.data.name,
        });
        Alert.alert('সফল', `আপনি সফলভাবে ${activeTab === 'login' ? 'লগইন' : 'নিবন্ধন'} করেছেন`);
      }
    } catch (error) {
      Alert.alert(
        'ত্রুটি',
        error.response?.data?.error || 'একটি সমস্যা ঘটেছে। আবার চেষ্টা করুন।'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Icon name="storefront" size={50} color="#667eea" />
        <Text style={styles.title}>DC CUSTOMER'S</Text>
        <Text style={styles.subtitle}>গ্রাহক ব্যবস্থাপনা অ্যাপ্লিকেশন</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'login' && styles.tabButtonActive,
            ]}
            onPress={() => {
              setActiveTab('login');
              setName('');
              setPin('');
            }}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'login' && styles.tabButtonTextActive,
              ]}
            >
              লগইন
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'register' && styles.tabButtonActive,
            ]}
            onPress={() => {
              setActiveTab('register');
              setName('');
              setPin('');
            }}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'register' && styles.tabButtonTextActive,
              ]}
            >
              নতুন অ্যাকাউন্ট
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>আপনার নাম</Text>
            <TextInput
              style={styles.input}
              placeholder="নাম লিখুন"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#ccc"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>৪ সংখ্যার PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="0000"
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#ccc"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {activeTab === 'login' ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#667eea',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#667eea',
  },
  formContainer: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
