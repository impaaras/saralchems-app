import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    marginTop: -30,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginRight: 15,
  },
  profileButton: {
    position: 'relative',
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#d3d3d3',
  },

  profileContainer: {
    backgroundColor: 'white',
    marginTop: -50,
    borderRadius: 20,
    paddingBottom: 50,
    overflow: 'hidden',
    shadowColor: '#F4F9FF',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 100,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d3d3d3',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#001',
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#011',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#001',
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#cad3e0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});

export default styles;
