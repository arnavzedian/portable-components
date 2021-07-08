import styled from "styled-components";
import rnStyled from "styled-components/native";
import React from "react";
import { Picker, Option } from "./NativePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import filterStyle from "./filterStyle";
import { CheckBox } from "react-native";

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
    let { onChange, value, type, checked } = props;

    let dataset = getDataset(props);

    function onChangeIntermediate(text) {
      if (!onChange) return;
      let obj = { target: { value: text, dataset: dataset } };
      onChange(obj);
    }

    let filteredStyle = filterStyle(styleString, props);

    if (!value) value = "";

    return (
      <NativeTextInput
        value={value.toString()}
        onChangeText={onChangeIntermediate}
        style={filteredStyle.text}
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

    let filteredStyle = filterStyle(styleString, props);

    return (
      <Picker
        {...props}
        selectedValue={value}
        onValueChange={onChangeIntermediate}
        style={filteredStyle.view}
      ></Picker>
    );
  };
}

function isNumberOrString(element) {
  if (typeof element == "string" || typeof element == "number") return true;
  return false;
}

function compatableDiv(styleString) {
  return (props) => {
    let { children, onClick } = props;
    let dataset = getDataset(props);

    function onClickIntermediate() {
      onClick({ target: { dataset: dataset } });
    }

    let filteredStyle = filterStyle(styleString, props);

    let child = children;

    if (isNumberOrString(children)) {
      child = (
        <NativeText style={filteredStyle.text}>
          {children.toString()}
        </NativeText>
      );
    } else if (Array.isArray(children)) {
      child = [];
      for (let element of children) {
        if (isNumberOrString(element)) {
          child.push(<NativeText>{element.toString()}</NativeText>);
        } else {
          child.push(element);
        }
      }
    } else if (!children) {
      child = [];
    }

    if (onClick) {
      return (
        <ClickContainer
          style={filteredStyle.view}
          onPress={onClickIntermediate}
        >
          <NativeView style={`height:100%; width:100%`}>{child}</NativeView>
        </ClickContainer>
      );
    } else {
      return <NativeView style={filteredStyle.view}>{child}</NativeView>;
    }
  };
}

if (typeof document != "undefined") {
  window.platformType = "web";
} else {
  window.platformType = "react-native";
}

class components {
  div(styleString, ...dynamicData) {
    return compatableDiv([styleString, dynamicData]);
  }

  span = this.div;

  button = this.div;

  h1 = this.div;

  h2 = this.div;

  h3 = this.div;

  h4 = this.div;

  h5 = this.div;

  h6 = this.div;

  option() {
    return Option;
  }

  select(styleString, ...dynamicData) {
    return compatablePicker([styleString, dynamicData]);
  }

  input(styleString, ...dynamicData) {
    return compatableInput([styleString, dynamicData]);
  }
}

module.exports = {
  styled: window.platformType == "web" ? styled : new components(),
  localStorage:
    window.platformType == "web" ? window.localStorage : AsyncStorage,
};
