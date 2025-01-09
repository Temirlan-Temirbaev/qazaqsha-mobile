import { finishIcon } from "@/assets/icons/finish";
import { Reply, StartTest, Test } from "@/source/core/entities";
import { client } from "@/source/shared/utils/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, {useContext, useEffect, useState} from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Modal, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { saveToStore } from "@/source/shared/utils/saveToStore";
import { receiveFromStore } from "@/source/shared/utils/receiveFromStore";
import { SimpleAudioPlayer } from "@/components/AudioPlayer";
import { MEDIA_URL } from "@/source/shared/const/media-url";
import {LanguageContext} from "@/source/app/LanguageProvider";
type StudentAnswer = {
  questionId : string,
  answerId: string
}

const TestScreen = () => {
  const local : {id : string}= useLocalSearchParams()
  const {data: testData} = useQuery({
    queryKey : [`get-assignment-${local.id}`],
    queryFn: () => {
      return client.get<Test>(`full-test/${local.id}`).then(r => r.data)
    }
  })
  const {t} = useContext(LanguageContext)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadAnswers = async () => {
      try {
        const savedAnswers = await receiveFromStore(`assignment-${testData?.assignment_id}`);
    
        if (savedAnswers) {
          setSelectedAnswers(JSON.parse(savedAnswers));
        }
      } catch (error) {
        console.error("Failed to load answers from storage:", error);
      }
    };

    loadAnswers();
  }, [testData]);


  if (!testData) return;


  const handleNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      router.push("/auth")
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

    

  const renderQuestion = () => {
    const question = testData.questions[currentQuestionIndex];
    
    return (
      <View>
        <FlatList
          data={testData.questions}
          horizontal={true}
          scrollEnabled={true}
          style={{marginBottom: 20}}
          keyExtractor={q => q.question_id}
          renderItem={({item, index}) => {
            let isActive = currentQuestionIndex === index
            let bgColor = isActive ? "rgb(108, 56, 204)" : "#F7F7F7"
            let textColor = isActive ? "#FFF" : "#464752"
            if (selectedAnswers[item.question_id] && currentQuestionIndex !== index) {
              isActive = true;
              bgColor = "rgba(108, 56, 204, .15)"
              textColor = "rgb(108, 56, 204)"
            }
            const correctAnswer = item.answers.find(answ => answ.is_correct)
            if (correctAnswer?.answer_id === selectedAnswers[item.question_id]) {
              isActive = true;
              bgColor = "#42BF77"
              textColor = "#fff"
            } else {
              isActive = true;
              bgColor = "#EB5555"
              textColor = "#fff"
            }
            return <TouchableOpacity 
            onPress={() => setCurrentQuestionIndex(index)}
            style={{
              width: 66, 
              height: 44, 
              borderStyle: "solid", 
              borderColor: "#EDEEF0", 
              borderWidth: isActive ? 0 : 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 15,
              borderRadius: 8,
              backgroundColor: bgColor
            }}>
              <Text style={{
                color: textColor,
                fontFamily: "IBMPlexSans-Bold"
                }}>{index + 1}</Text>
            </TouchableOpacity>
          }}
        />
        <Text style={{
          color : "#868688",
          fontFamily : "IBMPlexSans-Regular",
          fontSize: 13
        }}>
          {t("question")} {currentQuestionIndex + 1}
        </Text>
        {question?.image && (
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={{ uri: MEDIA_URL +question.image }} style={styles.thumbnail} />
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalContainer}>
                <Image
                 source={{ uri: MEDIA_URL+question.image }} style={styles.fullscreenImage} resizeMode="contain" />
              </TouchableOpacity>
            </Modal>
          </>
        )}
        {question.audio && (
          <SimpleAudioPlayer url={MEDIA_URL + question.audio} />
        )}
        <Text style={styles.questionText}>{question.text}</Text>

        <Text style={{
          color : "#868688",
          fontFamily : "IBMPlexSans-Regular",
          fontSize: 14,
          marginBottom: 10
        }}>
          {t("answers")}
        </Text>
        <FlatList
          scrollEnabled={true}
          data={question.answers}
          keyExtractor={(item) => item.answer_id}
          renderItem={({ item }) => {
            const correctAnswer = question.answers.find(answ => answ.is_correct)
            const isCorrect = correctAnswer?.answer_id === item.answer_id
            let bg = "#FFF"
            if (item.answer_id === selectedAnswers[question.question_id]) {
              if (correctAnswer?.answer_id !== selectedAnswers[question.question_id]) {
                  bg = "#EB55551A"
              }
            }
            return <TouchableOpacity
              style={[
                styles.answerButton,
                selectedAnswers[question.question_id] === item.answer_id && styles.selectedAnswer,
                {
                  borderColor : isCorrect ? "#42BF77" : "#DADCE0",
                  backgroundColor : bg
                }
              ]}
              disabled
            >
              <View style={{
                height: 24, width: 24,
                backgroundColor : item.answer_id === selectedAnswers[question.question_id] ? "#6C38CC" : "#F7F7F7", 
                borderWidth: item.answer_id === selectedAnswers[question.question_id] ? 0 :1,
                borderColor : "#EDEEF0",
                borderRadius: 1000,
                display: "flex",
                justifyContent :"center",
                alignItems :"center"
              }}>
                {selectedAnswers[question.question_id] === item.answer_id && <MaterialIcons name="done" size={16} color="white" />}
              </View>
              <Text style={styles.answerText}>{item.text}</Text>
            </TouchableOpacity>
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        minWidth : Platform.OS === "web" ? "85%" : "100%",
        marginHorizontal : Platform.OS === "web" ? "auto" : 0
      }}>

      <View style={{display : "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={styles.title}>{testData.title}</Text>
        <TouchableOpacity 
        onPress={() => router.push("/auth")}
        style={{
          display: "flex",
          backgroundColor : "#6c38cc", 
          justifyContent: "center", 
          alignItems: "center",
          paddingHorizontal: 20,
          borderRadius: 10,
          height: 35
        }}>
          <Text style={{color: "#FFF",     fontFamily: "IBMPlexSans-Bold"
}}>{t("finishTest")}</Text>
        </TouchableOpacity>
      </View>
      {renderQuestion()}
      <View style={{
        // flexDirection: "column-reverse",
        gap: 20,
        marginTop: 20,
        display: "flex",
        flexDirection: Platform.OS === "web" ? "row" :"column-reverse",
        justifyContent : Platform.OS === "web" ? "space-between" : "center"
      }}>
        <TouchableOpacity
          style={[styles.navButton, styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text 
            style={[styles.navButtonText, styles.disabledButtonText]}
          >{t("previous")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>
            {currentQuestionIndex === testData.questions.length - 1 ? t("finishTest") : t("next")}
          </Text>
        </TouchableOpacity>
      </View>
      </View>

    </SafeAreaView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    width: "60%",
    fontFamily: "IBMPlexSans-Bold"
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: "IBMPlexSans-Bold"

  },
  answerButton: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    display :"flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  selectedAnswer: {
    backgroundColor: "#d1e7dd",
    borderColor: "#0f5132",
  },
  answerText: {
    fontSize: 16,
    fontFamily: "IBMPlexSans-Bold"
  },
  navigationContainer: {
    flexDirection: "column-reverse",
    gap: 20,
    marginTop: 20,
  },
  navButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#6c38cc",
    paddingHorizontal : Platform.OS === "web" ? 35 : 15
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "IBMPlexSans-Bold"
  },
  disabledButton: {
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor : "#EDEEF0",
    borderStyle: "solid"
  },
  disabledButtonText: {
    color: "#464752"
  },
  completionContainer: {
    flex: 1,
  },
  thumbnail: {
    minWidth: 320,
    minHeight: 200,
    borderRadius: 12,
    marginBottom: 20
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '90%',
  },
  closeArea: {
    position: 'absolute',
    top: "5%",
    left: "5%",
    zIndex: 3
  },
});