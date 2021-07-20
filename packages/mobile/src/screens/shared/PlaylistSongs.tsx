import React, { useEffect, useState } from 'react';
import { Title, Button, Divider, Subheading, IconButton } from 'react-native-paper';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import FastImage from 'react-native-fast-image';
import { Screen } from '@serenity/components';
import { selectPlaylistSongsById } from '@serenity/core';
import { DefaultImage } from '../../components/DefaultImage';
import { EmptyPlaylist } from '../../components/EmptyPlaylist';

import { TrackProps } from '../../utils/types';
import { TrackContainer } from '../../containers/TrackContainer';

export const PlaylistSongs = ({ route, navigation }) => {
  const { playlist, filter } = route.params;
  const songs = useSelector(state => selectPlaylistSongsById(state, playlist.id));

  const dispatch = useDispatch();

  const addSongToQueue = () => {
    dispatch(addSongToQueue(values(songs)));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="play-circle-outline"
          onPress={addSongToQueue}
        />
      ),
    });
  }, [navigation]);





  return (
    <Screen>
      {isEmpty(songs) ? (
        <EmptyPlaylist />
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <View style={{ margin: 12 }}>
              <View style={styles.coverContainer}>
                {playlist.cover ? (
                  <FastImage
                    source={{ uri: playlist.cover }}
                    style={styles.artCover}
                  />
                ) : (
                  <DefaultImage style={styles.artCover} />
                )}
              </View>
              <View style={styles.titleContainer}>
                <Title>{playlist.name}</Title>
                <Subheading>{`by ${playlist.owner}`}</Subheading>
              </View>
              <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={addSongToQueue}>
                  Play All
                </Button>
              </View>
            </View>
          )}
          data={songs}
          renderItem={({ item }: { item: TrackProps }) => (
            <TrackContainer track={item} />
          )}
          ItemSeparatorComponent={() => <Divider inset />}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  artCover: { width: 200, height: 200, elevation: 4, borderRadius: 12 },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});
