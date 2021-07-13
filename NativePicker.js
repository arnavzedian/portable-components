import styled from 'styled-components/native';
import React, {useState} from 'react';
import filterStyle from 'portable-components/filterStyle';
import objectFromCSS from 'portable-components/objectFromCSS';

let MainParent = styled.View`
  position: relative;
  width: 100%;
`;

let Text = styled.Text`
  ${({isActive}) => {
    if (isActive)
      return `
      color:#111;
    `;
  }}
`;

let ClickContainer = styled.TouchableOpacity`
  position: relative;
`;

let SelectedOption = styled.View`
  display: flex;
  background: #fff;
  color: #111;
  width: 100%;
  flex-direction: row;
  border: 1px solid #111;
  border-radius: 15px;
  padding: 15px;
  justify-content: space-between;
  ${({style}) => {
    return style;
  }}
`;

let OptionParentContainer = styled.View`
  width: 100%;
  z-index: 5;
  border-radius: 5px;
  background-color: transparent;
  padding: 0;

  padding-right: 0;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;

  margin: 10px 0;
  margin-bottom: 25px;
`;

let AnOption = styled.TouchableOpacity`
  padding-right: 10px;
  padding-left: 10px;
  padding: 5px;
  margin-right: 10px;
  border-radius: 5px;
  color: #fff;
  background-color: #111;
  flex: 1;
  justify-content: center;
  align-items: center;
  border: 1.5px solid #fff;
  ${({isActive}) => {
    if (isActive)
      return `
      background:#fff;
    `;
  }}
`;

export function Picker({children, value, filteredStyle, onChange}) {
  if (!filteredStyle) filteredStyle = '';

  let optionsList = [];

  function optionSelected(newVal) {
    onChange(newVal);
  }

  if (!children) return [];

  let options = {};

  for (let child of children) {
    let childProps = child.props;

    options[childProps.value] = childProps.children;

    optionsList.push(
      <AnOption
        onPress={() => {
          optionSelected(childProps.value);
        }}
        isActive={value == childProps.value}>
        <Text isActive={value == childProps.value}>{childProps.children}</Text>
      </AnOption>,
    );
  }

  return <OptionParentContainer>{optionsList}</OptionParentContainer>;
}

export function Option(props) {
  let newProps = {...props};
  newProps.children = newProps.children.toString();

  return <Text {...newProps}></Text>;
}
