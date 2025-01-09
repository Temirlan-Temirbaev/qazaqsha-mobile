import Header from "@/components/auth/Header";
import { Course } from "@/source/core/entities";
import { client } from "@/source/shared/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import {Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext, useState } from "react";
import { CourseProgress } from "@/source/core/entities/courseProgress";
import { LanguageContext } from "@/source/app/LanguageProvider";

const LessonCard = ({ lesson, index, t }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Ionicons name={'book-sharp'} size={24} color={'#6c38cc'} />
      <Text style={styles.cardTitle}>{t("course.lesson", { index: index + 1 })}</Text>
    </View>
    <Text style={styles.cardSubtitle}>{lesson.title}</Text>
    <TouchableOpacity
      onPress={() => router.push(`/auth/lesson/${lesson.lesson_id}`)}
      style={styles.cardButton}>
      <MaterialIcons name="play-lesson" size={24} color="#fff" />
      <Text style={styles.cardButtonText}>{t("course.startLesson")}</Text>
    </TouchableOpacity>
  </View>
);

const TestCard = ({ test, index, t }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Ionicons name={'newspaper-outline'} size={24} color={'#6c38cc'} />
      <Text style={styles.cardTitle}>{t("course.test", { index: index + 1 })}</Text>
    </View>
    <Text style={styles.cardSubtitle}>{test.title}</Text>
    <TouchableOpacity
      onPress={() => router.push(`/auth/test/${test.assignment_id}`)}
      style={styles.cardButton}>
      <MaterialIcons name="play-lesson" size={24} color="#fff" />
      <Text style={styles.cardButtonText}>{t("course.startTest")}</Text>
    </TouchableOpacity>
  </View>
);

export default function CoursePage() {
  const local: { id: string } = useLocalSearchParams();
  const { t } = useContext(LanguageContext);

  const { data: course } = useQuery({
    queryKey: [`get-course-${local.id}`],
    queryFn: () => client.get<Course>(`course/${local.id}`).then(r => r.data),
  });

  const { data: courseProgress } = useQuery({
    queryKey: [`get-course-progress-${local.id}`],
    queryFn: () => client.get<CourseProgress>(`course/progress/${local.id}`).then(r => r.data),
  });

  const [tab, setTab] = useState<"lessons" | "tests">("lessons");
  if (!course || !courseProgress) return null;

  return (
    <SafeAreaView>
      <Header />
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, tab === "lessons" && styles.activeTabButton]}
            onPress={() => setTab("lessons")}>
            <Text style={[styles.tabText, tab === "lessons" && styles.activeTabText]}>
              {t("course.tabs.lessons")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === "tests" && styles.activeTabButton]}
            onPress={() => setTab("tests")}>
            <Text style={[styles.tabText, tab === "tests" && styles.activeTabText]}>
              {t("course.tabs.tests")}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Content */}
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.gridContainer}>
          {tab === "lessons" && course.lessons.map((lesson, i) => (
            <LessonCard key={lesson.lesson_id} lesson={lesson} index={i} t={t} />
          ))}
          {tab === "tests" && course.tests.map((test, i) => (
            <TestCard key={test.assignment_id} test={test} index={i} t={t} />
          ))}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#6c38cc",
  },
  tabText: {
    fontFamily: "IBMPlexSans-SemiBold",
    fontSize: 14,
    color: "#464752",
  },
  activeTabText: {
    color: "#fff",
  },
  scrollContainer: {
    height: Dimensions.get("screen").height - 150 - 100,
  },
  card: {
    borderColor: "#EDEEF0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Адаптивность карточек для веба
    ...(Platform.OS === "web" && {
      flexBasis: "calc(33.333% - 16px)", // Три колонки
      margin: 8,
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: "IBMPlexSans-Bold",
    fontSize: 20,
    color: "#151324",
    marginLeft: 7,
  },
  cardSubtitle: {
    fontFamily: "IBMPlexSans-SemiBold",
    fontSize: 18,
    color: "#151324",
  },
  cardButton: {
    marginTop: 15,
    height: 50,
    backgroundColor: "#6c38cc",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardButtonText: {
    fontFamily: "IBMPlexSans-Bold",
    fontSize: 16,
    color: "#FFF",
    marginLeft: 10,
  },
  // Новый стиль для контейнера карточек
  gridContainer: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    flexWrap: Platform.OS === "web" ? "wrap" : "nowrap",
    justifyContent: "flex-start",
  },
});