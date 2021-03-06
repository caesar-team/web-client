import React from 'react';
import styled from 'styled-components';
import { ProgressBar, Icon, Button } from '@caesar/components';
import { IMPORT_PROGRESS_THRESHOLD } from '@caesar/common/constants';

const Wrapper = styled.div``;

const Text = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

const WarningText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
  margin-left: 10px;
`;

const ProgressBarStyled = styled(ProgressBar)`
  margin: 10px 0 40px;
`;

const CenterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconInboxStyled = styled(Icon)`
  margin-bottom: 10px;
`;

const TwoItemsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const renderText = progress =>
  progress < IMPORT_PROGRESS_THRESHOLD
    ? `Waiting... ${Math.round(progress * 100)}%`
    : 'Done!';

const ImportingStep = ({ progress, onClickToDashboard }) => (
  <Wrapper>
    <Text>CSV Import</Text>
    <CenterWrapper>
      <IconInboxStyled name="inbox" width={40} height={36} />
      <Text>{renderText(progress)}</Text>
    </CenterWrapper>
    <ProgressBarStyled value={progress} />
    <TwoItemsWrapper>
      <TwoItemsWrapper>
        <Icon name="warning" width={18} height={18} />
        <WarningText>
          Don’t close the browser because migration process will stop!
        </WarningText>
      </TwoItemsWrapper>
      <Button
        color="white"
        disabled={progress < IMPORT_PROGRESS_THRESHOLD}
        onClick={onClickToDashboard}
      >
        Go to dashboard
      </Button>
    </TwoItemsWrapper>
  </Wrapper>
);

export default ImportingStep;
