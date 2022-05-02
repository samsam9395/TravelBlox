import React, { useState, useEffect } from 'react';
import AttractionInput from './AttractionInput';
import { LightOrangeBtn } from '../../utils/globalTheme';
import styled from 'styled-components';
import { themeColours } from '../../utils/globalTheme';

const QuestionText = styled.div`
  margin-top: 50px;
  font-size: 25px;
  font-weight: 600px;
  font-style: italic;
  display: flex;
  div {
    padding: 0 8px;
    color: ${themeColours.orange};
    text-decoration: dotted 4px underline;
    &:hover {
      cursor: pointer;
    }
  }
`;

function ToggleAttractionSearch() {
  const [showRecommends, setShowRecommends] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <QuestionText>
        Need some planning{' '}
        <div onClick={() => setShowSearch(!showSearch)}>idea</div>?
      </QuestionText>
      {showSearch && (
        <>
          <AttractionInput
            showRecommends={showRecommends}
            setShowRecommends={setShowRecommends}
          />
          <LightOrangeBtn onClick={() => setShowRecommends(!showRecommends)}>
            Hide Cards
          </LightOrangeBtn>
        </>
      )}
    </>
  );
}

export default ToggleAttractionSearch;
