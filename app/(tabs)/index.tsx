import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function HomeScreen() {
  // Animated value to track scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  // Animated value to control upper container height
  const upperHeight = useRef(new Animated.Value(300)).current; // Start at 300px
  // Reference to ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  // State to track collapsed/expanded state
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State to track if lower container is at the top
  const [isLowerAtTop, setIsLowerAtTop] = useState(true);
  // State to track if a new touch gesture has started
  const [isNewTouch, setIsNewTouch] = useState(false);
  // State to track if first scroll-down action has occurred
  const [hasScrolledDown, setHasScrolledDown] = useState(false);
  // State to control ScrollView scrolling
  const [scrollEnabled, setScrollEnabled] = useState(true);
  // Track previous scroll position to detect scroll direction
  const prevScrollY = useRef(0);

  // Threshold for triggering collapse
  const SCROLL_THRESHOLD = 100;
  const DURATION = 100; // Duration for expand/collapse animations

  // Effect to handle scroll position changes
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      // Detect scroll direction
      const isScrollingUp = value < prevScrollY.current;
      const isScrollingDown = value > prevScrollY.current;

      // Update lower container top state
      if (value <= 0 && !isLowerAtTop) {
        setIsLowerAtTop(true);
        setHasScrolledDown(false); // Reset on reaching top
      } else if (value > 0 && isLowerAtTop) {
        setIsLowerAtTop(false);
        setIsNewTouch(false); // Reset new touch when scrolling down
      }

      // Collapse on first scroll-down when expanded and at top
      if (
        !isCollapsed &&
        isNewTouch &&
        isScrollingDown &&
        !hasScrolledDown &&
        isLowerAtTop
      ) {
        Animated.timing(upperHeight, {
          toValue: 100,
          duration: DURATION, // Duration of the animation
          easing: Easing.inOut(Easing.ease), // Smooth ease-in-out transition
          useNativeDriver: false, // Required for height animation
        }).start(() => {
          setHasScrolledDown(true); // Mark first scroll-down complete
          setScrollEnabled(true); // Re-enable scrolling after collapse
          // Reset scrollY to 0 to keep lower container at top
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: false });
          }
        });
        setIsCollapsed(true);
        setIsNewTouch(false); // Reset new touch
        setScrollEnabled(false); // Disable scrolling during collapse
      }
      // Collapse on scroll past threshold (for subsequent scrolls)
      else if (value > SCROLL_THRESHOLD && !isCollapsed) {
        Animated.timing(upperHeight, {
          toValue: 100,
          duration: DURATION, // Duration of the animation
          easing: Easing.inOut(Easing.ease), // Smooth ease-in-out transition
          useNativeDriver: false, // Required for height animation
        }).start();
        setIsCollapsed(true);
        setIsNewTouch(false); // Reset new touch
        setHasScrolledDown(true); // Ensure scrolling is enabled for next actions
        setScrollEnabled(true);
      }
      // Expand when lower container is at top, new touch gesture is active, scrolling up, and was previously collapsed
      else if (
        isLowerAtTop &&
        isNewTouch &&
        isScrollingUp &&
        isCollapsed &&
        value <= 0
      ) {
        Animated.timing(upperHeight, {
          toValue: 300,
          duration: DURATION, // Duration of the animation
          easing: Easing.inOut(Easing.ease), // Smooth ease-in-out transition
          useNativeDriver: false, // Required for height animation
        }).start();
        setIsCollapsed(false);
        setIsNewTouch(false); // Reset to wait for next touch gesture
        setHasScrolledDown(false); // Reset for next collapse
        setScrollEnabled(true);
      }

      // Update previous scroll position
      prevScrollY.current = value;
    });

    // Cleanup listener on unmount
    return () => scrollY.removeListener(listener);
  }, [scrollY, isCollapsed, isLowerAtTop, isNewTouch, hasScrolledDown]);

  // Handle touch start to detect new gesture
  const handleTouchStart = () => {
    if (isLowerAtTop && isCollapsed) {
      setIsNewTouch(true); // For expansion
    } else if (isLowerAtTop && !isCollapsed && !hasScrolledDown) {
      setIsNewTouch(true); // For first scroll-down collapse
    }
  };

  // Handle touch end to reset new touch state
  const handleTouchEnd = () => {
    setIsNewTouch(false);
  };

  // Handle scroll event to update scrollY
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false } // useNativeDriver: true not supported for layout properties
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/profile/user-1.jpg")}
            style={styles.profileImage}
            contentFit="cover"
            placeholder="blurhash"
            transition={1000}
          />
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Good Morning,</Text>
            <Text style={styles.headerSubTitle}>Tommy Wong</Text>
          </View>
        </View>
        <Text style={styles.heading}>Upcoming Schedule</Text>
        <Animated.View style={[styles.upperContainer, { height: upperHeight }]}>
          <View style={styles.eventContainer}>
            <View style={styles.upperBox}></View>
            <View style={styles.upperBox}></View>
          </View>
        </Animated.View>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          scrollEnabled={scrollEnabled}
          scrollEventThrottle={16} // Update every 16ms for smooth scroll detection
          stickyHeaderIndices={[]} // No sticky indices since upper container is outside ScrollView
        >
          <View style={styles.lowerContainer}>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
            <View style={styles.lowerBox}></View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  body: { flex: 1, paddingHorizontal: 20, backgroundColor: "#fff", fontFamily: "Poppins" },
  scrollView: {
    // flex: 1,
  },
  upperContainer: {
    backgroundColor: "#fff",
    maxHeight: 300,
    gap: 8,
    zIndex: 1,
    borderWidth: 1, // position: 'absolute', top: 0, left: 0, right: 0,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: "#F9F9F9",
    borderRadius: "100%",
    marginRight: 16,
  },
  headerTitleContainer: {
    flexDirection: "column",
    gap: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#36328C",
    letterSpacing: 0.5,
  },
  headerSubTitle: {
    fontSize: 18,
    color: "#51515F",
  },
  eventContainer: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    height: "100%",
  },
  heading: {
    color: "#0E0C36",
    fontSize: 18,
    fontWeight: 800,
    paddingVertical: 10,
    letterSpacing: 0.5,
  },
  upperBox: {
    // height: "100%",
    width: "30%",
    backgroundColor: "#36328C",
  },
  lowerContainer: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  lowerBox: {
    height: 100,
    width: "100%",
    borderWidth: 1,
    backgroundColor: "#FFDF76",
    marginBottom: 8,
  },
});
