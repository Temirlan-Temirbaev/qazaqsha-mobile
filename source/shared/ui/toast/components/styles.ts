import { RFPercentage } from "react-native-responsive-fontsize";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: RFPercentage(1.5),
    width: "100%",
  },

  hideButton: {
    position: "absolute",
    right: RFPercentage(0.5),
    top: RFPercentage(0.5),
  },

  iconWrapper: {
    marginRight: RFPercentage(0.7),
  },

  mainContainer: {
    alignItems: "flex-start",
    borderRadius: 6,
    elevation: 5,
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  modalContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    zIndex: 200,
  },

  progressBarContainer: {
    bottom: 0,
    flexDirection: "row",
    height: 4,
    position: "absolute",
    width: "100%",
  },

  textStyle: {
    fontSize: RFPercentage(2.5),
    fontWeight: "400",
  },
});

export default styles;
