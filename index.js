import styled from "styled-components";
import rnStyled from "styled-components/native";
import React from "react";
import { Picker, Option } from "./NativePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NativeTextInputStyle = rnStyled.TextInput`
${({ style }) => {
  return style;
}}
`;

const NativeView = rnStyled.View`
${({ style }) => {
  return style;
}}
`;

let ClickContainer = styled.TouchableHighlight``;

function compatableInput(styleString) {
  return (props) => {
    let { onChange } = props;

    let dataset = getDataset(props);

    function onChangeIntermediate(text) {
      if (!onChange) return;
      let obj = { target: { value: text, dataset: dataset } };
      onChange(obj);
    }

    return (
      <NativeTextInputStyle
        {...props}
        onChange={onChangeIntermediate}
        style={styleString}
      ></NativeTextInputStyle>
    );
  };
}

function getDataset(props) {
  let dataset = {};
  for (let key in props) {
    if (key.indexOf("data-") !== -1) {
      let actualField = key.replace("data-", "");
      dataset[actualField] = props[key];
    }
  }

  return dataset;
}

function compatablePicker(styleString) {
  return (props) => {
    let { onChange, value } = props;

    let dataset = getDataset(props);

    function onChangeIntermediate(text) {
      if (!onChange) return;
      let obj = { target: { value: text, dataset: dataset } };
      onChange(obj);
    }

    return (
      <Picker
        {...props}
        selectedValue={value}
        onValueChange={onChangeIntermediate}
        style={styleString}
      ></Picker>
    );
  };
}

function compatableOption() {
  return (props) => {
    let { children, value } = props;

    return (
      <Picker.Item {...props} label={children} value={value}></Picker.Item>
    );
  };
}

function compatableDiv(styleString) {
  return (props) => {
    let { children, onClick } = props;
    let dataset = getDataset(props);

    function onClickIntermediate() {
      onClick({ target: { dataset: dataset } });
    }

    return (
      <ClickContainer onPress={onClickIntermediate}>
        <NativeView style={styleString}>{children}</NativeView>
      </ClickContainer>
    );
  };
}

if (typeof document != "undefined") {
  window.platformType = "web";
} else {
  window.platformType = "react-native";
}

class components {
  constructor() {
    this.env = window.platformType;
  }
  div = (styleString) => {
    if (this.env == "web") return styled.div(styleString);
    return compatableDiv(styleString);
  };

  span = (styleString) => {
    if (this.env == "web") return styled.span(styleString);
    return rnStyled.Text(styleString);
  };

  button = this.div;

  h1 = this.span;

  h2 = this.span;

  h3 = this.span;

  h4 = this.span;

  h5 = this.span;

  h6 = this.span;

  option = (styleString) => {
    if (this.env == "web") return styled.option(styleString);
    return Option;
  };

  select = (styleString) => {
    if (this.env == "web") return styled.select(styleString);
    return compatablePicker(styleString);
  };

  input = (styleString) => {
    if (this.env == "web") return styled.input(styleString);
    return compatableInput(styleString);
  };
}

module.exports = {
  styled: new components(),
  localStorage:
    window.platformType == "web" ? window.localStorage : AsyncStorage,
};
