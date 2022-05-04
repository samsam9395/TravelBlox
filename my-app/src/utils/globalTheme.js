import styled from 'styled-components';

export const themeColours = {
  orange: '#f1651d',
  light_orange: '#fea360',
  pale: '#fceebf',
  lighter_blue: '#54cfd673',
  light_blue: '#55cfd6',
  blue: '#0a97b7',
  dark_blue: '#00213a',
};

// ref url: https://colorpalettes.net/color-palette-2368/
// dark blue here: https://colorpalettes.net/color-palette-3901/

export const LightOrangeBtn = styled.button`
  min-width: 100px;
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.light_orange};
  margin: 5px;
  &:hover {
    cursor: pointer;
  }
`;

export const LightBlueBtn = styled.button`
  min-width: 100px;
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.light_blue};
  margin: 5px;
  &:hover {
    cursor: pointer;
  }
`;

export const OrangeBtn = styled.button`
  min-width: 100px;
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.orange};
  margin: 5px;
  &:hover {
    cursor: pointer;
  }
`;

export const BlueBtn = styled.button`
  min-width: 100px;
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.blue};
  margin: 5px;
  &:hover {
    cursor: pointer;
  }
`;

export const PaleBtn = styled.button`
  min-width: 100px;
  padding: 10px 20px;
  border-radius: 15px;
  border: none;
  background-color: ${themeColours.pale};
  margin: 5px;
  &:hover {
    cursor: pointer;
  }
`;

export const FlexColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .upload_icon {
    margin: auto;
    height: 150px;
    &:hover {
      cursor: pointer;
    }
  }
`;

export const EditableMainImageContainer = styled.div`
  height: 400px;
  width: auto;
  object-fit: contain;
`;
export const EditableMainImage = styled.img`
  min-width: 150px;
  width: auto;
  height: 100%;
  object-fit: cover;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;
