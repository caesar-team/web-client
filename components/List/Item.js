import React from 'react';
import styled, { css } from 'styled-components';
import { formatDate } from 'common/utils/dateUtils';
import { Icon } from '../Icon';

const ItemType = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.gray};
  border-radius: 3px;
  margin-right: 20px;
  width: 40px;
  min-width: 40px;
  height: 40px;
`;

const Details = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  line-height: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.black};
  margin-bottom: 8px;
`;

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledBox = styled(Box)`
  margin-left: 20px;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const IconText = styled.div`
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
`;

const StyledIcon = styled(Icon)`
  fill: ${({ theme }) => theme.gray};
  margin-right: 5px;
`;

const FavoriteIcon = styled(Icon)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  padding: 20px 30px 20px;
  background: ${({ theme, isActive }) =>
    isActive ? theme.white : theme.lightBlue};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.gallery};

  ${({ isMultiItem, isActive }) =>
    isActive &&
    isMultiItem &&
    css`
      background: ${({ theme }) => theme.black};

      ${Title}, ${IconText} {
        color: ${({ theme }) => theme.white};
      }

      ${Text} {
        color: ${({ theme }) => theme.gray};
      }

      ${StyledIcon} {
        fill: ${({ theme }) => theme.white};
      }
    `}
`;

const Item = ({
  id,
  lastUpdated,
  secret: { name, attachments },
  invited,
  isMultiItem = false,
  isActive = false,
  favorite,
  onClickItem = Function.prototype,
}) => {
  const shouldShowMembers = !!invited.length;
  const shouldShowAttachments = attachments && attachments.length > 0;

  return (
    <Row
      key={id}
      onClick={onClickItem(id)}
      isActive={isActive}
      isMultiItem={isMultiItem}
    >
      <ItemType>
        <Icon name="key" width={20} height={20} fill="#fff" />
      </ItemType>
      <Details>
        <Title>{name}</Title>
        <Box>
          <Text>{formatDate(lastUpdated)}</Text>
          <Box>
            {shouldShowAttachments && (
              <Box>
                <StyledIcon name="clip" width={14} height={14} />
                <IconText>{attachments.length}</IconText>
              </Box>
            )}
            {shouldShowMembers && (
              <StyledBox>
                <StyledIcon name="group" width={14} height={14} />
                <IconText>{invited.length}</IconText>
              </StyledBox>
            )}
          </Box>
        </Box>
      </Details>
      {favorite && (
        <FavoriteIcon name="favorite-active" width={14} height={14} />
      )}
    </Row>
  );
};

export default Item;
