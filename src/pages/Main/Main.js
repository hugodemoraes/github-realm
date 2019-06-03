import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';
import getRealm from '~/services/realm';

import Repository from '~/components/Repository/Repository';

import {
  Container, Title, Form, Input, Submit, List,
} from './Main.styles';

export default function Main() {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    loadRepositories();
  }, []);

  async function loadRepositories() {
    const realm = await getRealm();

    const data = realm.objects('Repository').sorted('stars', true);

    setRepositories(data);
  }

  async function saveRepository(repository) {
    const data = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    };

    const realm = await getRealm();

    realm.write(() => {
      realm.create('Repository', data, 'modified');
    });

    return data;
  }

  async function handleAddRepository() {
    try {
      const { data } = await api.get(`/repos/${input}`);

      await saveRepository(data);

      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      setError(true);
    }
  }

  async function handleRefreshRepository({ fullName }) {
    const { data } = await api.get(`/repos/${fullName}`);

    const newRepo = await saveRepository(data);

    setRepositories(repositories.map(repo => (repo.id === newRepo.id ? newRepo : repo)));
  }

  async function handleDeleteRepository({ id }) {
    const realm = await getRealm();
    const repository = realm.objectForPrimaryKey('Repository', id);

    realm.write(() => {
      realm.delete(repository);
    });

    loadRepositories();
  }

  return (
    <Container>
      <Title>Repositories</Title>

      <Form>
        <Input
          value={input}
          error={error}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search repository..."
        />
        <Submit onPress={handleAddRepository}>
          <Icon name="add" size={22} color="#FFF" />
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={repositories}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <Repository
            data={item}
            onRefresh={() => handleRefreshRepository(item)}
            onDelete={() => handleDeleteRepository(item)}
          />
        )}
      />
    </Container>
  );
}
