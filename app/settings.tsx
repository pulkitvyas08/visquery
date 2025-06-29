import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft,
  Settings, 
  Database, 
  Zap, 
  Shield, 
  Download, 
  Trash2,
  Info,
  ExternalLink,
  Bell,
  ChevronRight
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [storageUsed, setStorageUsed] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const settingsSections = [
    {
      title: 'AI Processing',
      items: [
        {
          icon: Zap,
          title: 'Auto-process new images',
          subtitle: 'Automatically generate captions and tags',
          type: 'switch',
          value: autoProcessing,
          onToggle: setAutoProcessing,
        },
        {
          icon: Database,
          title: 'Processing Quality',
          subtitle: 'High quality (slower, better results)',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Processing quality settings will be available soon.'),
        },
      ],
    },
    {
      title: 'Storage & Data',
      items: [
        {
          icon: Database,
          title: 'Storage Usage',
          subtitle: `${storageUsed} MB used • ${totalImages} images`,
          type: 'info',
        },
        {
          icon: Download,
          title: 'Backup Gallery',
          subtitle: 'Export your images and metadata',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Backup functionality will be available soon.'),
        },
        {
          icon: Trash2,
          title: 'Clear Cache',
          subtitle: 'Remove temporary files',
          type: 'navigation',
          onPress: handleClearCache,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          title: 'Notifications',
          subtitle: 'Processing complete alerts',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: Info,
          title: 'App Version',
          subtitle: '1.0.0',
          type: 'info',
        },
        {
          icon: ExternalLink,
          title: 'Privacy Policy',
          subtitle: 'How we handle your data',
          type: 'navigation',
          onPress: () => Alert.alert('Privacy Policy', 'Your images are processed locally and never leave your device unless you choose to back them up.'),
        },
        {
          icon: Shield,
          title: 'Terms of Service',
          subtitle: 'Usage terms and conditions',
          type: 'navigation',
          onPress: () => Alert.alert('Terms of Service', 'Please read our terms of service on our website.'),
        },
      ],
    },
  ];

  async function handleClearCache() {
    Alert.alert(
      'Clear Cache',
      'This will remove temporary files and may free up storage space. Your images and data will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('image-cache');
              Alert.alert('Success', 'Cache cleared successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache.');
            }
          }
        },
      ]
    );
  }

  const renderSettingItem = (item: any, index: number) => {
    const IconComponent = item.icon;
    
    return (
      <Animated.View
        key={index}
        entering={FadeInDown.delay(index * 50)}
        style={[styles.settingItem, index === 0 && styles.firstItem]}
      >
        <TouchableOpacity
          style={styles.settingContent}
          onPress={item.onPress}
          disabled={item.type === 'info' || item.type === 'switch'}
        >
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <IconComponent size={20} color="#1976D2" strokeWidth={2} />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
          
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#E0E0E0', true: '#1976D2' }}
              thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            />
          )}
          
          {item.type === 'navigation' && (
            <ChevronRight size={16} color="#9E9E9E" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Settings Icon */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <Settings size={32} color="#1976D2" strokeWidth={2} />
            </View>
            <Text style={styles.subtitle}>
              Customize your AI gallery experience
            </Text>
          </Animated.View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <Animated.View
              key={sectionIndex}
              entering={FadeInDown.delay((sectionIndex + 1) * 100)}
              style={styles.section}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
              </View>
            </Animated.View>
          ))}

          {/* Footer */}
          <Animated.View entering={FadeInDown.delay(600)} style={styles.footer}>
            <Text style={styles.footerText}>
              AI Gallery • Made with ❤️ for photo enthusiasts
            </Text>
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
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  iconSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#757575',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  firstItem: {
    borderTopWidth: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212121',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9E9E9E',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 50,
  },
});