import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/source/app/AuthProvider";
import Header from '@/components/auth/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/source/shared/utils/apiClient';
import { Course } from '@/source/core/entities';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CourseProgress } from '@/source/core/entities/courseProgress';
import { LanguageContext } from "@/source/app/LanguageProvider";

export default function HomeScreen() {
  const { user, refetch } = useContext(AuthContext)
  const { t } = useContext(LanguageContext)
  const { data } = useQuery({
    queryKey: ["get-courses"],
    queryFn: () => {
      return client.get<Course[]>("course/all").then(r => r.data)
    },
  })

  const levelsDescriptions: Record<("A1" | "A2" | "B1" | "B2"), string> = {
    "A1": t("course.levelsDescriptions.A1"),
    "A2": t("course.levelsDescriptions.A2"),
    "B1": t("course.levelsDescriptions.B1"),
    "B2": t("course.levelsDescriptions.B2")
  }

  const { data: courseProgresses } = useQuery({
    queryKey: ["get-courses-progresses"],
    queryFn: () => client.get<CourseProgress[]>("course/progress").then(r => r.data)
  })

  useEffect(() => {
    refetch()
  }, [])

  if (!user || !data || !courseProgresses) return null;

  const progresses: Record<string, number> = data.reduce((acc, obj) => {
    acc[obj.course_id] = 0;
    return acc;
  }, {} as Record<string, number>);

  data.forEach(c => {
    const courseProgress = courseProgresses.find(cp => cp.course.course_id === c.course_id)
    if (courseProgress) {
      progresses[c.course_id] = courseProgress.points
    }
  })

  return (
    <SafeAreaView>
      <Header />
      <ScrollView contentContainerStyle={Platform.OS === 'web' ? styles.cardsContainerWeb : styles.cardsContainerMobile}>
        {data.map(course => {
          const isAvailable = !!user.courses.find(c => c.course_id === course.course_id)
          const handler = () => {
            router.push(`/auth/course/${course.course_id}`)
          }
          return <View
            style={styles.card}
            key={course.course_id}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLevel}>{course.level}</Text>
              <Text style={styles.cardSubtitle}>
                {t('level')}: <Text style={styles.boldText}>{levelsDescriptions[course.level]}</Text>
              </Text>
              <View style={styles.divider}></View>
              <Text style={styles.cardSubtitle}>
                {t('progress')} <Text style={styles.boldText}>{progresses[course.course_id]}%</Text>
              </Text>
            </View>
            <View>
              <View style={styles.cardInfo}>
                <Ionicons name={'time-outline'} size={24} color={'#6c38cc'} />
                <Text style={styles.infoText}>{String(course.lessons)} {t('lessons')}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Ionicons name={'newspaper-outline'} size={24} color={'#6c38cc'} />
                <Text style={styles.infoText}>{String(course.tests)} {t('tests')}</Text>
              </View>
            </View>
            <TouchableOpacity
              disabled={!isAvailable}
              onPress={handler}
              style={{
                ...styles.button,
                backgroundColor: isAvailable ? "#6C38CC" : "#645E71",
              }}>
              <Text style={styles.buttonText}>
                {isAvailable ? t('access.granted') : t('access.denied')}
              </Text>
            </TouchableOpacity>
          </View>
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardsContainerMobile: {
    flexDirection: "column",
    padding: 16,
  },
  cardsContainerWeb: {
    display : "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 16,
    gap : 20
  },
  card: {
    padding: 16,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EDEEF0",
    borderRadius: 12,
    minHeight: 120,
    marginBottom: 16,
    flex: Platform.OS === "web" ? 0 : 1,
    minWidth: Platform.OS === 'web' ? "30%" : "100%",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardLevel: {
    fontFamily: "IBMPlexSans-Bold",
    color: "#151324",
    fontSize: 30,
  },
  cardSubtitle: {
    color: "#464752",
    fontFamily: "IBMPlexSans-Regular",
    fontSize: 13,
  },
  boldText: {
    color: "#151324",
    fontFamily: "IBMPlexSans-SemiBold",
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#EDEEF0",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  infoText: {
    fontFamily: "IBMPlexSans-SemiBold",
    fontSize: 14,
    color: "#151324",
  },
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginTop: 10,
    // width : Platform.OS === "web" ? "50%" : "100%",
  },
  buttonText: {
    fontFamily: "IBMPlexSans-Bold",
    color: "#FFF",
  },
});