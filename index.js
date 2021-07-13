import styled from 'styled-components/native';
import React from 'react';
import {Picker, Option} from './NativePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import filterStyle from './filterStyle';
// import {TextInput, View, Text, TouchableOpacity} from 'react-native';
import objectFromCSS from 'portable-components/objectFromCSS';

const TextInput = styled.TextInput`
  ${({style}) => {
    if (style) return style;
    return '';
  }}
`;

const View = styled.View`
  ${({style}) => {
    if (style) return style;
    return '';
  }}
`;

const Text = styled.Text`
  ${({style}) => {
    if (style) return style;
    return '';
  }}
`;

const TouchableOpacity = styled.TouchableOpacity`
  ${({style}) => {
    if (style) return style;
    return '';
  }}
`;

function compatableInput(styleString) {
  return props => {
    let {onChange, value, type, checked, placeholder} = props;

    let dataset = getDataset(props);

    function onChangeIntermediate(text) {
      if (!onChange) return;
      let obj = {target: {value: text, dataset: dataset}};
      onChange(obj);
    }

    let filteredStyle = filterStyle(styleString, props);

    if (!value) value = '';

    if (!placeholder) placeholder = 'Type here';

    return (
      <TextInput
        placeholder={placeholder}
        value={value.toString()}
        onChangeText={onChangeIntermediate}
        style={filteredStyle.view}></TextInput>
    );
  };
}

function getDataset(props) {
  let dataset = {};
  for (let key in props) {
    if (key.indexOf('data-') !== -1) {
      let actualField = key.replace('data-', '');
      dataset[actualField] = props[key];
    }
  }

  return dataset;
}

function theIntermediate(value, dataset, event) {
  if (!event) return;
  let obj = {target: {value: value, dataset: dataset}};
  event(obj);
}

function compatablePicker(styleString) {
  return props => {
    let {onChange, value, children} = props;

    let dataset = getDataset(props);

    function onChangeIntermediate(text) {
      theIntermediate(text, dataset, onChange);
    }

    let filteredStyle = filterStyle(styleString, props);

    return (
      <Picker
        value={value}
        children={children}
        onChange={onChangeIntermediate}
        filteredStyle={filteredStyle}></Picker>
    );
  };
}

function compatableOption(styleString) {
  return props => {
    let {children, value} = props;

    let filteredStyle = filterStyle(styleString, props);

    return (
      <Option value={value.toString()} style={filteredStyle.text}>
        {children.toString()}
      </Option>
    );
  };
}

function isNumberOrString(element) {
  if (typeof element == 'string' || typeof element == 'number') return true;
  return false;
}

function compatableDiv(styleString, headingType) {
  return props => {
    let {children, onClick} = props;
    let dataset = getDataset(props);

    let textProp = {};

    if (headingType) textProp = {[headingType]: true};

    function onClickIntermediate() {
      onClick({target: {dataset: dataset}});
    }

    let filteredStyle = filterStyle(styleString, props);

    let child = children;

    if (isNumberOrString(children)) {
      child = (
        <Text style={filteredStyle.text} {...textProp}>
          {children.toString()}
        </Text>
      );
    } else if (Array.isArray(children)) {
      child = [];
      for (let element of children) {
        if (isNumberOrString(element)) {
          child.push(
            <Text style={filteredStyle.text} {...textProp}>
              {element.toString()}
            </Text>,
          );
        } else {
          child.push(element);
        }
      }
    } else if (!children) {
      child = [];
    }

    if (onClick) {
      return (
        <TouchableOpacity
          style={filteredStyle.view}
          onPress={onClickIntermediate}>
          <View>{child}</View>
        </TouchableOpacity>
      );
    } else {
      return <View style={filteredStyle.view}>{child}</View>;
    }
  };
}

if (typeof document != 'undefined') {
  window.platformType = 'web';
} else {
  window.platformType = 'react-native';
}

class components {
  div(styleString, ...dynamicData) {
    return compatableDiv([styleString, dynamicData]);
  }

  span = this.div;

  button = this.div;

  h1(styleString, ...dynamicData) {
    return compatableDiv([styleString, dynamicData], 'h1');
  }

  h2(styleString, ...dynamicData) {
    return compatableDiv([styleString, dynamicData], 'h2');
  }

  h3(styleString, ...dynamicData) {
    return compatableDiv([styleString, dynamicData], 'h3');
  }
  h4(styleString, ...dynamicData) {
    return compatableDiv([styleString, dynamicData], 'h4');
  }
  h5(styleString, ...dynamicData) {
    return compatableDiv([styleString, dynamicData], 'h5');
  }

  h6(styleString, ...dynamicData) {
    return compatableDiv([styleString, dynamicData], 'h6');
  }

  option(styleString, ...dynamicData) {
    return compatableOption([styleString, dynamicData]);
  }

  select(styleString, ...dynamicData) {
    return compatablePicker([styleString, dynamicData]);
  }

  input(styleString, ...dynamicData) {
    return compatableInput([styleString, dynamicData]);
  }
}

module.exports = {
  styled: window.platformType == 'web' ? styled : new components(),
  localStorage:
    window.platformType == 'web' ? window.localStorage : AsyncStorage,
};
