import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation, userData, onLogout }) => {
  const [pages, setPages] = useState([]);
  const [filteredPages, setFilteredPages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [newPage, setNewPage] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    rate: '',
  });

  useEffect(() => {
    loadPages();
  }, [userData]);

  useEffect(() => {
    filterPages();
  }, [searchQuery, pages]);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://YOUR_SERVER_IP:5000/api/pages/user/${userData.userId}`
      );
      setPages(response.data.pages || []);
    } catch (error) {
      console.error('পৃষ্ঠা লোড করতে ত্রুটি:', error);
      Alert.alert('ত্রুটি', 'পৃষ্ঠা লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPages();
    setRefreshing(false);
  };

  const filterPages = () => {
    if (!searchQuery.trim()) {
      setFilteredPages(pages);
      return;
    }

    const filtered = pages.filter(
      (page) =>
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.date.includes(searchQuery)
    );
    setFilteredPages(filtered);
  };

  const handleCreatePage = async () => {
    if (!newPage.name.trim() || !newPage.date || !newPage.rate) {
      Alert.alert('ত্রুটি', 'সমস্ত ফিল্ড পূরণ করুন');
      return;
    }

    try {
      const response = await axios.post(
        'http://YOUR_SERVER_IP:5000/api/pages/create',
        {
          userId: userData.userId,
          name: newPage.name,
          date: newPage.date,
          rate: parseFloat(newPage.rate),
        }
      );

      if (response.data.success) {
        Alert.alert('সফল', 'পৃষ্ঠা তৈরি হয়েছে');
        setNewPage({
          name: '',
          date: new Date().toISOString().split('T')[0],
          rate: '',
        });
        setShowNewPageForm(false);
        loadPages();
      }
    } catch (error) {
      Alert.alert('ত্রুটি', 'পৃষ্ঠা তৈরি করতে ব্যর্থ');
    }
  };

  const handleLogout = () => {
    Alert.alert('লগআউট', 'আপনি কি নিশ্চিত?', [
      { text: 'বাতিল', onPress: () => {} },
      {
        text: 'লগআউট করুন',
        onPress: onLogout,
        style: 'destructive',
      },
    ]);
  };

  const renderPageCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pageCard}
      onPress={() =>
        navigation.navigate('PageDetail', { pageId: item.id, pageName: item.name })
      }
    >
      <View style={styles.pageCardHeader}>
        <Text style={styles.pageCardTitle}>{item.name}</Text>
        {item.is_closed === 1 && (
          <View style={styles.closedBadge}>
            <Text style={styles.closedBadgeText}>বন্ধ</Text>
          </View>
        )}
      </View>
      <Text style={styles.pageCardInfo}>
        📅 {new Date(item.date).toLocaleDateString('bn-BD')}
      </Text>
      <Text style={styles.pageCardInfo}>💱 রেট: {item.rate}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>স্বাগতম</Text>
          <Text style={styles.userName}>{userData?.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Icon name="logout" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="পৃষ্ঠা খুঁজুন..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#ccc"
        />
      </View>

      {/* New Page Button */}
      {!showNewPageForm && (
        <TouchableOpacity
          style={styles.createPageButton}
          onPress={() => setShowNewPageForm(true)}
        >
          <Icon name="plus" size={20} color="white" />
          <Text style={styles.createPageButtonText}>নতুন পৃষ্ঠা তৈরি করুন</Text>
        </TouchableOpacity>
      )}

      {/* New Page Form */}
      {showNewPageForm && (
        <View style={styles.newPageForm}>
          <Text style={styles.formTitle}>নতুন পৃষ্ঠা তৈরি করুন</Text>
          <TextInput
            style={styles.formInput}
            placeholder="পৃষ্ঠার নাম"
            value={newPage.name}
            onChangeText={(text) => setNewPage({ ...newPage, name: text })}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.formInput}
            placeholder="তারিখ (YYYY-MM-DD)"
            value={newPage.date}
            onChangeText={(text) => setNewPage({ ...newPage, date: text })}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.formInput}
            placeholder="রেট (যেমন: 20.5)"
            value={newPage.rate}
            onChangeText={(text) => setNewPage({ ...newPage, rate: text })}
            keyboardType="decimal-pad"
            placeholderTextColor="#ccc"
          />
          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.formButton, styles.submitButton]}
              onPress={handleCreatePage}
            >
              <Text style={styles.submitButtonText}>তৈরি করুন</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setShowNewPageForm(false)}
            >
              <Text style={styles.cancelButtonText}>বাতিল</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Pages List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : filteredPages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="file-document-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>কোনো পৃষ্ঠা নেই</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPages}
          renderItem={renderPageCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  createPageButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    marginHorizontal: 15,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  newPageForm: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 15,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 13,
    color: '#333',
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  formButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#667eea',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  pageCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  closedBadge: {
    backgroundColor: '#fee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  closedBadgeText: {
    color: '#c33',
    fontSize: 12,
    fontWeight: '600',
  },
  pageCardInfo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    marginTop: 10,
  },
});

export default HomeScreen;
