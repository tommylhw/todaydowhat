import { ScrollView, StyleSheet, Text, View } from "react-native";

const DUMMY_EVENTS = [
  {
    date: "19/08/2025",
    events: [
      { time: "10:00", title: "Meeting with Team" },
      { time: "13:00", title: "Lunch with Client" },
    ],
  },
  {
    date: "20/08/2025",
    events: [],
  },
  {
    date: "21/08/2025",
    events: [
      { time: "11:00", title: "Code Review" },
      { time: "15:00", title: "Project Update" },
      { time: "17:00", title: "Team Sync" },
    ],
  },
  {
    date: "22/08/2025",
    events: [{ time: "14:00", title: "Client Call" }],
  },
  {
    date: "23/08/2025",
    events: [{ time: "16:00", title: "Team Retrospective" }],
  },
];

const HomeUpperSection = () => {
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });

  // Format date for display (e.g., "Mon 19")
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
    });
  };

  const formatWeekday = (date: Date) => {
    const today = new Date();
    return date.getDate() == today.getDate()
      ? "Today"
      : date.toLocaleDateString("en-US", {
          weekday: "short",
        });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // console.log("Week Dates:", week.map(formatDate));
  // console.log("Today:", formatDate(today));
  // console.log("Is today:", isToday(today));
  // console.log("Formatted Weekday:", week.map(formatWeekday));

  return (
    <View style={{ height: 220 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {week.map((date, index) => (
          <View
            key={index}
            style={[
              styles.dateContainer,
              { backgroundColor: isToday(date) ? "#36328C" : "#FFDF76" },
            ]}
          >
            <View style={styles.dayContainer}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: isToday(date) ? "#fff" : "#36328C",
                }}
              >
                {formatDay(date)}
              </Text>
              <Text
                style={{
                  color: isToday(date) ? "#fff" : "#36328C",
                  paddingBlockEnd: 2,
                }}
              >
                {formatWeekday(date)}
              </Text>
            </View>
            <View>
              {DUMMY_EVENTS.filter(
                (event) =>
                  event.date ===
                  date.toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
              ).map((event, eventIndex) => (
                <View key={eventIndex}>
                  {event.events.map((e, eIndex) => (
                    <View key={eIndex}>
                      <Text
                        style={{
                          color: isToday(date) ? "#fff" : "#36328C",
                          fontSize: 16,
                        }}
                      >
                        {e.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#ebebeb" }}>{e.time}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    width: 170,
    padding: 16,
    height: "100%",
    marginInlineStart: 12,
    borderRadius: 10,
  },
  dayContainer: { flexDirection: "row", alignItems: "flex-end", gap: 5, marginBlockEnd: 4 },
});

export default HomeUpperSection;
