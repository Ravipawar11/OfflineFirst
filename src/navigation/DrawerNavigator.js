import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainTabs } from './MainTabs';
import { colors, fonts, sizes } from '../theme';
import { AuthContext } from '../context/AuthContext';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import HelpScreen from '../screens/drawer/HelpScreen';

const Drawer = createDrawerNavigator();

/**
 * Custom Drawer Content
 */
const CustomDrawerContent = (props) => {
  const { logout } = useContext(AuthContext);

  // Only real drawer items here. Tabs (Home, Profile, Settings)
  // are reached through the MainTabs screen, not the drawer.
  const menuItems = [
    { label: 'Home', icon: 'home-outline', route: 'MainTabs' },
    { label: 'Profile', icon: 'person-outline',route: 'Profile'  },
    { label: 'Help', icon: 'help-circle-outline', route: 'Help' },
  ];

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => props.navigation.navigate(item.route)}
          >
            <Icon name={item.icon} size={22} color={colors.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          props.navigation.closeDrawer();
          logout?.();
        }}
      >
        <Icon name="log-out-outline" size={22} color={colors.danger || '#e53935'} />
        <Text style={[styles.menuLabel, { color: colors.danger || '#e53935' }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Drawer Navigator
 */
export const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveTintColor: colors.primary,
      drawerInactiveTintColor: colors.textMuted,
      drawerLabelStyle: {
        fontFamily: fonts.family.medium,
        fontSize: sizes.sm,
        marginLeft: -10,
      },
      drawerStyle: {
        width: 280,
      },
    }}
  >
    <Drawer.Screen name="MainTabs" component={MainTabs} />
    <Drawer.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    headerShown: true,
    title: 'Profile',
    headerStyle: { backgroundColor: colors.primary },
    headerTintColor: '#fff',
  }}
/>
    <Drawer.Screen name="Help" component={HelpScreen} options={{ 
        headerShown: true,
        title: 'Help & Support',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
      }} />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontFamily: fonts.family.semibold,
    fontSize: sizes.md,
    color: '#fff',
  },
  userEmail: {
    fontFamily: fonts.family.regular,
    fontSize: sizes.xs,
    color: '#ffffffcc',
    marginTop: 2,
  },
  menu: {
    flex: 1,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuLabel: {
    fontFamily: fonts.family.medium,
    fontSize: sizes.sm,
    marginLeft: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});