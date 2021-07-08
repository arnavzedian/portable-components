import styled from 'styled-components/native';
import React, {useState} from 'react';
import filterStyle from 'portable-components/filterStyle';
import objectFromCSS from 'portable-components/objectFromCSS';

let MainParent = styled.View`
  position: relative;
  width: 100%;
  ${({style}) => {
    return style;
  }}
`;

let ClickContainer = styled.TouchableHighlight`
  ${({style}) => {
    return style;
  }}
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
`;

let Text = styled.Text`
  color: #111;
  ${({style}) => {
    return style;
  }}
`;

let OptionParentContainer = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 5000;
  border-radius: 25px;
  background-color: #fff;
  padding: 25px;
  display: flex;
  flex-direction: column;
  left: 0;
`;

let AnOption = styled.View`
  margin-top: 25px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid;
`;

export function Picker({children, value, style, onChange}) {
  let [showing, show] = useState(false);
  if (!style) style = {};

  let optionsList = [];

  function optionSelected(newVal) {
    onChange(newVal);

    show(false);
  }

  // let filtered = filterStyle(style);

  if (!children) return [];

  let options = {};

  for (let child of children) {
    let childProps = child.props;

    options[childProps.value] = childProps.children;

    optionsList.push(
      <ClickContainer
        onPress={() => {
          optionSelected(childProps.value);
        }}>
        <AnOption>
          <Text>{childProps.children}</Text>
        </AnOption>
      </ClickContainer>,
    );
  }

  return (
    <MainParent>
      {showing ? (
        <OptionParentContainer>{optionsList}</OptionParentContainer>
      ) : (
        <ClickContainer
          style={style}
          onPress={() => {
            console.log('clicked');
            show(true);
          }}>
          <SelectedOption>
            <Text>{options[value]}</Text>
            <Text>{`\\/`}</Text>
          </SelectedOption>
        </ClickContainer>
      )}
    </MainParent>
  );
}

export function Option(props) {
  let newProps = {...props};
  newProps.children = newProps.children.toString();

  return <Text {...newProps}></Text>;
}
