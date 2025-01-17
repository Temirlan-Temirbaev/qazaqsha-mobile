import { finishIcon } from "@/assets/icons/finish";
import { Reply, StartTest } from "@/source/core/entities";
import { client } from "@/source/shared/utils/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
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
  const {data: testData} = useQuery({
    queryKey : ["getStartTest"],
    queryFn: () => {
      return client.get<StartTest>("assignment/start-test").then(r => r.data)
    }
  })
  const {t} = useContext(LanguageContext)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [reply, setReply] = useState<Reply | null>(null)
  const [modalVisible, setModalVisible] = useState(false);

  const {mutate} = useMutation({
    mutationKey: ["replyStartTest"],
    mutationFn : () => {
      const studentAnswers : StudentAnswer[] = []
      Object.keys(selectedAnswers).forEach(key => {
        studentAnswers.push({questionId: key, answerId: selectedAnswers[key]})
      })
      return client.post<Reply>("reply", {
        type : "start_test",
        assignmentId: testData?.assignment_id,
        studentAnswers
      })
    },
    onSuccess : (r) => {
      setReply(r.data)
      setIsCompleted(true)
    },
    onError: (e) => {
      console.log(e);
      
    }
  })

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

  useEffect(() => {
    const saveAnswers = async () => {
      try {        
        await saveToStore(`assignment-${testData?.assignment_id}`, JSON.stringify(selectedAnswers));
      } catch (error) {
        console.error("Failed to save answers to storage:", error);
      }
    };

    saveAnswers();
  }, [selectedAnswers]);


  if (!testData) return;

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      mutate()
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
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.answerButton,
                selectedAnswers[question.question_id] === item.answer_id && styles.selectedAnswer,
              ]}
              onPress={() => handleAnswerSelect(question.question_id, item.answer_id)}
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
          )}
        />
      </View>
    );
  };

  const renderCompletionScreen = () => {
    if (!reply) return null;
  
    return (
      <View style={styles.completionContainer}>
        <View style={styles.completionContent}>
          <View
            style={{
              backgroundColor: "#F3F3F3",
              height: 100,
              padding: 20,
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "IBMPlexSans-Bold", fontSize: 22, marginRight : 10 }}>
              {t("completed")}
            </Text>
            <SvgXml xml={finishIcon} width="56px" height="56px" />
          </View>
          <Text
            style={{
              color: "#868688",
              fontFamily: "IBMPlexSans-Regular",
              fontSize: 16,
              marginTop: 25,
              marginBottom: 10,
            }}
          >
            {t("yourResult")}
          </Text>
          <Text
            style={{
              fontFamily: "IBMPlexSans-Bold",
              fontSize: 24,
              color: "#6c38cc",
              marginBottom : 30
            }}
          >
            {reply.score}/{testData.points} {t("points")}
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push("/auth")}
            style={{
              height: 56,
              backgroundColor: "#151324",
              borderRadius: 8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "IBMPlexSans-Regular",
                fontSize: 18,
                color: "#FFF",
              }}
            >
              {t("mainPage")}
            </Text>
          </TouchableOpacity>
        </View>
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
        onPress={() => mutate()}
        style={{
          display: isCompleted ? "none" : "flex",
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
      {!isCompleted ? renderQuestion() : renderCompletionScreen()}
      <View style={{
        flexDirection: Platform.OS === "web" ? "row" :"column-reverse",
        gap: 20,
        marginTop: 20,
        display: isCompleted ? "none" : "flex",
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
    backgroundColor: "#fff",
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
    fontFamily: "IBMPlexSans-Bold",
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
    justifyContent: "flex-start",
    alignItems: Platform.OS === "web" ? "center" : "flex-start",
    padding: 20,
    backgroundColor: "#fff",
  },
  completionContent: {
    maxWidth: Platform.OS === "web" ? 550 : "100%",
    width: "100%",
    // alignItems: Platform.OS === "web" ? "center" : "stretch",
    // justifyContent: "center",
    // flex : 1
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