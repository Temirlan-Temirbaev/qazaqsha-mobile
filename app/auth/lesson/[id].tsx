import {SimpleAudioPlayer} from "@/components/AudioPlayer";
import { TitleHeader } from "@/components/TitleHeader";
import { Lesson } from "@/source/core/entities";
import { MEDIA_URL } from "@/source/shared/const/media-url";
import { client } from "@/source/shared/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LessonPage(){
  const local : {id : string} = useLocalSearchParams()
  const {data: lesson} = useQuery({
    queryKey : [`get-lesson-${local.id}`],
    queryFn: () => client.get<Lesson>(`lesson/${local.id}`).then(r => r.data)
  })
  const [modalVisible, setModalVisible] = useState(false);

  
  if (!lesson) return;

  return <SafeAreaView style={{backgroundColor: "#F7F7F7", height: "100%"}}>
    <TitleHeader title={lesson.title} />
    <View style={{padding: 16}}>
      <ScrollView style={{
        borderColor: "#DADCE0",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 8,
        padding: 16,
        display: "flex",
        flexDirection : "column",
        gap : 20
      }}>
        {lesson.audio && <SimpleAudioPlayer url={MEDIA_URL+lesson.audio}/>}
        {lesson.image && (
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={{ uri: MEDIA_URL +lesson.image }} style={styles.thumbnail} />
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalContainer}>
                <Image
                 source={{ uri: MEDIA_URL+lesson.image }} style={styles.fullscreenImage} resizeMode="contain" />
              </TouchableOpacity>
            </Modal>
          </>
        )}
        {lesson.text && (
          <Text style={{
            fontFamily: "IBMPlexSans-Regular",
            color: "#151324",
            fontSize: 16,
            lineHeight: 20
            }}>
            {lesson.text}
          </Text>
        )}
      </ScrollView>
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
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
