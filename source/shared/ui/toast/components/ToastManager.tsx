import Modal from "react-native-modal";
import React, { Component } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { View, Text, Animated, Dimensions } from "react-native";

import { SvgXml } from "react-native-svg";
import defaultProps from "../utils/defaultProps";
import { Colors } from "../config/theme";
import styles from "./styles";
import { ToastManagerProps, ToastManagerState } from "../utils/interfaces";
import { ToastSuccessIcon } from "../../../../../assets/icons/toastSuccess";
import { ToastErrorIcon } from "../../../../../assets/icons/toastError";

const { height } = Dimensions.get("window");

class ToastManager extends Component<ToastManagerProps, ToastManagerState> {
  private timer: NodeJS.Timeout;

  private isShow: boolean;

  static defaultProps = defaultProps;

  static __singletonRef: ToastManager | null;

  constructor(props: ToastManagerProps) {
    super(props);
    ToastManager.__singletonRef = this;
    this.timer = setTimeout(() => {}, 0); // Initialize timer with a dummy value
    this.isShow = false;
  }

  state: any = {
    isShow: false,
    text: "",
    opacityValue: new Animated.Value(1),
    barWidth: new Animated.Value(RFPercentage(32)),
    barColor: Colors.default,
    icon: "checkmark-circle",
    position: this.props.position,
    animationStyle: {
      upInUpOut: {
        animationIn: "slideInDown",
        animationOut: "slideOutUp",
      },
      rightInOut: {
        animationIn: "slideInRight",
        animationOut: "slideOutRight",
      },
      zoomInOut: {
        animationIn: "zoomInDown",
        animationOut: "zoomOutUp",
      },
    },
  };

  static info = (text: string, position: string) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.info,
      "ios-information-circle",
      position,
    );
  };

  static success = (text: string, position?: string) => {
    ToastManager.__singletonRef?.show(
      text,
      Colors.success,
      "success",
      position,
    );
  };

  static warn = (text: string, position: string) => {
    ToastManager.__singletonRef?.show(text, Colors.warn, "warning", position);
  };

  static error = (text: string, position: string) => {
    ToastManager.__singletonRef?.show(text, Colors.error, "error", position);
  };

  show = (
    text = "",
    barColor = Colors.default,
    icon: string,
    position?: string,
  ) => {
    const { duration } = this.props;
    this.state.barWidth.setValue(this.props.width);
    this.setState({
      isShow: true,
      duration,
      text,
      barColor,
      icon,
    });
    if (position) this.setState({ position });
    this.isShow = true;
    if (duration !== this.props.end) this.close(duration);
  };

  close = (duration: number) => {
    if (!this.isShow && !this.state.isShow) return;
    this.resetAll();
    this.timer = setTimeout(() => {
      this.setState({ isShow: false });
    }, duration || this.state.duration);
  };

  position = () => {
    const { position } = this.state;
    if (position === "top") return this.props.positionValue;
    if (position === "center") return height / 2 - RFPercentage(9);
    return height - this.props.positionValue - RFPercentage(10);
  };

  handleBar = () => {
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  pause = () => {
    this.setState({ oldDuration: this.state.duration, duration: 10000 });
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).stop();
  };

  resume = () => {
    this.setState({ duration: this.state.oldDuration, oldDuration: 0 });
    Animated.timing(this.state.barWidth, {
      toValue: 0,
      duration: this.state.duration,
      useNativeDriver: false,
    }).start();
  };

  hideToast = () => {
    this.resetAll();
    this.setState({ isShow: false });
    this.isShow = false;
    if (!this.isShow && !this.state.isShow) return;
  };

  resetAll = () => {
    clearTimeout(this.timer);
  };

  render() {
    this.handleBar();
    const {
      animationIn,
      animationStyle,
      animationOut,
      backdropTransitionOutTiming,
      backdropTransitionInTiming,
      animationInTiming,
      animationOutTiming,
      backdropColor,
      backdropOpacity,
      hasBackdrop,
      width,
      height,
      style,
      textStyle,
      theme,
    } = this.props;

    const {
      isShow,
      animationStyle: stateAnimationStyle,
      barColor,
      icon,
      text,
      barWidth,
    } = this.state;

    const icons = {
      success: ToastSuccessIcon,
      error: ToastErrorIcon,
    };

    const barColors = {
      success: "#6c38cc",
      error: "#EB5555",
    };


    return (
      <Modal
        animationIn={
          animationIn || stateAnimationStyle[animationStyle].animationIn
        }
        animationOut={
          animationOut || stateAnimationStyle[animationStyle].animationOut
        }
        backdropTransitionOutTiming={backdropTransitionOutTiming}
        backdropTransitionInTiming={backdropTransitionInTiming}
        animationInTiming={animationInTiming}
        animationOutTiming={animationOutTiming}
        onTouchEnd={this.resume}
        onTouchStart={this.pause}
        swipeDirection={["up", "down", "left", "right"]}
        onSwipeComplete={this.hideToast}
        onModalHide={this.resetAll}
        isVisible={isShow}
        coverScreen={false}
        backdropColor={backdropColor}
        backdropOpacity={backdropOpacity}
        hasBackdrop={hasBackdrop}
        style={styles.modalContainer}
      >
        <View
          style={[
            styles.mainContainer,
            {
              width,
              height: height,
              backgroundColor: Colors[theme].back,
              top: this.position(),
              ...style,
            },
          ]}
          className="rounded-xl"
        >
          <View style={styles.content}>
            <SvgXml xml={icons[icon]} className="mr-2" />
            <Text
              style={[
                styles.textStyle,
                { color: Colors[theme].text, ...textStyle },
              ]}
            >
              {text}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={{ width: barWidth, backgroundColor: barColors[icon] }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

ToastManager.defaultProps = defaultProps;

export default ToastManager;
