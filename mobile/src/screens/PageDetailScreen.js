import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  Vibration,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Sound from 'react-native-sound';

const PageDetailScreen = ({ navigation, route, userData }) => {
  const { pageId, pageName } = route.params;
  const [page, setPage] = useState(null);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDataModal, setShowDataModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    remark: '',
    bdNumber: '',
    dirham: '',
    bdt: '',
    uaeNumber: '',
  });
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    loadPageData();
  }, [pageId]);

  useEffect(() => {
    filterRows();
  }, [searchQuery, rows]);

  useEffect(() => {
    loadDashboard();
  }, [rows]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://YOUR_SERVER_IP:5000/api/pages/${pageId}`
      );
      setPage(response.data.page);
      setRows(response.data.rows || []);
    } catch (error) {
      console.error('পৃষ্ঠা ডেটা লোড করতে ত্রুটি:', error);
      Alert.alert('ত্রুটি', 'পৃষ্ঠা ডেটা লোড করতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const response = await axios.get(
        `http://YOUR_SERVER_IP:5000/api/pages/${pageId}/dashboard`
      );
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error('ড্যাশবোর্ড লোড করতে ত্রুটি:', error);
    }
  };

  const filterRows = () => {
    if (!searchQuery.trim()) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter(
      (row) =>
        (row.remark && row.remark.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (row.bd_number && row.bd_number.includes(searchQuery)) ||
        (row.uae_number && row.uae_number.includes(searchQuery))
    );
    setFilteredRows(filtered);
  };

  const playSound = (type = 'beep') => {
    const frequency = type === 'beep' ? 1000 : 800;
    // Note: Sound implementation would require react-native-sound setup
    // For now, we'll use Vibration API
    Vibration.vibrate(100);
  };

  const handleAddData = async () => {
    if (!formData.remark.trim()) {
      Alert.alert('ত্রুটি', 'রিমার্ক প্রয়োজন');
      return;
    }

    try {
      const response = await axios.post(
        'http://YOUR_SERVER_IP:5000/api/data/add',
        {
          pageId,
          remark: formData.remark,
          bdNumber: formData.bdNumber,
          dirham: parseFloat(formData.dirham) || 0,
          bdt: parseFloat(formData.bdt) || 0,
          uaeNumber: formData.uaeNumber,
        }
      );

      if (response.data.success) {
        Alert.alert('সফল', 'ডেটা যোগ করা হয়েছে');
        setFormData({
          remark: '',
          bdNumber: '',
          dirham: '',
          bdt: '',
          uaeNumber: '',
        });
        setShowFormModal(false);
        loadPageData();
      }
    } catch (error) {
      Alert.alert('ত্রুটি', 'ডেটা যোগ করতে ব্যর্থ');
    }
  };

  const handleVerifyRow = async (rowId) => {
    try {
      await axios.put(
        `http://YOUR_SERVER_IP:5000/api/data/${rowId}/verify`
      );
      playSound('success');
      Alert.alert('সফল', 'ডেটা যাচাই করা হয়েছে');
      setShowDataModal(false);
      loadPageData();
    } catch (error) {
      Alert.alert('ত্রুটি', 'যাচাই করতে ব্যর্থ');
    }
  };

  const handleCopyBDNumber = () => {
    if (selectedRow?.bd_number) {
      const numberToCopy = selectedRow.bd_number.replace(/-/g, '');
      // Copy to clipboard logic would go here
      playSound('beep');
      Alert.alert('সফল', 'নম্বর কপি করা হয়েছে');
    }
  };

  const handleCopyForWT = () => {
    if (selectedRow?.bd_number) {
      const numberToCopy = selectedRow.bd_number.replace(/-/g, '');
      const text = `${numberToCopy}===${selectedRow.bdt}\n*নগদ*`;
      playSound('beep');
      Alert.alert('সফল', 'WT ফরম্যাটে কপি করা হয়েছে');
    }
  };

  const handleClosePage = async () => {
    if (!pinInput) {
      Alert.alert('ত্রুটি', 'PIN প্রয়োজন');
      return;
    }

    try {
      await axios.put(
        `http://YOUR_SERVER_IP:5000/api/pages/${pageId}/close`
      );
      Alert.alert('সফল', 'পৃষ্ঠা বন্ধ করা হয়েছে');
      setShowCloseModal(false);
      setPinInput('');
      loadPageData();
    } catch (error) {
      Alert.alert('ত্রুটি', 'পৃষ্ঠা বন্ধ করতে ব্যর্থ');
    }
  };

  const renderDataRow = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dataRow,
        item.color === 'green' && styles.rowGreen,
        item.color === 'red' && styles.rowRed,
        item.color === 'pink' && styles.rowPink,
      ]}
      onPress={() => {
        setSelectedRow(item);
        setShowDataModal(true);
      }}
    >
      <View style={styles.rowContent}>
        <Text style={styles.rowRemark}>{item.remark}</Text>
        <Text style={styles.rowBDNumber}>
          {item.bd_number ? `${item.bd_number.slice(0, 5)}-${item.bd_number.slice(5)}` : '-'}
        </Text>
        <View style={styles.rowAmounts}>
          <Text style={styles.rowDirham}>{item.dirham || '-'}</Text>
          <Text style={styles.rowBDT}>{item.bdt || '-'}</Text>
        </View>
      </View>
      <View style={styles.rowStatus}>
        {item.is_verified === 1 ? (
          <Icon name="check-circle" size={24} color="#1b5e20" />
        ) : (
          <Icon name="clock-outline" size={24} color="#ff9800" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.pageTitle}>{pageName}</Text>
          <Text style={styles.pageInfo}>
            {page?.date} | রেট: {page?.rate}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowCloseModal(true)}>
          <Icon name="lock" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="অনুসন্ধান করুন..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#ccc"
        />
      </View>

      {/* Dashboard */}
      {dashboard && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dashboardContainer}
        >
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>মোট এন্ট্রি</Text>
            <Text style={styles.dashboardValue}>{dashboard.totalRows}</Text>
          </View>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>যাচাইকৃত</Text>
            <Text style={styles.dashboardValue}>{dashboard.verifiedCount}</Text>
          </View>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>বাকি</Text>
            <Text style={styles.dashboardValue}>{dashboard.pendingCount}</Text>
          </View>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>মোট দিরহাম</Text>
            <Text style={[styles.dashboardValue, { color: '#003d82' }]}>
              {parseFloat(dashboard.totalDirham).toFixed(2)}
            </Text>
          </View>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>মোট টাকা</Text>
            <Text style={[styles.dashboardValue, { color: '#1b5e20' }]}>
              {parseFloat(dashboard.totalBDT).toFixed(2)}
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Data List */}
      {filteredRows.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="database-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>কোনো ডেটা নেই</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRows}
          renderItem={renderDataRow}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Add Data Button */}
      {page?.is_closed === 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowFormModal(true)}
        >
          <Icon name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Add Data Modal */}
      <Modal
        visible={showFormModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>নতুন ডেটা যোগ করুন</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="রিমার্ক"
              value={formData.remark}
              onChangeText={(text) => setFormData({ ...formData, remark: text })}
              placeholderTextColor="#ccc"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="বাংলাদেশ নম্বর"
              value={formData.bdNumber}
              onChangeText={(text) => setFormData({ ...formData, bdNumber: text })}
              keyboardType="numeric"
              placeholderTextColor="#ccc"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="দিরহাম"
              value={formData.dirham}
              onChangeText={(text) => setFormData({ ...formData, dirham: text })}
              keyboardType="decimal-pad"
              placeholderTextColor="#ccc"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="বাংলা টাকা"
              value={formData.bdt}
              onChangeText={(text) => setFormData({ ...formData, bdt: text })}
              keyboardType="decimal-pad"
              placeholderTextColor="#ccc"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddData}
              >
                <Text style={styles.submitButtonText}>যোগ করুন</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowFormModal(false)}
              >
                <Text style={styles.cancelButtonText}>বাতিল</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Data Detail Modal */}
      {selectedRow && (
        <Modal
          visible={showDataModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.dataModalContent}>
              <TouchableOpacity
                style={styles.closeModalBtn}
                onPress={() => setShowDataModal(false)}
              >
                <Icon name="close" size={24} color="#999" />
              </TouchableOpacity>

              <View style={styles.dataDisplay}>
                <Text style={styles.dataLabel}>রিমার্ক</Text>
                <Text style={styles.dataRemarkValue}>{selectedRow.remark}</Text>

                <Text style={styles.dataLabel}>বাংলাদেশ নম্বর</Text>
                <Text style={styles.dataBDNumberValue}>
                  {selectedRow.bd_number ? `${selectedRow.bd_number.slice(0, 5)}-${selectedRow.bd_number.slice(5)}` : '-'}
                </Text>

                <View style={styles.amountsContainer}>
                  <View>
                    <Text style={styles.dataLabel}>দিরহাম</Text>
                    <Text style={styles.dataDirhaamValue}>{selectedRow.dirham || '-'}</Text>
                  </View>
                  <View>
                    <Text style={styles.dataLabel}>বাংলা টাকা</Text>
                    <Text style={styles.dataBDTValue}>{selectedRow.bdt || '-'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.dataActions}>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyForWT}
                >
                  <Icon name="content-copy" size={18} color="#667eea" />
                  <Text style={styles.copyButtonText}>WT কপি</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={handleCopyBDNumber}
                >
                  <Icon name="phone" size={18} color="#667eea" />
                  <Text style={styles.copyButtonText}>নম্বর কপি</Text>
                </TouchableOpacity>
              </View>

              {selectedRow.is_verified === 0 && (
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => handleVerifyRow(selectedRow.id)}
                >
                  <Icon name="check-circle" size={18} color="white" />
                  <Text style={styles.verifyButtonText}>যাচাই করুন</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Close Page Modal */}
      <Modal
        visible={showCloseModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {page?.is_closed === 1 ? 'পৃষ্ঠা খুলুন' : 'পৃষ্ঠা বন্ধ করুন'}
            </Text>
            <Text style={styles.modalDescription}>আপনার PIN লিখুন:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="0000"
              value={pinInput}
              onChangeText={setPinInput}
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#ccc"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleClosePage}
              >
                <Text style={styles.submitButtonText}>
                  {page?.is_closed === 1 ? 'খুলুন' : 'বন্ধ করুন'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCloseModal(false);
                  setPinInput('');
                }}
              >
                <Text style={styles.cancelButtonText}>বাতিল</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pageTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageInfo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
  },
  dashboardContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexGrow: 0,
  },
  dashboardCard: {
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  dashboardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 5,
  },
  dashboardValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  dataRow: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowGreen: {
    backgroundColor: '#f0fff4',
  },
  rowRed: {
    backgroundColor: '#fff5f5',
  },
  rowPink: {
    backgroundColor: '#ffe0ec',
  },
  rowContent: {
    flex: 1,
  },
  rowRemark: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  rowBDNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003d82',
    marginBottom: 4,
  },
  rowAmounts: {
    flexDirection: 'row',
    gap: 15,
  },
  rowDirham: {
    fontSize: 11,
    color: '#000',
  },
  rowBDT: {
    fontSize: 11,
    color: '#1b5e20',
    fontWeight: '600',
  },
  rowStatus: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 13,
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '50%',
  },
  dataModalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
  },
  closeModalBtn: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 13,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#667eea',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  dataDisplay: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  dataLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dataRemarkValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 12,
  },
  dataBDNumberValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003d82',
    marginBottom: 12,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataDirhaamValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  dataBDTValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  dataActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  copyButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  copyButtonText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#1b5e20',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default PageDetailScreen;
