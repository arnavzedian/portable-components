import styled from "styled-components";
import rnStyled from "styled-components/native";
import React from "react";
import { Picker, Option } from "./NativePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import filterStyle from "./filterStyle";

const NativeTextInput = rnStyled.TextInput`
${({ style }) => {
  return style;
}}
`;

const NativeView = rnStyled.View`
${({ style }) => {
  return style;
}}
`;

const NativeText = rnStyled.Text`
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
      <NativeTextInput
        {...props}
        onChange={onChangeIntermediate}
        style={styleString}
      ></NativeTextInput>
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

function compatableDiv(styleString) {
  return (props) => {
    let { children, onClick } = props;
    let dataset = getDataset(props);

    function onClickIntermediate() {
      onClick({ target: { dataset: dataset } });
    }

    let filteredStyle = filterStyle(styleString);

    let child = children;

    if (typeof children == "String")
      child = <NativeText style={filteredStyle.text}>{children}</NativeText>;

    return (
      <ClickContainer onPress={onClickIntermediate}>
        <NativeView style={filteredStyle.view}>{child}</NativeView>
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
  div(styleString) {
    return compatableDiv(styleString);
  }

  span(styleString) {
    return compatableDiv(styleString);
  }

  button = this.div;

  h1 = this.span;

  h2 = this.span;

  h3 = this.span;

  h4 = this.span;

  h5 = this.span;

  h6 = this.span;

  option() {
    return Option;
  }

  select(styleString) {
    return compatablePicker(styleString);
  }

  input(styleString) {
    return compatableInput(styleString);
  }
}

module.exports = {
  styled: window.platformType == "web" ? styled : new components(),
  localStorage:
    window.platformType == "web" ? window.localStorage : AsyncStorage,
};
