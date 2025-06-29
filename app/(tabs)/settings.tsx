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
import { 
  Settings, 
  Database, 
  Zap, 
  Shield, 
  Download, 
  Trash2,
  Info,
  ExternalLink,
  Moon,
  Bell
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
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
        {
          icon: Moon,
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          type: 'switch',
          value: darkMode,
          onToggle: setDarkMode,
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
              // Clear any cached data
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
        style={styles.settingItem}
      >
        <TouchableOpacity
          style={styles.settingContent}
          onPress={item.onPress}
          disabled={item.type === 'info' || item.type === 'switch'}
        >
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <IconComponent size={20} color="#3B82F6" strokeWidth={2} />
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
              trackColor={{ false: '#374151', true: '#3B82F6' }}
              thumbColor={item.value ? '#FFFFFF' : '#9CA3AF'}
            />
          )}
          
          {item.type === 'navigation' && (
            <ExternalLink size={16} color="#6B7280" strokeWidth={2} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
            <Settings size={32} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.title}>Settings</Text>
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

          {/* Bottom Padding for Tab Bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
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
    borderRadius: 10,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 120,
  },
});