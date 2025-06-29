import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, User, Camera, CreditCard as Edit3, Mail, Phone, MapPin, Calendar, Settings, Share, Download, Heart, Grid3x3, ChartBar as BarChart3 } from 'lucide-react-native';
import { useImageGallery } from '@/hooks/useImageGallery';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');
  
  const { images, albums } = useImageGallery();
  
  const totalImages = images.length;
  const totalAlbums = albums.length;
  const totalSize = Math.round(images.reduce((acc, img) => acc + img.size, 0) / (1024 * 1024));
  const recentImages = images.slice(0, 6);

  const stats = [
    { label: 'Photos', value: totalImages, icon: Camera },
    { label: 'Albums', value: totalAlbums, icon: Grid3x3 },
    { label: 'Storage', value: `${totalSize} MB`, icon: BarChart3 },
  ];

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#212121" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Edit3 size={20} color="#1976D2" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={48} color="#1976D2" strokeWidth={1.5} />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              {isEditing ? (
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              ) : (
                <Text style={styles.name}>{name}</Text>
              )}
              <Text style={styles.memberSince}>Member since January 2024</Text>
            </View>
          </Animated.View>

          {/* Stats */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statsSection}>
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <View key={index} style={styles.statItem}>
                    <View style={styles.statIcon}>
                      <IconComponent size={20} color="#1976D2" strokeWidth={2} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          {/* Contact Info */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.sectionContent}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Mail size={20} color="#757575" strokeWidth={2} />
                </View>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                    keyboardType="email-address"
                  />
                ) : (
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                  </View>
                )}
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Phone size={20} color="#757575" strokeWidth={2} />
                </View>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>{phone}</Text>
                  </View>
                )}
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <MapPin size={20} color="#757575" strokeWidth={2} />
                </View>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Enter location"
                  />
                ) : (
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{location}</Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Recent Photos */}
          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Photos</Text>
              <TouchableOpacity onPress={() => router.push('/all-images')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.photosGrid}>
              {recentImages.map((image, index) => (
                <TouchableOpacity key={image.id} style={styles.photoItem}>
                  <Image source={{ uri: image.uri }} style={styles.photo} />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}>
                  <Share size={20} color="#1976D2" strokeWidth={2} />
                </View>
                <Text style={styles.actionText}>Share Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.actionIcon}>
                  <Download size={20} color="#1976D2" strokeWidth={2} />
                </View>
                <Text style={styles.actionText}>Export Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => router.push('/settings')}
              >
                <View style={styles.actionIcon}>
                  <Settings size={20} color="#1976D2" strokeWidth={2} />
                </View>
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
  },
  editButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
    borderBottomWidth: 1,
    borderBottomColor: '#1976D2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 200,
    textAlign: 'center',
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: '#212121',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1976D2',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#757575',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
  },
  infoInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
    borderBottomWidth: 1,
    borderBottomColor: '#1976D2',
    paddingVertical: 4,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: (320 - 40 - 16) / 3,
    height: (320 - 40 - 16) / 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  bottomPadding: {
    height: 50,
  },
});