import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';


export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View>
        <ScrollView>
          <View style={styles.upperContainer}>

          </View>
          <View style={styles.lowerContainer}>

          </View>
        </ScrollView>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  upperContainer: {
    
  },
  lowerContainer: {}
});
