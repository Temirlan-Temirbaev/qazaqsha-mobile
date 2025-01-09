import { ArrowIcon } from "@/assets/icons/arrow";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native"
import { SvgXml } from "react-native-svg";

export const TitleHeader = ({title} : {title : string}) => {
  return <View
    style={{display: "flex", 
      backgroundColor: "#FFF", 
      flexDirection : "row", 
      position: "relative",
      justifyContent: "center",
      height: 60,
      width: "100%",
      alignItems: "center",
      borderBottomWidth: 2,
      borderColor : "#EDEEF0",
      borderStyle: "solid"
    }}>
  <TouchableOpacity
    style={{position: "absolute", left: 20, padding: 8, 
      transform: [{ rotate: "180deg" }]
      }}
    onPress={() => {
      router.back()
    }}
  >
    <SvgXml width={16} height={16} xml={ArrowIcon} />
  </TouchableOpacity>
  <Text
    style={{
      fontFamily: "IBMPlexSans-Bold",
      fontSize: 18,
      color: "#151324"
    }}
   className="text-primaryBlack text-[18px] font-[600]">{title}</Text>
</View>
}