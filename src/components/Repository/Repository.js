import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  shape, string, number, func,
} from 'prop-types';

import {
  Container,
  Name,
  Description,
  Stats,
  Stat,
  StatCount,
  Actions,
  Refresh,
  RefreshText,
} from './Repository.styles';

export default function Repository({
  data: {
    name, description, stars, forks,
  },
  onRefresh,
  onDelete,
}) {
  return (
    <Container>
      <Name>{name}</Name>
      <Description>{description}</Description>

      <Stats>
        <Stat>
          <Icon name="star" size={16} color="#333" />
          <StatCount>{stars}</StatCount>
        </Stat>
        <Stat>
          <Icon name="code-fork" size={16} color="#333" />
          <StatCount>{forks}</StatCount>
        </Stat>
      </Stats>

      <Actions>
        <Refresh onPress={onRefresh}>
          <Icon name="refresh" color="#7159c1" size={16} />
          <RefreshText>REFRESH</RefreshText>
        </Refresh>
        <Refresh onPress={onDelete}>
          <Icon name="close" color="#7159c1" size={16} />
          <RefreshText>DELETE</RefreshText>
        </Refresh>
      </Actions>
    </Container>
  );
}

Repository.propTypes = {
  data: shape({
    name: string,
    description: string,
    stars: number,
    forks: number,
  }).isRequired,
  onRefresh: func.isRequired,
  onDelete: func.isRequired,
};
