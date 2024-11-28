import { finishIcon } from "@/assets/icons/finish";
import { Reply, StartTest } from "@/source/core/entities";
import { client } from "@/source/shared/utils/apiClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [reply, setReply] = useState<Reply | null>(null)

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
        <Text style={styles.questionText}>{question.text}</Text>
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
              <Text style={styles.answerText}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderCompletionScreen = () => {
    if (!reply) return
    return <View style={styles.completionContainer}>
      <View style={{
        backgroundColor: "#F3F3F3",
        height: 100,
        padding: 20,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems : "center",

      }}>
        <Text style={{fontFamily: "IBMPlexSans-Bold", fontSize: 22}}>Вы завершили {'\n'}тестирование</Text>
        <SvgXml xml={finishIcon} width="56px" height="56px" />
      </View>
      <Text style={{color : "#868688", fontFamily: "IBMPlexSans-Regular", fontSize: 16, marginTop: 25, marginBottom: 10}}>Ваш результат</Text>
      {/* <View style={{
        height: 60, 
        backgroundColor: "#F2F2F2",
        borderColor: "#DADCE0",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 12,
        display: "flex", justifyContent: "center", alignItems: "center"
        }}> */}
          <Text style={{fontFamily: "IBMPlexSans-Bold", fontSize: 24, color : "#6c38cc"}}>{reply.score}/{testData.points} баллов</Text>
      {/* </View> */}
      <TouchableOpacity style={{
        height: 56, 
        backgroundColor : "#6c38cc", 
        borderRadius: 8,
        display: "flex", justifyContent: "center", alignItems: "center", marginVertical: 25
        }}>
        <Text style={{fontFamily: "IBMPlexSans-Regular", fontSize : 18, color: "#FFF"}}>
          Работа над ошибками
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={() => router.push("/auth")}
      style={{
        height: 56, 
        backgroundColor : "#151324", 
        borderRadius: 8,
        display: "flex", justifyContent: "center", alignItems: "center"
        }}>
        <Text style={{fontFamily: "IBMPlexSans-Regular", fontSize : 18, color: "#FFF"}}>
          На главную
        </Text>
      </TouchableOpacity>
    </View>
  };

  return (
    <SafeAreaView style={styles.container}>
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
}}>Завершить тест</Text>
        </TouchableOpacity>
      </View>
      {!isCompleted ? renderQuestion() : renderCompletionScreen()}
      <View style={{
        flexDirection: "column-reverse",
        gap: 20,
        marginTop: 20,
        display: isCompleted ? "none" : "flex"
      }}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Text 
            style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledButtonText]}
          >Назад</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>
            {currentQuestionIndex === testData.questions.length - 1 ? "Завершить" : "Следующий"}
          </Text>
        </TouchableOpacity>
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
});