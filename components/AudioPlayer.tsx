import React, { useEffect, useState } from "react";
import {Platform, Text, TouchableOpacity, View} from "react-native";
import { Audio } from "expo-av";
import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native'; // импортируем хук useFocusEffect
import { Ionicons } from "@expo/vector-icons";

// Функция для преобразования времени в формат MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const SimpleAudioPlayer = ({ url }: { url: string }) => {
  const [sound, setSound] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Загружаем звук при монтировании компонента
  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: false }
    );
    setSound(sound);

    // Получаем продолжительность аудио
    const status = await sound.getStatusAsync();
    setDuration(status.durationMillis / 1000); // в секундах
  };

  // Воспроизведение звука
  const play = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // Пауза
  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  // Получаем текущее время аудио
  const updateTime = async () => {
    if (sound && !isSeeking) {
      const status = await sound.getStatusAsync();
      setCurrentTime(status.positionMillis / 1000); // в секундах
    }
  };

  // Обработчик изменения позиции ползунка
  const seekAudio = async (value: number) => {
    if (sound) {
      setCurrentTime(value);
      await sound.setPositionAsync(value * 1000); // переводим в миллисекунды
    }
  };

  const setAudioMode = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true, // Включает звук даже в беззвучном режиме
    });
  };

  // Обновляем текущее время каждую секунду
  useEffect(() => {
    setAudioMode()
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval); // очищаем интервал при размонтировании
  }, [sound]);

  // Загружаем звук при монтировании компонента
  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [url]);

  // Остановка музыки при уходе с экрана
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.stopAsync(); // Останавливаем звук
          setIsPlaying(false); // Обновляем состояние кнопки
        }
      };
    }, [sound])
  );

  return (
    <>
      {Platform.OS === "web" ? <audio style={{marginBottom : "15px"}} src={url} controls={true}>
      </audio> : (<><View style={{ paddingTop: 20, paddingRight: 32, display: "flex", alignItems: "center", flexDirection: "row" }}>
        <TouchableOpacity onPress={() => (isPlaying ? pause() : play())}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>
            {isPlaying ? <Ionicons name="pause" size={32} color="#6c38cc" /> : <Ionicons size={32} color="#6c38cc" name="play" />}
          </Text>
        </TouchableOpacity>

        <Slider
          style={{ width: "100%", marginBottom: 10 }}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingStart={() => setIsSeeking(true)}
          onSlidingComplete={(value) => {
            setIsSeeking(false);
            seekAudio(value);
          }}
          minimumTrackTintColor="#6c38cc"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#6c38cc"
        />
      </View>
      
      <View style={{ marginBottom: 10, paddingLeft: 5 }}>
        <Text>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </View></>)
  }
    </>
  );
};